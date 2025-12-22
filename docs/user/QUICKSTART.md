# Quick Start Guide

## Installation

1. **Install Dependencies**
   ```bash
   cd "Contact Sheet Generator"
   npm install
   ```

2. **Run the Application**
   ```bash
   npm start
   ```

## First Use

### Step 1: Select Your Images
- Click **"Select Folder"**
- Navigate to a folder containing your images
- The app will show how many images were found

### Step 2: Add a Title
- Type a title in the text field
- Example: `R3129 - Portra 400`
- Watch the preview update in real-time

### Step 3: Generate
- Click **"Generate Contact Sheet"**
- Wait for processing to complete (usually 10-30 seconds)
- Your contact sheet(s) will be saved in the same folder as your images

### Step 4: View Results
- Click **"Open Folder"** to see your generated contact sheets
- Files are named: `ContactSheet_YourTitle.png`

## What You Get

- **Size**: 2048 × 1782 pixels
- **Layout**: 6 columns × 7 rows (42 images per sheet)
- **Format**: PNG with black background and white text
- **Multiple Sheets**: Automatically created if you have more than 42 images

## Supported Formats

✅ JPG/JPEG  
✅ PNG  
✅ TIFF  
✅ GIF  
✅ BMP  
✅ DNG (RAW)  
✅ CR2, NEF, ARW, ORF, RW2, RAF (RAW formats)

## Example Output

Your contact sheet will look like the example you provided:
- Title at the top
- Grid of thumbnails (3:2 aspect ratio)
- Filename below each image
- Professional black and white design

## Tips

- **Organize first**: Put images in a dedicated folder before generating
- **Use descriptive titles**: They help identify rolls or projects later
- **Check the count**: The app shows how many sheets will be generated
- **Be patient**: RAW files take longer to process than JPGs

## Need Help?

- **User Guide**: See `USAGE.md` for detailed instructions
- **Technical Info**: See `ARCHITECTURE.md` for how it works
- **Testing**: See `TESTING.md` for known issues

## Building for Distribution

To create a standalone macOS app:

```bash
npm run build
```

The `.dmg` installer will be created in the `dist/` folder.

---

**That's it! You're ready to create professional contact sheets.**

