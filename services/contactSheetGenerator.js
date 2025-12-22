const sharp = require('sharp');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');
const { app } = require('electron');
const { resizeThumbnail } = require('./imageProcessor');

// Register Kode Mono font from assets
// Handle both development and packaged app paths
let fontPath;
if (app.isPackaged) {
  // In packaged app, assets are in app.asar.unpacked
  fontPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'assets', 'KodeMono.ttf');
} else {
  // In development, use relative path
  fontPath = path.join(__dirname, '..', 'assets', 'KodeMono.ttf');
}

try {
  registerFont(fontPath, { family: 'Kode Mono' });
  console.log('✓ Kode Mono font registered successfully from:', fontPath);
} catch (error) {
  console.warn('⚠ Could not register Kode Mono font, will use fallback:', error.message);
  console.warn('   Tried path:', fontPath);
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
 * Calculate grid to fit all images on one sheet
 * @param {number} totalImages - Total number of images to fit
 * @param {number} aspectRatio - Aspect ratio as decimal
 * @param {number} canvasWidth - Canvas width in pixels
 * @param {number} canvasHeight - Canvas height in pixels
 * @param {number} scale - Resolution scale factor
 * @returns {Object} Grid parameters
 */
function calculateSingleSheetGrid(totalImages, aspectRatio, canvasWidth, canvasHeight, scale) {
  const margin = 40 * scale;
  const spacingX = 16 * scale;
  const spacingY = 24 * scale;
  const filenameHeight = 36 * scale;
  const gridStartY = 120 * scale;
  const bottomMargin = 20 * scale;
  
  const availableWidth = canvasWidth - (margin * 2);
  const availableHeight = canvasHeight - gridStartY - bottomMargin;
  
  // Try different column counts to find the best fit
  let bestConfig = null;
  let largestThumbnailSize = 0;
  
  for (let cols = 1; cols <= Math.min(12, totalImages); cols++) {
    const rows = Math.ceil(totalImages / cols);
    
    // Calculate thumbnail dimensions for this configuration
    const thumbnailWidth = Math.floor((availableWidth - (spacingX * (cols - 1))) / cols);
    const imageHeight = Math.floor(thumbnailWidth / aspectRatio);
    const thumbnailHeight = imageHeight + filenameHeight;
    
    // Check if it fits vertically
    const requiredHeight = (thumbnailHeight * rows) + (spacingY * (rows - 1));
    
    if (requiredHeight <= availableHeight) {
      // This configuration fits! Check if thumbnails are larger than previous best
      const thumbnailArea = thumbnailWidth * thumbnailHeight;
      if (thumbnailArea > largestThumbnailSize) {
        largestThumbnailSize = thumbnailArea;
        bestConfig = {
          columns: cols,
          rows: rows,
          imagesPerSheet: cols * rows,
          thumbnailWidth,
          thumbnailHeight,
          imageHeight
        };
      }
    }
  }
  
  if (!bestConfig) {
    // Fallback: squeeze into available space (shouldn't happen with reasonable image counts)
    const cols = Math.ceil(Math.sqrt(totalImages));
    const rows = Math.ceil(totalImages / cols);
    const thumbnailWidth = Math.floor((availableWidth - (spacingX * (cols - 1))) / cols);
    const imageHeight = Math.floor(thumbnailWidth / aspectRatio);
    const thumbnailHeight = imageHeight + filenameHeight;
    
    bestConfig = {
      columns: cols,
      rows: rows,
      imagesPerSheet: cols * rows,
      thumbnailWidth,
      thumbnailHeight,
      imageHeight
    };
  }
  
  // Calculate distributed vertical spacing to fill available height
  if (bestConfig.rows > 1) {
    const totalThumbnailHeight = bestConfig.thumbnailHeight * bestConfig.rows;
    const remainingHeight = availableHeight - totalThumbnailHeight;
    const spacingCount = bestConfig.rows - 1;
    
    if (remainingHeight > 0 && spacingCount > 0) {
      // Distribute remaining height evenly between rows
      bestConfig.spacingY = Math.floor(remainingHeight / spacingCount);
    } else {
      bestConfig.spacingY = spacingY;
    }
  } else {
    bestConfig.spacingY = spacingY;
  }
  
  console.log(`📋 Single sheet mode: ${bestConfig.columns}×${bestConfig.rows} grid for ${totalImages} images (spacing: ${bestConfig.spacingY}px)`);
  
  return bestConfig;
}

/**
 * Calculate optimal grid dimensions based on aspect ratio and fixed canvas size
 * @param {number} aspectRatio - Aspect ratio as decimal (e.g., 1.5 for 3:2)
 * @param {number} canvasWidth - Canvas width in pixels
 * @param {number} canvasHeight - Canvas height in pixels (fixed)
 * @param {number} scale - Resolution scale factor
 * @returns {Object} Grid parameters
 */
function calculateOptimalGrid(aspectRatio, canvasWidth, canvasHeight, scale) {
  // Target: 4-7 columns for good balance based on aspect ratio
  const targetColumns = aspectRatio > 1.5 ? 7 :  // Wide images (16:9, 3:2)
                       aspectRatio > 1.2 ? 6 :   // Medium landscape (4:3)
                       aspectRatio > 0.8 ? 6 :   // Square (1:1)
                       aspectRatio > 0.6 ? 5 :   // Medium portrait (3:4, 2:3)
                       4;                         // Tall portrait (9:16)
  
  // Calculate thumbnail dimensions based on columns
  const margin = 40 * scale;
  const spacingX = 16 * scale;
  const availableWidth = canvasWidth - (margin * 2);
  const thumbnailWidth = Math.floor((availableWidth - (spacingX * (targetColumns - 1))) / targetColumns);
  
  const filenameHeight = 36 * scale;
  const imageHeight = Math.floor(thumbnailWidth / aspectRatio);
  const thumbnailHeight = imageHeight + filenameHeight;
  
  // Calculate how many rows fit in the FIXED canvas height
  const gridStartY = 120 * scale;
  const bottomMargin = 20 * scale;
  const spacingY = 24 * scale;
  const availableHeight = canvasHeight - gridStartY - bottomMargin;
  
  const rows = Math.floor((availableHeight + spacingY) / (thumbnailHeight + spacingY));
  
  console.log(`📊 Grid: ${targetColumns}×${rows} = ${targetColumns * rows} images/sheet (aspect: ${aspectRatio.toFixed(2)})`);
  
  return {
    columns: targetColumns,
    rows: rows,
    imagesPerSheet: targetColumns * rows,
    thumbnailWidth,
    thumbnailHeight,
    imageHeight
  };
}

/**
 * Calculate grid for resize-sheet modes (width or height)
 * @param {number} totalImages - Total number of images to fit
 * @param {number} aspectRatio - Aspect ratio as decimal
 * @param {number} baseCanvasWidth - Base canvas width
 * @param {number} baseCanvasHeight - Base canvas height
 * @param {number} scale - Resolution scale factor
 * @param {string} resizeMode - 'width' or 'height'
 * @returns {Object} Grid parameters with adjusted canvas dimensions
 */
function calculateResizeSheetGrid(totalImages, aspectRatio, baseCanvasWidth, baseCanvasHeight, scale, resizeMode) {
  const margin = 40 * scale;
  const spacingX = 16 * scale;
  const spacingY = 24 * scale;
  const filenameHeight = 36 * scale;
  const gridStartY = 120 * scale;
  const bottomMargin = 20 * scale;
  
  // Use default grid logic to get standard thumbnail dimensions
  const tempGrid = calculateOptimalGrid(aspectRatio, baseCanvasWidth, baseCanvasHeight, scale);
  const thumbnailWidth = tempGrid.thumbnailWidth;
  const imageHeight = tempGrid.imageHeight;
  const thumbnailHeight = imageHeight + filenameHeight;
  
  let cols, rows, canvasWidth, canvasHeight;
  
  if (resizeMode === 'width') {
    // Resize Width: Keep default rows, expand columns as needed
    // Calculate how many rows fit in the fixed height
    const availableHeight = baseCanvasHeight - gridStartY - bottomMargin;
    const maxRows = Math.floor((availableHeight + spacingY) / (thumbnailHeight + spacingY));
    
    // Calculate columns needed to fit all images in those rows
    rows = Math.min(maxRows, totalImages); // Don't use more rows than images
    cols = Math.ceil(totalImages / rows);
    
    // Calculate required width for those columns
    const requiredWidth = (thumbnailWidth * cols) + (spacingX * (cols - 1)) + (margin * 2);
    canvasWidth = requiredWidth;
    canvasHeight = baseCanvasHeight;
    
  } else { // 'height'
    // Resize Height: Keep default columns, expand rows as needed
    cols = tempGrid.columns;
    rows = Math.ceil(totalImages / cols);
    
    // Calculate required height for those rows
    const requiredHeight = gridStartY + (thumbnailHeight * rows) + (spacingY * (rows - 1)) + bottomMargin;
    canvasWidth = baseCanvasWidth;
    canvasHeight = requiredHeight;
  }
  
  console.log(`📋 Resize sheet (${resizeMode}): ${cols}×${rows} grid for ${totalImages} images, canvas: ${Math.round(canvasWidth)}×${Math.round(canvasHeight)}`);
  
  return {
    columns: cols,
    rows: rows,
    imagesPerSheet: totalImages, // All images fit on one sheet
    thumbnailWidth,
    thumbnailHeight,
    imageHeight,
    spacingY,
    canvasWidth,
    canvasHeight
  };
}

/**
 * Get scaled dimensions based on resolution scale and aspect ratio
 * @param {number} scale - Resolution scale factor (1 = 2K, 2 = 4K, 3 = 6K, 4 = 8K)
 * @param {string} aspectRatioString - Desired aspect ratio (e.g., "3:2")
 * @param {number} totalImages - Optional: if provided, calculates grid to fit all images on one sheet
 * @param {string} containmentMethod - Method for containing images: 'resize-thumbnail', 'resize-sheet-w', or 'resize-sheet-h'
 * @returns {Object} Scaled dimensions
 */
function getScaledDimensions(scale = 2, aspectRatioString = '3:2', totalImages = null, containmentMethod = 'resize-thumbnail') {
  const BASE_WIDTH = 2048;
  const BASE_HEIGHT = 1782; // Fixed canvas height
  
  let CANVAS_WIDTH = BASE_WIDTH * scale;
  let CANVAS_HEIGHT = BASE_HEIGHT * scale;
  
  // Parse aspect ratio
  const aspectRatio = parseAspectRatio(aspectRatioString);
  
  // Calculate grid based on containment method
  let grid;
  
  if (totalImages && containmentMethod === 'resize-sheet-w') {
    // Resize sheet width: maintain default thumbnail size, expand width
    grid = calculateResizeSheetGrid(totalImages, aspectRatio, CANVAS_WIDTH, CANVAS_HEIGHT, scale, 'width');
    CANVAS_WIDTH = grid.canvasWidth;
  } else if (totalImages && containmentMethod === 'resize-sheet-h') {
    // Resize sheet height: maintain default thumbnail size, expand height
    grid = calculateResizeSheetGrid(totalImages, aspectRatio, CANVAS_WIDTH, CANVAS_HEIGHT, scale, 'height');
    CANVAS_HEIGHT = grid.canvasHeight;
  } else if (totalImages) {
    // Resize thumbnail: fit all images by shrinking thumbnails (default single-sheet behavior)
    grid = calculateSingleSheetGrid(totalImages, aspectRatio, CANVAS_WIDTH, CANVAS_HEIGHT, scale);
  } else {
    // Multi-sheet mode: use optimal grid
    grid = calculateOptimalGrid(aspectRatio, CANVAS_WIDTH, CANVAS_HEIGHT, scale);
  }
  
  // Calculate grid dimensions
  const TITLE_HEIGHT = 80 * scale;
  const GRID_START_Y = 120 * scale;
  const BOTTOM_MARGIN = 20 * scale;
  const DEFAULT_SPACING_Y = 24 * scale;
  
  const GRID_HEIGHT = CANVAS_HEIGHT - GRID_START_Y - BOTTOM_MARGIN;
  
  const HORIZONTAL_MARGIN = 40 * scale;
  const THUMBNAIL_SPACING_X = 16 * scale;
  const FILENAME_HEIGHT = 36 * scale;
  const FILENAME_GAP = 6 * scale;
  
  // Use distributed spacing from grid calculation if available (single-sheet mode)
  const THUMBNAIL_SPACING_Y = grid.spacingY !== undefined ? grid.spacingY : DEFAULT_SPACING_Y;
  
  return {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    TITLE_HEIGHT,
    GRID_START_Y,
    GRID_HEIGHT,
    HORIZONTAL_MARGIN,
    VERTICAL_MARGIN: BOTTOM_MARGIN,
    AVAILABLE_WIDTH: CANVAS_WIDTH - (HORIZONTAL_MARGIN * 2),
    AVAILABLE_HEIGHT: GRID_HEIGHT,
    THUMBNAIL_SPACING_X,
    THUMBNAIL_SPACING_Y,
    THUMBNAIL_WIDTH: grid.thumbnailWidth,
    THUMBNAIL_HEIGHT: grid.thumbnailHeight,
    FILENAME_HEIGHT,
    FILENAME_GAP,
    IMAGE_HEIGHT: grid.imageHeight,
    TITLE_FONT_SIZE: 29 * scale,
    LABEL_FONT_SIZE: 14 * scale,
    LETTER_SPACING: 2 * scale,
    // Grid dimensions (dynamic)
    COLUMNS: grid.columns,
    ROWS: grid.rows,
    IMAGES_PER_SHEET: grid.imagesPerSheet
  };
}

/**
 * Render text to a PNG buffer using canvas with embedded font
 * @param {string} text - Text to render
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {Object} options - Text rendering options
 * @returns {Promise<Buffer>} PNG buffer of rendered text
 */
async function renderTextToBuffer(text, width, height, options = {}) {
  const {
    fontSize = 29,
    fontWeight = '600',
    color = '#999999',
    textAlign = 'left',
    x = 0,
    y = height / 2,
    letterSpacing = 2
  } = options;
  
  // Create canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Set font
  ctx.font = `${fontWeight} ${fontSize}px "Kode Mono", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'middle';
  
  // Apply letter spacing by drawing each character individually
  if (letterSpacing > 0 && text.length > 1) {
    let currentX = x;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      ctx.fillText(char, currentX, y);
      const metrics = ctx.measureText(char);
      currentX += metrics.width + letterSpacing;
    }
  } else {
    ctx.fillText(text, x, y);
  }
  
  // Convert to PNG buffer
  return canvas.toBuffer('image/png');
}

/**
 * Render label text (shot number and filename) to a PNG buffer
 * @param {string} shotNumber - Shot number (e.g., "01")
 * @param {string} filename - Filename to display
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} fontSize - Font size for the label
 * @param {number} gap - Gap from top
 * @returns {Promise<Buffer>} PNG buffer of rendered label
 */
async function renderLabelToBuffer(shotNumber, filename, width, height, fontSize = 14, gap = 6) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Set font
  ctx.font = `400 ${fontSize}px "Kode Mono", monospace`;
  ctx.fillStyle = '#999999';
  
  // Draw shot number (left aligned)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(shotNumber, 0, gap + 2);
  
  // Draw filename (right aligned)
  ctx.textAlign = 'right';
  ctx.fillText(filename, width, gap + 2);
  
  // Convert to PNG buffer
  return canvas.toBuffer('image/png');
}

/**
 * Generate contact sheets from processed images
 * @param {Array} processedImages - Array of processed image objects
 * @param {string} title - Title for the contact sheet
 * @param {string} aspectRatio - Desired aspect ratio (e.g., "3:2")
 * @param {boolean} showOutline - Whether to draw outline around thumbnails
 * @param {boolean} containToOneSheet - Whether to fit all images on one sheet
 * @param {number} totalImages - Total image count (used for single-sheet mode)
 * @param {number} resolutionScale - Resolution scale factor (1 = 2K, 2 = 4K, 3 = 6K, 4 = 8K)
 * @param {number} dpi - DPI (dots per inch) for output image metadata
 * @returns {Promise<Array>} Array of contact sheet objects with PNG buffers
 */
async function generateContactSheets(processedImages, title, aspectRatio = '3:2', showOutline = false, containToOneSheet = false, containmentMethod = 'resize-thumbnail', totalImages = null, resolutionScale = 2, dpi = 300) {
  const sheets = [];
  
  // Calculate images per sheet based on mode
  let dims, IMAGES_PER_SHEET;
  
  if (containToOneSheet) {
    // Single-sheet mode: fit all images on one sheet
    dims = getScaledDimensions(resolutionScale, aspectRatio, processedImages.length, containmentMethod);
    IMAGES_PER_SHEET = processedImages.length; // All images go on one sheet
    console.log(`📋 Single-sheet mode (${containmentMethod}): Fitting ${processedImages.length} images (${dims.COLUMNS}×${dims.ROWS})`);
  } else {
    // Multi-sheet mode: use optimal grid
    dims = getScaledDimensions(resolutionScale, aspectRatio);
    IMAGES_PER_SHEET = dims.IMAGES_PER_SHEET;
    console.log(`📋 Multi-sheet mode: ${IMAGES_PER_SHEET} images per sheet (${dims.COLUMNS}×${dims.ROWS})`);
  }
  
  const totalSheets = Math.ceil(processedImages.length / IMAGES_PER_SHEET);
  
  // Split images into batches based on calculated images per sheet
  for (let sheetIndex = 0; sheetIndex < totalSheets; sheetIndex++) {
    const startIndex = sheetIndex * IMAGES_PER_SHEET;
    const endIndex = Math.min(startIndex + IMAGES_PER_SHEET, processedImages.length);
    const batchImages = processedImages.slice(startIndex, endIndex);
    
    // Generate sheet title (always add pagination if multiple sheets)
    const sheetTitle = totalSheets > 1 ? `${title} (${sheetIndex + 1}/${totalSheets})` : title;
    
    // Pass totalImages and containmentMethod for single-sheet mode
    const sheetBuffer = await generateSingleSheet(
      batchImages, 
      sheetTitle, 
      aspectRatio, 
      showOutline, 
      containToOneSheet ? batchImages.length : null,
      containmentMethod,
      resolutionScale, 
      dpi
    );
    
    sheets.push({
      index: sheetIndex,
      title: sheetTitle,
      buffer: sheetBuffer
    });
  }
  
  return sheets;
}

/**
 * Generate a single contact sheet
 * @param {Array} images - Array of image objects for this sheet
 * @param {string} title - Title for this sheet
 * @param {string} aspectRatio - Desired aspect ratio (e.g., "3:2")
 * @param {boolean} showOutline - Whether to draw outline around thumbnails
 * @param {number} resolutionScale - Resolution scale factor (1 = 2K, 2 = 4K, 3 = 6K, 4 = 8K)
 * @param {number} dpi - DPI (dots per inch) for output image metadata
 * @returns {Promise<Buffer>} PNG buffer of the contact sheet
 */
async function generateSingleSheet(images, title, aspectRatio = '3:2', showOutline = false, totalImages = null, containmentMethod = 'resize-thumbnail', resolutionScale = 2, dpi = 300) {
  // Get scaled dimensions with aspect ratio (and optional totalImages for single-sheet mode)
  const dims = getScaledDimensions(resolutionScale, aspectRatio, totalImages, containmentMethod);
  
  // Create black background
  let canvas = sharp({
    create: {
      width: dims.CANVAS_WIDTH,
      height: dims.CANVAS_HEIGHT,
      channels: 3,
      background: { r: 0, g: 0, b: 0 }
    }
  });
  
  // Render title using canvas with embedded Kode Mono font
  const titleUppercase = title.toUpperCase();
  const titleBuffer = await renderTextToBuffer(titleUppercase, dims.CANVAS_WIDTH, dims.TITLE_HEIGHT, {
    fontSize: dims.TITLE_FONT_SIZE,
    fontWeight: '600',
    color: '#999999',
    textAlign: 'left',
    x: dims.HORIZONTAL_MARGIN,
    y: dims.TITLE_HEIGHT * 0.65,
    letterSpacing: dims.LETTER_SPACING
  });
  
  // Prepare composite operations array
  const compositeOps = [
    // Add title
    {
      input: titleBuffer,
      top: 0,
      left: 0
    }
  ];
  
  // Process and position each image
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const row = Math.floor(i / dims.COLUMNS);
    const col = i % dims.COLUMNS;
    
    // Calculate position
    const x = dims.HORIZONTAL_MARGIN + col * (dims.THUMBNAIL_WIDTH + dims.THUMBNAIL_SPACING_X);
    const y = dims.GRID_START_Y + row * (dims.THUMBNAIL_HEIGHT + dims.THUMBNAIL_SPACING_Y);
    
    try {
      // Resize thumbnail to fit (just the image part, not including filename space)
      const thumbnailBuffer = await resizeThumbnail(
        image.buffer,
        dims.THUMBNAIL_WIDTH,
        dims.IMAGE_HEIGHT,
        aspectRatio
      );
      
      // Add thumbnail to composite
      compositeOps.push({
        input: thumbnailBuffer,
        top: y,
        left: x
      });
      
      // Create label with shot number (left) and filename (right) using canvas
      const shotNumber = String(i + 1).padStart(2, '0');
      const filename = truncateFilename(image.filename, dims.THUMBNAIL_WIDTH - (40 * resolutionScale)); // Leave space for shot number
      const labelBuffer = await renderLabelToBuffer(shotNumber, filename, dims.THUMBNAIL_WIDTH, dims.FILENAME_HEIGHT, dims.LABEL_FONT_SIZE, dims.FILENAME_GAP);
      
      compositeOps.push({
        input: labelBuffer,
        top: y + dims.IMAGE_HEIGHT,
        left: x
      });
      
      // Add outline if enabled
      if (showOutline) {
        const strokeWidth = Math.max(1, resolutionScale); // Scale stroke width
        const outlineSvg = `
          <svg width="${dims.THUMBNAIL_WIDTH}" height="${dims.IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="${dims.THUMBNAIL_WIDTH}" height="${dims.IMAGE_HEIGHT}" 
                  fill="none" stroke="#808080" stroke-width="${strokeWidth}"/>
          </svg>
        `;
        
        const outlineBuffer = await sharp(Buffer.from(outlineSvg))
          .png()
          .toBuffer();
        
        compositeOps.push({
          input: outlineBuffer,
          top: y,
          left: x
        });
      }
      
    } catch (error) {
      console.error(`Error processing image ${image.filename}:`, error.message);
      
      // Create error placeholder
      const errorPlaceholder = await sharp({
        create: {
          width: dims.THUMBNAIL_WIDTH,
          height: dims.IMAGE_HEIGHT,
          channels: 3,
          background: { r: 51, g: 51, b: 51 }
        }
      }).png().toBuffer();
      
      compositeOps.push({
        input: errorPlaceholder,
        top: y,
        left: x
      });
    }
  }
  
  // Composite all elements onto the canvas
  const buffer = await canvas
    .composite(compositeOps)
    .png()
    .withMetadata({ density: dpi })
    .toBuffer();
  
  return buffer;
}


/**
 * Truncate filename to fit within max width (approximate)
 * @param {string} filename - Original filename
 * @param {number} maxWidth - Maximum width in pixels
 * @returns {string} Truncated filename
 */
function truncateFilename(filename, maxWidth) {
  // Approximate: 8 pixels per character for 14px Arial
  const maxChars = Math.floor(maxWidth / 8);
  
  if (filename.length <= maxChars) {
    return filename;
  }
  
  // Truncate with ellipsis
  return filename.substring(0, maxChars - 3) + '...';
}

/**
 * Calculate how many images fit on one sheet for a given aspect ratio
 * @param {string} aspectRatioString - Aspect ratio string (e.g., "3:2")
 * @param {number} resolutionScale - Resolution scale factor
 * @returns {number} Number of images per sheet
 */
function calculateImagesPerSheet(aspectRatioString, resolutionScale = 2) {
  const dims = getScaledDimensions(resolutionScale, aspectRatioString);
  return dims.IMAGES_PER_SHEET;
}

module.exports = {
  generateContactSheets,
  generateSingleSheet,
  calculateImagesPerSheet
};

