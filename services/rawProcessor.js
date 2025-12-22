const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

const execAsync = promisify(exec);

/**
 * Process RAW/DNG file using macOS sips command
 * Converts RAW to JPEG in a temporary location, then returns the buffer
 * @param {string} rawFilePath - Path to the RAW/DNG file
 * @returns {Promise<Buffer|null>} JPEG buffer or null if failed
 */
async function processRawWithSips(rawFilePath) {
  const filename = path.basename(rawFilePath);
  
  try {
    // Create temporary output path
    const tempDir = os.tmpdir();
    const tempOutputPath = path.join(tempDir, `cs_${Date.now()}_${filename}.jpg`);
    
    console.log(`  🔄 Converting with sips: ${filename}`);
    
    // Use sips to convert DNG to JPEG
    // -s format jpeg: Set output format to JPEG
    // -s formatOptions best: Use best quality
    // --out: Specify output path
    const command = `sips -s format jpeg -s formatOptions best "${rawFilePath}" --out "${tempOutputPath}"`;
    
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
  try {
    await execAsync('which sips');
    return true;
  } catch (error) {
    return false;
  }
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
  
  try {
    console.log(`  🔍 Extracting embedded preview: ${filename}`);
    
    // Use exiftool to extract the embedded preview
    // -b: Binary output
    // -PreviewImage: Extract the preview image (respects color profiles)
    const command = `exiftool -b -PreviewImage "${rawFilePath}"`;
    
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
  try {
    await execAsync('which exiftool');
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  processRawWithSips,
  extractDngPreview,
  isSipsAvailable,
  isExiftoolAvailable,
  isSipsFormatSupported
};

