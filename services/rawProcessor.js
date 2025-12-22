const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);

// Common installation paths for command-line tools
// macOS apps launched from Finder have very limited PATH
const COMMON_PATHS = [
  '/usr/local/bin',
  '/opt/homebrew/bin',
  '/opt/local/bin',
  '/usr/bin',
  '/bin'
];

/**
 * Find the full path to a command by searching common locations
 * @param {string} command - Command name to find
 * @returns {Promise<string|null>} Full path to command or null if not found
 */
async function findCommand(command) {
  const fsSync = require('fs');
  
  // FIRST: Check if bundled with the app (for exiftool)
  if (command === 'exiftool') {
    try {
      const { app } = require('electron');
      let bundledPath;
      
      if (app.isPackaged) {
        // In packaged app, check Resources
        bundledPath = path.join(process.resourcesPath, 'app', 'assets', 'exiftool');
      } else {
        // In dev mode, check assets
        bundledPath = path.join(__dirname, '..', 'assets', 'exiftool');
      }
      
      if (fsSync.existsSync(bundledPath)) {
        // Verify it's executable
        try {
          await fsSync.promises.access(bundledPath, fsSync.constants.X_OK);
          console.log(`✓ Using bundled ${command} at: ${bundledPath}`);
          console.log(`   Version: 12.70 (bundled with app)`);
          return bundledPath;
        } catch (error) {
          console.log(`  Bundled exiftool found but not executable, trying system version...`);
        }
      }
    } catch (error) {
      // Electron app not available or other error, fall through to system search
    }
  }
  
  // SECOND: Try which (will work if PATH is set correctly)
  try {
    const { stdout } = await execAsync(`which ${command}`);
    const commandPath = stdout.trim();
    if (commandPath) {
      console.log(`✓ Found system ${command} at: ${commandPath}`);
      return commandPath;
    }
  } catch (error) {
    // which failed, fall through to manual search
  }
  
  // THIRD: Manually check common paths
  for (const dir of COMMON_PATHS) {
    const fullPath = path.join(dir, command);
    try {
      if (fsSync.existsSync(fullPath)) {
        // Verify it's executable
        await fsSync.promises.access(fullPath, fsSync.constants.X_OK);
        console.log(`✓ Found ${command} at: ${fullPath}`);
        return fullPath;
      }
    } catch (error) {
      // Not accessible, continue searching
    }
  }
  
  return null;
}

// Cache the command paths
let sipsPath = null;
let exiftoolPath = null;

// Find commands at module load
(async () => {
  sipsPath = await findCommand('sips');
  exiftoolPath = await findCommand('exiftool');
  
  if (sipsPath) {
    console.log(`✓ sips available at: ${sipsPath}`);
  }
  if (exiftoolPath) {
    console.log(`✓ exiftool available at: ${exiftoolPath}`);
  }
})();

/**
 * Process RAW/DNG file using macOS sips command
 * Converts RAW to JPEG in a temporary location, then returns the buffer
 * @param {string} rawFilePath - Path to the RAW/DNG file
 * @returns {Promise<Buffer|null>} JPEG buffer or null if failed
 */
async function processRawWithSips(rawFilePath) {
  const filename = path.basename(rawFilePath);
  
  // Wait for sips path to be resolved if still initializing
  if (sipsPath === null) {
    sipsPath = await findCommand('sips');
  }
  
  if (!sipsPath) {
    console.error(`  ✗ sips not available, cannot convert ${filename}`);
    return null;
  }
  
  try {
    // Create temporary output path
    const tempDir = os.tmpdir();
    const tempOutputPath = path.join(tempDir, `cs_${Date.now()}_${filename}.jpg`);
    
    console.log(`  🔄 Converting with sips: ${filename}`);
    
    // Use sips to convert DNG to JPEG
    // -s format jpeg: Set output format to JPEG
    // -s formatOptions best: Use best quality
    // --out: Specify output path
    const command = `"${sipsPath}" -s format jpeg -s formatOptions best "${rawFilePath}" --out "${tempOutputPath}"`;
    
    const { stdout, stderr } = await execAsync(command, {
      timeout: 30000 // 30 second timeout per file
    });
    
    if (stderr && !stderr.includes('sips')) {
      console.warn(`  ⚠️  sips warning: ${stderr}`);
    }
    
    // Read the converted JPEG
    const buffer = await fs.readFile(tempOutputPath);
    
    // Clean up temporary file
    await fs.unlink(tempOutputPath).catch(() => {
      // Ignore cleanup errors
    });
    
    console.log(`  ✓ Successfully converted with sips: ${filename} (${Math.round(buffer.length / 1024)}KB)`);
    
    return buffer;
  } catch (error) {
    console.error(`  ✗ sips conversion failed for ${filename}:`);
    console.error(`    Error: ${error.message}`);
    return null;
  }
}

/**
 * Check if sips is available on the system
 * @returns {Promise<boolean>} True if sips is available
 */
async function isSipsAvailable() {
  if (sipsPath === null) {
    sipsPath = await findCommand('sips');
  }
  return sipsPath !== null;
}

/**
 * Check if sips supports a given file format
 * @param {string} extension - File extension (e.g., '.dng')
 * @returns {Promise<boolean>} True if format is supported
 */
async function isSipsFormatSupported(extension) {
  try {
    const { stdout } = await execAsync('sips --formats');
    const ext = extension.toLowerCase().replace('.', '');
    
    // Check if the extension or common RAW formats are listed
    const supported = stdout.includes(ext) || 
                     stdout.includes('raw-image') ||
                     stdout.includes('adobe.raw');
    
    return supported;
  } catch (error) {
    return false;
  }
}

/**
 * Extract embedded preview from DNG using exiftool
 * This preserves any applied color profiles (e.g., black and white rendering)
 * @param {string} rawFilePath - Path to the RAW/DNG file
 * @returns {Promise<Buffer|null>} JPEG buffer or null if failed
 */
async function extractDngPreview(rawFilePath) {
  const filename = path.basename(rawFilePath);
  
  // Wait for exiftool path to be resolved if still initializing
  if (exiftoolPath === null) {
    exiftoolPath = await findCommand('exiftool');
  }
  
  if (!exiftoolPath) {
    console.error(`  ✗ exiftool not available, cannot extract preview from ${filename}`);
    return null;
  }
  
  try {
    console.log(`  🔍 Extracting embedded preview: ${filename}`);
    
    // Use exiftool to extract the embedded preview
    // -b: Binary output
    // -PreviewImage: Extract the preview image (respects color profiles)
    const command = `"${exiftoolPath}" -b -PreviewImage "${rawFilePath}"`;
    
    const { stdout } = await execAsync(command, {
      timeout: 30000,
      encoding: 'buffer', // Important: get binary data
      maxBuffer: 50 * 1024 * 1024 // 50MB buffer
    });
    
    // stdout is the JPEG buffer
    const buffer = stdout;
    
    if (buffer.length < 1000) {
      // Probably an error message or no preview found
      console.warn(`  ⚠️  No embedded preview found in ${filename}`);
      return null;
    }
    
    console.log(`  ✓ Successfully extracted preview: ${filename} (${Math.round(buffer.length / 1024)}KB)`);
    console.log(`     Preview respects applied color profiles (e.g., B&W rendering)`);
    
    return buffer;
  } catch (error) {
    console.error(`  ✗ Preview extraction failed for ${filename}:`);
    console.error(`    Error: ${error.message}`);
    return null;
  }
}

/**
 * Check if exiftool is available on the system
 * @returns {Promise<boolean>} True if exiftool is available
 */
async function isExiftoolAvailable() {
  if (exiftoolPath === null) {
    exiftoolPath = await findCommand('exiftool');
  }
  return exiftoolPath !== null;
}

module.exports = {
  processRawWithSips,
  extractDngPreview,
  isSipsAvailable,
  isExiftoolAvailable,
  isSipsFormatSupported,
  findCommand
};

