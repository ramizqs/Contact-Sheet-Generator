# Contact Sheet Generator

A desktop application for macOS that generates professional contact sheets from folders of images.

## Features

- Generates 2048×1782px contact sheets with 6 columns × 7 rows (42 images per sheet)
- Supports JPG, PNG, TIFF, GIF, BMP, and RAW/DNG formats
- Maintains 3:2 aspect ratio for thumbnails
- Automatically creates multiple sheets for folders with >42 images
- Custom titles for each contact sheet
- Saves generated sheets back to the source folder

## Installation

1. Install dependencies:
```bash
npm install
```

2. Rebuild native modules for Electron:
```bash
npm run rebuild-canvas
```

## Usage

1. Run the app:
```bash
npm start
```

2. Click "Select Folder" to choose a folder containing images
3. Enter a title for your contact sheet
4. Click "Generate Contact Sheet" to create the output

## Building

To create a distributable macOS app:
```bash
npm run build
```

## Requirements

- macOS 10.14 or later
- Node.js 18 or later

