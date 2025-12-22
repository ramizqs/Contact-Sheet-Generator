# Contact Sheet Generator - Architecture Documentation

## Overview

Contact Sheet Generator is an Electron-based desktop application that creates professional contact sheets from image folders. The app processes up to 42 images per sheet in a 6×7 grid layout, with support for multiple formats including RAW/DNG files.

## Architecture

### Technology Stack

- **Electron**: Cross-platform desktop app framework
- **Node.js**: Backend runtime for file operations and image processing
- **Sharp**: High-performance image processing library
- **HTML/CSS/JavaScript**: Frontend UI

### Application Structure

```
contact-sheet-generator/
├── main.js                 # Electron main process
├── preload.js             # Secure IPC bridge
├── package.json           # Dependencies and build config
├── renderer/              # Frontend UI
│   ├── index.html        # Main UI markup
│   ├── styles.css        # Styling and theme
│   └── app.js            # UI logic and state management
├── services/              # Core business logic
│   ├── imageProcessor.js        # Image loading and resizing
│   └── contactSheetGenerator.js # Sheet composition and rendering
└── utils/                 # Helper utilities
    └── fileSaver.js      # File naming and saving logic
```

## Core Components

### 1. Main Process (`main.js`)

**Responsibilities:**
- Create and manage application window
- Handle IPC communication with renderer
- Manage system dialogs (folder picker)
- Coordinate image processing pipeline

**IPC Handlers:**
- `select-folder`: Opens folder picker and scans for images
- `generate-contact-sheets`: Orchestrates the full generation process
- `open-folder`: Opens generated files in system file manager

### 2. Preload Script (`preload.js`)

**Purpose:**
- Secure bridge between renderer and main process
- Exposes limited, safe API to renderer via contextBridge
- Prevents direct access to Node.js/Electron APIs

**Exposed API:**
- `electronAPI.selectFolder()`
- `electronAPI.generateContactSheets(options)`
- `electronAPI.openFolder(path)`
- `electronAPI.onProgressUpdate(callback)`

### 3. Renderer Process (`renderer/`)

**UI Components:**
1. **Folder Selection**: Browse and select image folder
2. **Title Input**: Enter custom title with live preview
3. **Generation Controls**: Trigger sheet creation
4. **Progress Display**: Show processing status
5. **Results**: Display success/error messages

**State Management:**
- Tracks selected folder path
- Stores image count and sheet count
- Manages UI state (loading, success, error)

### 4. Image Processor (`services/imageProcessor.js`)

**Functions:**

- `scanFolder(folderPath)`: 
  - Scans directory for supported image formats
  - Returns sorted array of file paths
  
- `loadImage(imagePath)`:
  - Loads standard formats (JPG, PNG, TIFF, GIF, BMP)
  - Extracts embedded preview from RAW/DNG files
  - Auto-rotates based on EXIF data
  
- `resizeThumbnail(buffer, width, height)`:
  - Maintains 3:2 aspect ratio
  - Adds letterboxing/pillarboxing on black background
  - Uses Sharp for high-quality resizing

- `loadAndProcessImages(paths, progressCallback)`:
  - Batch processes all images
  - Reports progress to UI
  - Handles errors gracefully (skips corrupt files)

### 5. Contact Sheet Generator (`services/contactSheetGenerator.js`)

**Layout Specifications:**
- Canvas: 2048×1782 pixels
- Grid: 6 columns × 7 rows (42 images)
- Title: Top 100px, 48px bold font, centered
- Thumbnails: ~320×213px each (maintains 3:2 ratio)
- Filenames: 14px font below each thumbnail
- Spacing: Even distribution with margins

**Generation Process:**
1. Split images into batches of 42
2. For each batch:
   - Create black canvas (2048×1782)
   - Render title as SVG text
   - Resize and position each thumbnail
   - Add filename labels
   - Composite all elements
3. Export as PNG

**Technology:**
- Uses Sharp for all image operations
- SVG for text rendering (title and filenames)
- Composite operation for efficient assembly

### 6. File Saver (`utils/fileSaver.js`)

**Responsibilities:**
- Generate safe filenames from user title
- Handle file naming conflicts
- Save buffers to disk

**Naming Convention:**
- Single sheet: `ContactSheet_[title].png`
- Multiple sheets: `ContactSheet_[title]_1.png`, etc.
- Sanitizes special characters
- Appends numbers to avoid overwriting existing files

## Data Flow

```
User Action (Select Folder)
    ↓
Main Process (Open Dialog)
    ↓
Image Processor (Scan Folder)
    ↓
Renderer (Display Count)
    ↓
User Action (Enter Title, Click Generate)
    ↓
Main Process (Coordinate Generation)
    ↓
Image Processor (Load & Resize Images)
    ↓
Contact Sheet Generator (Compose Sheets)
    ↓
File Saver (Write to Disk)
    ↓
Renderer (Show Success)
```

## Image Processing Pipeline

### Loading Phase
1. Read image file from disk
2. Detect format (standard vs. RAW)
3. For RAW: Extract embedded JPEG preview
4. Apply EXIF auto-rotation
5. Return buffer

### Resizing Phase
1. Calculate dimensions for 3:2 aspect ratio
2. Resize image to fit target dimensions
3. Add black padding if needed (letterbox/pillarbox)
4. Return processed buffer

### Composition Phase
1. Create base canvas (black background)
2. Render title SVG at top
3. For each image:
   - Position in grid
   - Composite thumbnail
   - Add filename label
4. Export final PNG

## Error Handling

### Image Loading Errors
- Corrupt files: Skip and continue
- Unsupported formats: Ignore during scan
- RAW processing failures: Use fallback or skip

### File System Errors
- Permission denied: Show error message
- Disk full: Show error message
- Invalid path: Validate before processing

### UI Errors
- No folder selected: Disable generate button
- No title: Disable generate button
- No images found: Show error message

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Images loaded only when needed
2. **Streaming**: Sharp processes images as streams
3. **Batch Processing**: Process images in manageable chunks
4. **Progress Updates**: Keep UI responsive during long operations

### Memory Management
- Images processed sequentially to limit memory usage
- Buffers released after processing
- Sharp automatically manages internal memory

### Typical Performance
- 42 JPG images (~5MB each): ~10-15 seconds
- RAW files take longer due to preview extraction
- Progress updates keep user informed

## Security

### Sandboxing
- Renderer process has no direct Node.js access
- All file operations go through main process
- Context isolation enabled
- Node integration disabled

### File Access
- User explicitly selects folders via system dialog
- No automatic file system access
- Saves only to user-selected folder

## Future Enhancements

### Potential Features
- Drag-and-drop folder selection
- Custom grid configurations (4×4, 5×5, etc.)
- Adjustable thumbnail sizes
- Dark/light theme toggle
- Export as PDF
- Batch processing multiple folders
- Custom fonts and colors
- Watermarking
- Template presets

### Technical Improvements
- Unit tests for core functions
- E2E testing with Playwright
- CI/CD pipeline
- Auto-updates with electron-updater
- Localization/i18n
- Preferences storage
- Recent folders list

## Build and Distribution

### Development
```bash
npm install   # Install dependencies
npm start     # Run in development mode
```

### Production Build
```bash
npm run build  # Create macOS .dmg
```

### Build Output
- macOS: `.dmg` installer in `dist/` folder
- Includes Electron runtime and all dependencies
- Signed and notarized (requires Apple Developer ID)

## Dependencies

### Production
- **electron**: Desktop app framework
- **sharp**: Image processing (native module)

### Development
- **electron-builder**: Creates distributable packages
- **electron-rebuild**: Rebuilds native modules for Electron

## Supported Image Formats

### Standard Formats (via Sharp)
- JPEG/JPG
- PNG
- TIFF/TIF
- GIF
- BMP

### RAW Formats (preview extraction)
- DNG (Adobe Digital Negative)
- CR2 (Canon)
- NEF (Nikon)
- ARW (Sony)
- ORF (Olympus)
- RW2 (Panasonic)
- RAF (Fujifilm)

## Troubleshooting

### Common Issues

**App won't start:**
- Verify Node.js version (18+)
- Run `npm install` to ensure dependencies are installed
- Check for Electron version conflicts

**Images not loading:**
- Verify file permissions
- Check image format is supported
- Review console for specific errors

**RAW files not working:**
- Ensure RAW files have embedded previews
- Some older RAW formats may not be supported
- Sharp's RAW support depends on libvips

**Generation fails:**
- Check available disk space
- Verify write permissions to destination folder
- Review error messages for specifics

## License

MIT License - See LICENSE file for details

