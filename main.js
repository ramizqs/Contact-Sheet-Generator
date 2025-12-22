const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

// Fix Sharp loading in packaged app by pointing to unpacked directory
if (app.isPackaged) {
  process.env.SHARP_IGNORE_GLOBAL_LIBVIPS = '1';
  const sharpPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'sharp');
  const fsSync = require('fs');
  if (fsSync.existsSync(sharpPath)) {
    process.env.SHARP_PATH = sharpPath;
  }
}

const { scanFolder, loadAndProcessImages } = require('./services/imageProcessor');
const { generateContactSheets, calculateImagesPerSheet } = require('./services/contactSheetGenerator');
const { saveContactSheets } = require('./utils/fileSaver');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 1020,
    minWidth: 750,
    minHeight: 980,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0a'
  });

  mainWindow.loadFile('renderer/index.html');
  
  // Open DevTools in development
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// Handle aspect ratio detection
ipcMain.handle('detect-aspect-ratio', async (event, folderPath) => {
  try {
    const sharp = require('sharp');
    const imagePaths = await scanFolder(folderPath);
    
    // Sample first 30 images (or fewer if less than 30)
    const sampleSize = Math.min(30, imagePaths.length);
    const samplePaths = imagePaths.slice(0, sampleSize);
    
    const ratios = [];
    
    // Analyze each image
    for (const imagePath of samplePaths) {
      try {
        const metadata = await sharp(imagePath).metadata();
        const width = metadata.width;
        const height = metadata.height;
        
        // Calculate aspect ratio
        const ratio = width / height;
        
        ratios.push({
          ratio: ratio,
          isLandscape: width > height,
          width: width,
          height: height
        });
      } catch (error) {
        console.warn(`Could not read ${imagePath}:`, error.message);
      }
    }
    
    // Find most common aspect ratio (with landscape preference)
    const detectedRatio = detectMostCommonRatio(ratios);
    
    return { success: true, aspectRatio: detectedRatio };
  } catch (error) {
    console.error('Error detecting aspect ratio:', error);
    return { success: false, error: error.message };
  }
});

// Helper function to detect most common ratio
function detectMostCommonRatio(ratios) {
  if (ratios.length === 0) return '3:2'; // Default fallback
  
  // Group by rounded ratio
  const ratioGroups = {};
  
  ratios.forEach(({ ratio, isLandscape }) => {
    // Round to nearest standard ratio
    const standardRatio = mapToStandardRatio(ratio);
    
    if (!ratioGroups[standardRatio]) {
      ratioGroups[standardRatio] = {
        count: 0,
        landscapeCount: 0,
        portraitCount: 0
      };
    }
    
    ratioGroups[standardRatio].count++;
    if (isLandscape) {
      ratioGroups[standardRatio].landscapeCount++;
    } else {
      ratioGroups[standardRatio].portraitCount++;
    }
  });
  
  // Find most common ratio, preferring landscape
  let bestRatio = '3:2';
  let maxScore = 0;
  
  for (const [ratio, data] of Object.entries(ratioGroups)) {
    // Score = count + bonus for landscape orientation
    const score = data.count + (data.landscapeCount * 0.2);
    
    if (score > maxScore) {
      maxScore = score;
      bestRatio = ratio;
    }
  }
  
  return bestRatio;
}

// Map decimal ratio to nearest standard ratio string
function mapToStandardRatio(ratio) {
  const standardRatios = [
    { string: '16:9', value: 16/9, tolerance: 0.05 },
    { string: '3:2', value: 3/2, tolerance: 0.05 },
    { string: '4:3', value: 4/3, tolerance: 0.05 },
    { string: '1:1', value: 1, tolerance: 0.05 },
    { string: '2:3', value: 2/3, tolerance: 0.05 },
    { string: '3:4', value: 3/4, tolerance: 0.05 },
    { string: '9:16', value: 9/16, tolerance: 0.05 }
  ];
  
  // Find closest match
  let closest = standardRatios[0];
  let minDiff = Math.abs(ratio - closest.value);
  
  for (const standard of standardRatios) {
    const diff = Math.abs(ratio - standard.value);
    if (diff < minDiff && diff <= standard.tolerance) {
      minDiff = diff;
      closest = standard;
    }
  }
  
  return closest.string;
}

// Handle calculating images per sheet
ipcMain.handle('calculate-images-per-sheet', async (event, { aspectRatio, resolutionScale }) => {
  try {
    const imagesPerSheet = calculateImagesPerSheet(aspectRatio, resolutionScale);
    return { success: true, imagesPerSheet };
  } catch (error) {
    console.error('Error calculating images per sheet:', error);
    return { success: false, error: error.message };
  }
});

// Handle folder selection
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (result.canceled) {
    return { canceled: true };
  }

  const folderPath = result.filePaths[0];
  
  try {
    // Scan folder for images
    const images = await scanFolder(folderPath);
    
    return {
      canceled: false,
      folderPath,
      imageCount: images.length,
      images: images.map(img => path.basename(img))
    };
  } catch (error) {
    return {
      canceled: false,
      error: error.message
    };
  }
});

// Handle contact sheet generation
ipcMain.handle('generate-contact-sheets', async (event, { folderPath, metadata, aspectRatio = '3:2', showOutline, containToOneSheet = false, containmentMethod = 'resize-thumbnail', totalImages, resolutionScale = 2, dpi = 300 }) => {
  try {
    // Scan folder for images
    const imagePaths = await scanFolder(folderPath);
    
    if (imagePaths.length === 0) {
      throw new Error('No images found in the selected folder');
    }

    // Build title from metadata
    const titleParts = [];
    if (metadata.rollNumber) titleParts.push(metadata.rollNumber);
    
    // Combine filmStock and ISO without dash between them
    if (metadata.filmStock && metadata.iso) {
      titleParts.push(`${metadata.filmStock} ${metadata.iso}`);
    } else if (metadata.filmStock) {
      titleParts.push(metadata.filmStock);
    } else if (metadata.iso) {
      titleParts.push(metadata.iso);
    }
    
    if (metadata.camera) titleParts.push(metadata.camera);
    if (metadata.notes) titleParts.push(metadata.notes);
    
    const title = titleParts.join(' - ');

    // Send progress update
    mainWindow.webContents.send('generation-progress', {
      status: 'loading',
      message: `Loading ${imagePaths.length} images...`
    });

    // Load and process all images
    const processedImages = await loadAndProcessImages(imagePaths, (progress) => {
      mainWindow.webContents.send('generation-progress', {
        status: 'loading',
        message: `Loading images... ${progress.current}/${progress.total}`
      });
    });

    // Generate contact sheets
    mainWindow.webContents.send('generation-progress', {
      status: 'generating',
      message: 'Generating contact sheets...'
    });

    const contactSheets = await generateContactSheets(processedImages, title, aspectRatio, showOutline, containToOneSheet, containmentMethod, totalImages, resolutionScale, dpi);

    // Save contact sheets
    mainWindow.webContents.send('generation-progress', {
      status: 'saving',
      message: 'Saving contact sheets...'
    });

    const savedFiles = await saveContactSheets(contactSheets, folderPath, metadata);

    return {
      success: true,
      files: savedFiles,
      count: savedFiles.length
    };
  } catch (error) {
    console.error('Error generating contact sheets:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// Handle opening folder in Finder
ipcMain.handle('open-folder', async (event, folderPath) => {
  const { shell } = require('electron');
  await shell.openPath(folderPath);
});

// Handle window resizing
ipcMain.handle('resize-window', async (event, height) => {
  if (mainWindow) {
    const [width] = mainWindow.getSize();
    mainWindow.setSize(width, height, true); // animate = true
  }
});

