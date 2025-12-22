// afterPack.js - Post-processing script for electron-builder
const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  // This ensures Sharp's native dependencies are properly packaged
  const appOutDir = context.appOutDir;
  const unpackedPath = path.join(appOutDir, context.packager.appInfo.productFilename + '.app', 'Contents', 'Resources', 'app.asar.unpacked');
  
  console.log('afterPack: Sharp native modules should be at:', unpackedPath);
  
  // Verify the unpacked directory exists
  if (fs.existsSync(unpackedPath)) {
    console.log('afterPack: app.asar.unpacked directory exists ✓');
  } else {
    console.warn('afterPack: app.asar.unpacked directory not found!');
  }
};

