// State
let selectedFolder = null;
let imageCount = 0;
let metadata = {
  filmStock: '',
  rollNumber: '',
  iso: '',
  camera: '',
  notes: ''
};

// DOM Elements
const selectFolderBtn = document.getElementById('selectFolderBtn');
const folderInfo = document.getElementById('folderInfo');
const folderPath = document.getElementById('folderPath');
const imageCountEl = document.getElementById('imageCount');
const sheetCountEl = document.getElementById('sheetCount');
const filmStockInput = document.getElementById('filmStockInput');
const rollNumberInput = document.getElementById('rollNumberInput');
const isoInput = document.getElementById('isoInput');
const cameraInput = document.getElementById('cameraInput');
const notesInput = document.getElementById('notesInput');
const titlePreview = document.getElementById('titlePreview');
const openFolderCheckbox = document.getElementById('openFolderCheckbox');
const showOutlineCheckbox = document.getElementById('showOutlineCheckbox');
const containToOneSheetCheckbox = document.getElementById('containToOneSheetCheckbox');
const autoDetectAspectRatioCheckbox = document.getElementById('autoDetectAspectRatioCheckbox');
const resolutionSelect = document.getElementById('resolutionSelect');
const dpiSelect = document.getElementById('dpiSelect');
const aspectRatioSelect = document.getElementById('aspectRatioSelect');
const containmentMethodSelect = document.getElementById('containmentMethodSelect');
const generateBtn = document.getElementById('generateBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressMessage = document.getElementById('progressMessage');
const resultsSection = document.getElementById('resultsSection');
const resultsMessage = document.getElementById('resultsMessage');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const openFolderBtn = document.getElementById('openFolderBtn');
const generateAnotherBtn = document.getElementById('generateAnotherBtn');
const infoBtn = document.getElementById('infoBtn');
const changelogModal = document.getElementById('changelogModal');
const closeModal = document.getElementById('closeModal');

// Event Listeners
selectFolderBtn.addEventListener('click', handleFolderSelect);
filmStockInput.addEventListener('input', handleMetadataInput);
rollNumberInput.addEventListener('input', handleMetadataInput);
isoInput.addEventListener('input', handleMetadataInput);
cameraInput.addEventListener('input', handleMetadataInput);
notesInput.addEventListener('input', handleMetadataInput);
generateBtn.addEventListener('click', handleGenerate);
aspectRatioSelect.addEventListener('change', handleAspectRatioChange);
resolutionSelect.addEventListener('change', handleAspectRatioChange); // Also update on resolution change
containToOneSheetCheckbox.addEventListener('change', handleContainToOneSheetChange);
openFolderBtn.addEventListener('click', handleOpenFolder);
generateAnotherBtn.addEventListener('click', resetForm);
infoBtn.addEventListener('click', openChangelogModal);
closeModal.addEventListener('click', closeChangelogModal);

// Close modal when clicking outside
changelogModal.addEventListener('click', (e) => {
  if (e.target === changelogModal) {
    closeChangelogModal();
  }
});

// Listen for progress updates from main process
window.electronAPI.onProgressUpdate((data) => {
  updateProgress(data);
});

// Handlers
async function handleFolderSelect() {
  const result = await window.electronAPI.selectFolder();
  
  if (result.canceled) {
    return;
  }
  
  if (result.error) {
    showError(`Error scanning folder: ${result.error}`);
    return;
  }
  
  selectedFolder = result.folderPath;
  imageCount = result.imageCount;
  
  // Update UI
  folderPath.textContent = result.folderPath;
  folderPath.classList.remove('empty-state');
  imageCountEl.textContent = result.imageCount;
  
  // AUTO-DETECT ASPECT RATIO (only if checkbox is checked)
  if (autoDetectAspectRatioCheckbox.checked) {
    progressMessage.textContent = 'Detecting aspect ratio...';
    progressContainer.classList.remove('hidden');
    progressBar.style.width = '50%';
    
    const ratioResult = await window.electronAPI.detectAspectRatio(result.folderPath);
    
    progressContainer.classList.add('hidden');
    
    if (ratioResult.success) {
      // Auto-select detected aspect ratio
      aspectRatioSelect.value = ratioResult.aspectRatio;
      console.log(`Auto-detected aspect ratio: ${ratioResult.aspectRatio}`);
    } else {
      console.warn('Could not detect aspect ratio, keeping current selection');
    }
  }
  
  // Calculate sheet count based on aspect ratio
  await updateSheetCount();
  
  // Update title preview to show pagination if multiple sheets
  updateTitlePreview();
  
  // Enable generate button if we have metadata
  updateGenerateButton();
}

function handleMetadataInput() {
  metadata.filmStock = filmStockInput.value.trim();
  metadata.rollNumber = rollNumberInput.value.trim();
  metadata.iso = isoInput.value.trim();
  metadata.camera = cameraInput.value.trim();
  metadata.notes = notesInput.value.trim();
  
  updateTitlePreview();
  updateGenerateButton();
}

async function handleAspectRatioChange() {
  // Update sheet count when aspect ratio changes
  if (selectedFolder && imageCount > 0) {
    await updateSheetCount();
    updateTitlePreview();
  }
}

async function handleContainToOneSheetChange() {
  // Enable/disable containment method picker
  containmentMethodSelect.disabled = !containToOneSheetCheckbox.checked;
  
  // Update sheet count when "Contain to one sheet" is toggled
  if (selectedFolder && imageCount > 0) {
    await updateSheetCount();
    updateTitlePreview(); // Update title to show/hide pagination
  }
}

async function updateSheetCount() {
  if (!selectedFolder || imageCount === 0) {
    return;
  }
  
  // If "Contain to one sheet" is checked, always show 1 sheet
  if (containToOneSheetCheckbox.checked) {
    sheetCountEl.textContent = '1';
    console.log(`📊 Single-sheet mode: All ${imageCount} images on 1 sheet`);
    return;
  }
  
  try {
    const resolutionScale = parseInt(resolutionSelect.value, 10);
    const aspectRatio = aspectRatioSelect.value;
    
    const result = await window.electronAPI.calculateImagesPerSheet({
      aspectRatio: aspectRatio,
      resolutionScale: resolutionScale
    });
    
    if (result.success) {
      const sheetCount = Math.ceil(imageCount / result.imagesPerSheet);
      sheetCountEl.textContent = sheetCount;
      console.log(`📊 Sheet count updated: ${sheetCount} sheets (${result.imagesPerSheet} images/sheet, ${aspectRatio})`);
    }
  } catch (error) {
    console.error('Error calculating sheet count:', error);
    // Fallback to 42 images per sheet
    const sheetCount = Math.ceil(imageCount / 42);
    sheetCountEl.textContent = sheetCount;
  }
}

function updateTitlePreview() {
  // Build title from metadata (including notes)
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
  
  let titleText = '';
  if (titleParts.length > 0) {
    titleText = titleParts.join(' - ');
    
    // Add pagination if multiple sheets (but not when "contain to one sheet" is enabled)
    if (!containToOneSheetCheckbox.checked) {
      const sheetCount = parseInt(sheetCountEl.textContent, 10) || 1;
      if (sheetCount > 1) {
        titleText += ` (1/${sheetCount})`;
      }
    }
    
    titlePreview.textContent = titleText.toUpperCase();
  } else {
    titlePreview.textContent = '—';
  }
}

function updateGenerateButton() {
  // Enable if we have a folder and at least one metadata field
  const hasMetadata = metadata.filmStock || metadata.rollNumber || metadata.iso || metadata.camera || metadata.notes;
  const isEnabled = selectedFolder && hasMetadata;
  
  generateBtn.disabled = !isEnabled;
  
  // Update tooltip text based on what's missing
  if (!isEnabled) {
    let tooltipText = '';
    if (!selectedFolder && !hasMetadata) {
      tooltipText = 'Select a folder and fill in at least one metadata field';
    } else if (!selectedFolder) {
      tooltipText = 'Select a folder to continue';
    } else if (!hasMetadata) {
      tooltipText = 'Fill in at least one metadata field';
    }
    generateBtn.setAttribute('data-tooltip', tooltipText);
  } else {
    generateBtn.removeAttribute('data-tooltip');
  }
}

async function handleGenerate() {
  const hasMetadata = metadata.filmStock || metadata.rollNumber || metadata.camera;
  if (!selectedFolder || !hasMetadata) {
    return;
  }
  
  // Hide previous results/errors
  resultsSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  
  // Show progress
  progressContainer.classList.remove('hidden');
  progressBar.style.width = '0%';
  
  // Disable button during generation
  generateBtn.disabled = true;
  selectFolderBtn.disabled = true;
  filmStockInput.disabled = true;
  rollNumberInput.disabled = true;
  isoInput.disabled = true;
  cameraInput.disabled = true;
  notesInput.disabled = true;
  
  try {
    const resolutionScale = parseInt(resolutionSelect.value, 10);
    const dpi = parseInt(dpiSelect.value, 10);
    const aspectRatio = aspectRatioSelect.value;
    const containmentMethod = containmentMethodSelect.value;
    const result = await window.electronAPI.generateContactSheets({
      folderPath: selectedFolder,
      metadata: metadata,
      aspectRatio: aspectRatio,
      showOutline: showOutlineCheckbox.checked,
      containToOneSheet: containToOneSheetCheckbox.checked,
      containmentMethod: containmentMethod,
      totalImages: imageCount,
      resolutionScale: resolutionScale,
      dpi: dpi
    });
    
    // Hide progress
    progressContainer.classList.add('hidden');
    
    if (result.success) {
      // Build success message
      let message = `Successfully generated ${result.count} contact sheet${result.count > 1 ? 's' : ''}`;
      
      // Add warning if some images failed to load
      if (result.failedCount && result.failedCount > 0) {
        message += `\n\n⚠️ Warning: ${result.failedCount} image${result.failedCount > 1 ? 's' : ''} could not be loaded and ${result.failedCount > 1 ? 'were' : 'was'} skipped.`;
        
        // Show first few failed files
        if (result.failedFiles && result.failedFiles.length > 0) {
          const showCount = Math.min(5, result.failedFiles.length);
          message += `\n\nSkipped files:\n• ${result.failedFiles.slice(0, showCount).join('\n• ')}`;
          if (result.failedFiles.length > showCount) {
            message += `\n• ... and ${result.failedFiles.length - showCount} more`;
          }
          message += `\n\nNote: DNG files require proper RAW support. Check the console for details.`;
        }
        
        message += `\n\nSuccessfully processed: ${result.processedCount} images`;
      }
      
      // Show results
      resultsMessage.textContent = message;
      resultsSection.classList.remove('hidden');
      
      // Auto-open folder if checkbox is checked
      if (openFolderCheckbox.checked) {
        window.electronAPI.openFolder(selectedFolder);
      }
    } else {
      showError(result.error || 'Unknown error occurred');
    }
  } catch (error) {
    progressContainer.classList.add('hidden');
    showError(`Error: ${error.message}`);
  }
  
  // Re-enable controls
  generateBtn.disabled = false;
  selectFolderBtn.disabled = false;
  filmStockInput.disabled = false;
  rollNumberInput.disabled = false;
  isoInput.disabled = false;
  cameraInput.disabled = false;
  notesInput.disabled = false;
}

function updateProgress(data) {
  if (data.status === 'loading') {
    progressBar.style.width = '33%';
  } else if (data.status === 'generating') {
    progressBar.style.width = '66%';
  } else if (data.status === 'saving') {
    progressBar.style.width = '90%';
  }
  
  progressMessage.textContent = data.message;
}

function handleOpenFolder() {
  if (selectedFolder) {
    window.electronAPI.openFolder(selectedFolder);
  }
}

function resetForm() {
  selectedFolder = null;
  imageCount = 0;
  metadata = {
    filmStock: '',
    rollNumber: '',
    iso: '',
    camera: '',
    notes: ''
  };
  
  // Reset to empty state instead of hiding
  folderPath.textContent = 'No folder selected';
  folderPath.classList.add('empty-state');
  imageCountEl.textContent = '0';
  sheetCountEl.textContent = '0';
  
  resultsSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  progressContainer.classList.add('hidden');
  
  filmStockInput.value = '';
  rollNumberInput.value = '';
  isoInput.value = '';
  cameraInput.value = '';
  notesInput.value = '';
  titlePreview.textContent = '—';
  // Don't reset aspect ratio - let user keep their selection
  
  updateGenerateButton();
}

// Modal functions
function openChangelogModal() {
  changelogModal.classList.remove('hidden');
}

function closeChangelogModal() {
  changelogModal.classList.add('hidden');
}

// Initialize with empty state on load
resetForm();

// Initialize containment method picker state (enabled by default since checkbox is checked)
containmentMethodSelect.disabled = !containToOneSheetCheckbox.checked;

function showError(message) {
  errorMessage.textContent = message;
  errorSection.classList.remove('hidden');
}

