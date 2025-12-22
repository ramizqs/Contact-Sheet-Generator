const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { processRawWithSips, extractDngPreview, isSipsAvailable, isExiftoolAvailable } = require('./rawProcessor');

// Check if sips and exiftool are available at module load
let sipsAvailable = false;
let exiftoolAvailable = false;
(async () => {
  exiftoolAvailable = await isExiftoolAvailable();
  sipsAvailable = await isSipsAvailable();
  
  if (exiftoolAvailable) {
    console.log('✓ exiftool detected - Will extract embedded DNG previews (respects color profiles)');
  }
  if (sipsAvailable) {
    console.log('✓ macOS sips detected - RAW/DNG processing enabled');
  }
  if (!exiftoolAvailable && !sipsAvailable) {
    console.log('ℹ️  Neither exiftool nor sips available - will attempt Sharp\'s embedded preview extraction');
  }
})();

// Supported image formats
const SUPPORTED_FORMATS = [
  '.jpg', '.jpeg', '.png', '.tiff', '.tif', '.bmp', '.dng',
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
  const ext = path.extname(imagePath).toLowerCase();
  const filename = path.basename(imagePath);
  
  try {
    // For RAW/DNG files, try multiple methods in order of preference
    if (['.dng', '.cr2', '.nef', '.arw', '.orf', '.rw2', '.raf'].includes(ext)) {
      console.log(`Loading RAW file: ${filename}`);
      
      // Try exiftool first (extracts embedded preview with color profile intact)
      // This is the best method for DNGs with applied color profiles (e.g., B&W)
      if (exiftoolAvailable) {
        const previewBuffer = await extractDngPreview(imagePath);
        if (previewBuffer) {
          // Process the preview JPEG with Sharp (for rotation, etc.)
          const buffer = await sharp(previewBuffer)
            .rotate() // Auto-rotate based on EXIF
            .toBuffer();
          console.log(`  ✓ Using embedded preview (respects color profile)`);
          return buffer;
        }
        
        console.log(`  ℹ️  No embedded preview, falling back to sips...`);
      }
      
      // Fallback: Try sips (macOS native RAW processor)
      // Note: sips may not respect applied color profiles
      if (sipsAvailable) {
        const sipsBuffer = await processRawWithSips(imagePath);
        if (sipsBuffer) {
          // Process the converted JPEG with Sharp (for rotation, etc.)
          const buffer = await sharp(sipsBuffer)
            .rotate() // Auto-rotate based on EXIF
            .toBuffer();
          return buffer;
        }
        
        console.log(`  ℹ️  sips failed, trying Sharp's embedded preview extraction...`);
      }
      
      // Last resort: Try Sharp's embedded preview extraction
      try {
        const image = sharp(imagePath);
        
        // Get metadata first to verify the file can be read
        const metadata = await image.metadata();
        console.log(`  ✓ RAW metadata: ${metadata.width}x${metadata.height}, format: ${metadata.format}`);
        
        // Now process the image
        const buffer = await sharp(imagePath)
          .rotate() // Auto-rotate based on EXIF
          .jpeg() // Convert to JPEG format for processing
          .toBuffer();
        
        console.log(`  ✓ Successfully loaded ${filename} (Sharp preview extraction)`);
        return buffer;
      } catch (rawError) {
        console.error(`  ✗ RAW processing failed for ${filename}:`);
        console.error(`    Error: ${rawError.message}`);
        console.error(`    This may indicate:`);
        console.error(`    - The DNG file doesn't have an embedded preview`);
        console.error(`    - The file may be corrupted`);
        console.error(`    - Unsupported RAW format variation`);
        console.error(`    - Try installing exiftool: brew install exiftool`);
        
        // Return null to skip this image
        return null;
      }
    }
    
    // For standard formats, just read with sharp
    const buffer = await sharp(imagePath)
      .rotate() // Auto-rotate based on EXIF
      .toBuffer();
    
    return buffer;
  } catch (error) {
    console.error(`Error loading image ${filename}:`, error.message);
    console.error(`  File: ${imagePath}`);
    console.error(`  Error type: ${error.constructor.name}`);
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
 * @returns {Promise<Object>} Object with processed images array and failure stats
 */
async function loadAndProcessImages(imagePaths, progressCallback) {
  const processedImages = [];
  const failedImages = [];
  
  console.log(`\n📸 Loading ${imagePaths.length} images...`);
  
  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    const filename = path.basename(imagePath);
    
    if (progressCallback) {
      progressCallback({ current: i + 1, total: imagePaths.length });
    }
    
    try {
      const buffer = await loadImage(imagePath);
      
      if (buffer) {
        processedImages.push({
          path: imagePath,
          filename: filename,
          buffer: buffer
        });
      } else {
        // loadImage returned null (failed)
        failedImages.push(filename);
        console.warn(`⚠️  Skipped: ${filename} (failed to load)`);
      }
    } catch (error) {
      failedImages.push(filename);
      console.error(`⚠️  Skipped: ${filename} (${error.message})`);
      // Continue with next image
    }
  }
  
  // Summary
  console.log(`\n✅ Successfully loaded: ${processedImages.length}/${imagePaths.length} images`);
  if (failedImages.length > 0) {
    console.log(`❌ Failed to load: ${failedImages.length} images`);
    console.log(`   Failed files: ${failedImages.join(', ')}`);
  }
  
  return {
    images: processedImages,
    failedCount: failedImages.length,
    failedFiles: failedImages
  };
}

module.exports = {
  scanFolder,
  loadImage,
  resizeThumbnail,
  loadAndProcessImages
};

