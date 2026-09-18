const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanFolder: (folderPath) => ipcRenderer.invoke('scan-folder', folderPath),
  detectAspectRatio: (folderPath) => ipcRenderer.invoke('detect-aspect-ratio', folderPath),
  calculateImagesPerSheet: (options) => ipcRenderer.invoke('calculate-images-per-sheet', options),
  generateContactSheets: (options) => ipcRenderer.invoke('generate-contact-sheets', options),
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  resizeWindow: (height) => ipcRenderer.invoke('resize-window', height),
  onProgressUpdate: (callback) => {
    ipcRenderer.on('generation-progress', (event, data) => callback(data));
  }
});
