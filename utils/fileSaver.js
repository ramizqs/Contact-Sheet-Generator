const fs = require('fs').promises;
const path = require('path');

/**
 * Save contact sheets to the specified folder
 * @param {Array} contactSheets - Array of contact sheet objects with buffers
 * @param {string} folderPath - Destination folder path
 * @param {Object} metadata - Metadata object with filmStock, rollNumber, camera
 * @returns {Promise<string[]>} Array of saved file paths
 */
async function saveContactSheets(contactSheets, folderPath, metadata) {
  const savedFiles = [];
  
  // Generate filename base from roll number or date
  let filenameBase;
  if (metadata.rollNumber && metadata.rollNumber.trim()) {
    filenameBase = sanitizeFilename(metadata.rollNumber);
  } else {
    // Use date + serial count
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Find existing files with this date to get next serial
    const files = await fs.readdir(folderPath);
    const datePattern = new RegExp(`^_${dateStr}_(\\d+)\\.png$`);
    let maxSerial = 0;
    
    for (const file of files) {
      const match = file.match(datePattern);
      if (match) {
        const serial = parseInt(match[1], 10);
        if (serial > maxSerial) {
          maxSerial = serial;
        }
      }
    }
    
    filenameBase = `${dateStr}_${maxSerial + 1}`;
  }
  
  for (const sheet of contactSheets) {
    // Generate filename with 00_Contact prefix for top sorting
    let filename;
    if (contactSheets.length === 1) {
      // Single sheet - no number suffix
      filename = `00_Contact_${filenameBase}.png`;
    } else {
      // Multiple sheets - add number
      filename = `00_Contact_${filenameBase}_${sheet.index + 1}.png`;
    }
    
    const filePath = path.join(folderPath, filename);
    
    // Check if file exists and handle conflict
    const finalPath = await handleFileConflict(filePath);
    
    // Write file
    await fs.writeFile(finalPath, sheet.buffer);
    
    savedFiles.push(path.basename(finalPath));
  }
  
  return savedFiles;
}

/**
 * Sanitize filename by replacing invalid characters
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  // Replace spaces with underscores
  let sanitized = filename.replace(/\s+/g, '_');
  
  // Remove or replace invalid characters
  sanitized = sanitized.replace(/[/\\?%*:|"<>]/g, '-');
  
  // Remove leading/trailing dashes and underscores
  sanitized = sanitized.replace(/^[-_]+|[-_]+$/g, '');
  
  // Limit length
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }
  
  return sanitized || 'ContactSheet';
}

/**
 * Handle file conflicts by appending a number if file exists
 * @param {string} filePath - Original file path
 * @returns {Promise<string>} Final file path (possibly with number appended)
 */
async function handleFileConflict(filePath) {
  let finalPath = filePath;
  let counter = 1;
  
  // Check if file exists
  try {
    await fs.access(finalPath);
    
    // File exists, append number
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);
    
    while (true) {
      finalPath = path.join(dir, `${basename}_${counter}${ext}`);
      
      try {
        await fs.access(finalPath);
        counter++;
      } catch {
        // File doesn't exist, we can use this name
        break;
      }
    }
  } catch {
    // File doesn't exist, use original path
  }
  
  return finalPath;
}

module.exports = {
  saveContactSheets,
  sanitizeFilename,
  handleFileConflict
};

