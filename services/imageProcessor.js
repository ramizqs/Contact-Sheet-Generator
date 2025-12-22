const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Supported image formats
const SUPPORTED_FORMATS = [
  '.jpg', '.jpeg', '.png', '.tiff', '.tif', '.gif', '.bmp', '.dng',
  '.cr2', '.nef', '.arw', '.orf', '.rw2', '.raf'
];

/**
 * Scan a folder for supported image files
 * @param {string} folderPath - Path to the folder to scan
 * @returns {Promise<string[]>} Array of image file paths
 */
async function scanFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    
    // Filter for supported image formats and exclude macOS metadata files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      // Exclude macOS AppleDouble files (._filename) and system files
      const isSystemFile = file.startsWith('._') || file === '.DS_Store';
      return SUPPORTED_FORMATS.includes(ext) && !isSystemFile;
    });
    
    // Sort alphabetically
    imageFiles.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    
    // Return full paths
    return imageFiles.map(file => path.join(folderPath, file));
  } catch (error) {
    throw new Error(`Error scanning folder: ${error.message}`);
  }
}

/**
 * Load an image and return its buffer
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<Buffer>} Image buffer
 */
async function loadImage(imagePath) {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    
    // For RAW/DNG files, Sharp can extract embedded preview
    if (['.dng', '.cr2', '.nef', '.arw', '.orf', '.rw2', '.raf'].includes(ext)) {
      // Sharp will extract the embedded JPEG preview from RAW files
      const buffer = await sharp(imagePath)
        .rotate() // Auto-rotate based on EXIF
        .toBuffer();
      return buffer;
    }
    
    // For standard formats, just read with sharp
    const buffer = await sharp(imagePath)
      .rotate() // Auto-rotate based on EXIF
      .toBuffer();
    return buffer;
  } catch (error) {
    console.error(`Error loading image ${imagePath}:`, error.message);
    // Return null for failed images so we can skip them
    return null;
  }
}

/**
 * Parse aspect ratio string to number
 * @param {string} ratioString - Aspect ratio string (e.g., "3:2")
 * @returns {number} Aspect ratio as decimal
 */
function parseAspectRatio(ratioString) {
  const [width, height] = ratioString.split(':').map(Number);
  return width / height;
}

/**
 * Resize image to thumbnail size maintaining aspect ratio
 * @param {Buffer} imageBuffer - Input image buffer
 * @param {number} targetWidth - Target width
 * @param {number} targetHeight - Target height
 * @param {string} aspectRatioString - Desired aspect ratio (e.g., "3:2")
 * @returns {Promise<Buffer>} Resized image buffer
 */
async function resizeThumbnail(imageBuffer, targetWidth, targetHeight, aspectRatioString = '3:2') {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    
    // Calculate scaling to maintain desired aspect ratio and fit within target
    const aspectRatio = parseAspectRatio(aspectRatioString);
    let resizeWidth, resizeHeight;
    
    // Calculate dimensions to fit desired ratio
    if (targetWidth / targetHeight > aspectRatio) {
      // Container is wider than desired ratio
      resizeHeight = targetHeight;
      resizeWidth = Math.round(targetHeight * aspectRatio);
    } else {
      // Container is taller than desired ratio
      resizeWidth = targetWidth;
      resizeHeight = Math.round(targetWidth / aspectRatio);
    }
    
    // Resize and composite on black background
    const resized = await sharp(imageBuffer)
      .resize(resizeWidth, resizeHeight, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .toBuffer();
    
    // Now extend to exact target size with black background (letterboxing/pillarboxing)
    const final = await sharp(resized)
      .extend({
        top: Math.floor((targetHeight - resizeHeight) / 2),
        bottom: Math.ceil((targetHeight - resizeHeight) / 2),
        left: Math.floor((targetWidth - resizeWidth) / 2),
        right: Math.ceil((targetWidth - resizeWidth) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .toBuffer();
    
    return final;
  } catch (error) {
    throw new Error(`Error resizing thumbnail: ${error.message}`);
  }
}

/**
 * Load and process all images with progress callback
 * @param {string[]} imagePaths - Array of image paths
 * @param {Function} progressCallback - Callback function for progress updates
 * @returns {Promise<Array>} Array of processed image objects
 */
async function loadAndProcessImages(imagePaths, progressCallback) {
  const processedImages = [];
  
  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    
    if (progressCallback) {
      progressCallback({ current: i + 1, total: imagePaths.length });
    }
    
    try {
      const buffer = await loadImage(imagePath);
      
      if (buffer) {
        processedImages.push({
          path: imagePath,
          filename: path.basename(imagePath),
          buffer: buffer
        });
      }
    } catch (error) {
      console.error(`Skipping image ${imagePath}:`, error.message);
      // Continue with next image
    }
  }
  
  return processedImages;
}

module.exports = {
  scanFolder,
  loadImage,
  resizeThumbnail,
  loadAndProcessImages
};

