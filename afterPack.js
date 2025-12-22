// afterPack.js - Post-processing script for electron-builder
const fs = require('fs');
const path = require('path');

exports.default = async function(context) {
  const appOutDir = context.appOutDir;
  const unpackedPath = path.join(appOutDir, context.packager.appInfo.productFilename + '.app', 'Contents', 'Resources', 'app.asar.unpacked');
  
  console.log(`afterPack: Processing build - outDir: ${appOutDir}`);
  console.log(`afterPack: Unpacked modules should be at: ${unpackedPath}`);
  
  if (fs.existsSync(unpackedPath)) {
    console.log('afterPack: Unpacked directory exists ✓');
  } else {
    console.warn('afterPack: Unpacked directory not found!');
  }
};

