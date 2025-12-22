# Contact Sheet Generator - User Guide

## Quick Start

1. **Launch the Application**
   - Double-click the Contact Sheet Generator app icon
   - Or run `npm start` from the terminal

2. **Select Your Image Folder**
   - Click the "Select Folder" button
   - Navigate to the folder containing your images
   - Click "Open"
   - The app will scan and display the number of images found

3. **Enter a Title**
   - Type your desired title in the text field
   - Example: "R3129 - Portra 400"
   - The preview will update as you type

4. **Generate Contact Sheet**
   - Click "Generate Contact Sheet"
   - Wait while the app processes your images
   - Progress updates will keep you informed

5. **View Results**
   - Success! Your contact sheet(s) are saved in the original folder
   - Click "Open Folder" to view the generated files
   - Click "Generate Another" to create more contact sheets

## Features

### Automatic Grid Layout
- **6 columns × 7 rows** = 42 images per sheet
- Images maintain **3:2 aspect ratio**
- Filenames displayed below each thumbnail
- Black background with white text for professional look

### Multiple Sheet Support
- Folders with more than 42 images automatically generate multiple sheets
- Each sheet is numbered sequentially
- Example: `ContactSheet_Title_1.png`, `ContactSheet_Title_2.png`

### Wide Format Support
The app supports all common image formats:
- **Standard**: JPG, PNG, TIFF, GIF, BMP
- **RAW**: DNG, CR2, NEF, ARW, ORF, RW2, RAF

### Smart File Naming
- Spaces replaced with underscores
- Special characters sanitized
- Automatic conflict resolution (appends numbers if file exists)

## Output Specifications

### Image Dimensions
- **Size**: 2048 × 1782 pixels
- **Format**: PNG (lossless)
- **Color**: RGB

### Layout Details
- **Title**: 48px bold font, centered at top
- **Grid**: Even spacing with margins
- **Thumbnails**: Approximately 320×213 pixels each
- **Filenames**: 14px font below each image

## Tips & Best Practices

### For Best Results
1. **Organize your images** in a dedicated folder before generating
2. **Use descriptive titles** that identify the roll or project
3. **Check image count** - the app shows how many sheets will be generated
4. **Keep filenames reasonable** - very long names will be truncated

### Performance Tips
- Processing 42 images typically takes 10-15 seconds
- RAW files take longer due to preview extraction
- Large image files (>50MB) may slow processing
- The app remains responsive during generation

### Workflow Suggestions
1. **Film Photography**: Create sheets for each roll
   - Title: "Roll Number - Film Type"
   - Example: "R3129 - Portra 400"

2. **Photo Projects**: Organize by shoot or event
   - Title: "Project Name - Date"
   - Example: "Wedding_Smith - 2024-12-20"

3. **Archive Organization**: Create sheets for backup folders
   - Title: "Archive - Year/Month"
   - Example: "Archive_2024-12"

## Keyboard Shortcuts

Currently, the app uses standard system shortcuts:
- **⌘Q**: Quit application
- **⌘W**: Close window
- **Tab**: Navigate between fields

## Troubleshooting

### "No images found in folder"
- Ensure the folder contains supported image formats
- Check file extensions (must be .jpg, .png, .tiff, .gif, .bmp, .dng, etc.)
- Verify files aren't in subfolders (app only scans the selected folder)

### "Error loading image"
- Some images may be corrupt or unreadable
- The app will skip problematic files and continue
- Check the console for specific error messages

### RAW files not processing
- Ensure RAW files have embedded JPEG previews
- Some very old RAW formats may not be supported
- Try converting to DNG format for better compatibility

### Generation is slow
- Large RAW files take longer to process
- Processing 100+ images may take several minutes
- Progress bar shows current status

### File already exists
- The app automatically appends a number to avoid overwriting
- Example: `ContactSheet_Title.png` → `ContactSheet_Title_1.png`

## File Locations

### Generated Contact Sheets
- Saved in the **same folder** as your source images
- Named: `ContactSheet_[YourTitle].png`
- Or: `ContactSheet_[YourTitle]_1.png`, `_2.png`, etc. for multiple sheets

### Application Files
- macOS: `/Applications/Contact Sheet Generator.app`
- Settings: Currently no persistent settings (future feature)

## Examples

### Example 1: Single Roll of Film (36 images)
```
Input: Folder with 36 JPG files
Title: "R3129 - Portra 400"
Output: ContactSheet_R3129-Portra-400.png (2048×1782px)
Result: One sheet with 36 images in a 6×7 grid
```

### Example 2: Large Project (100 images)
```
Input: Folder with 100 PNG files
Title: "Wedding Smith"
Output: 
  - ContactSheet_Wedding_Smith_1.png (42 images)
  - ContactSheet_Wedding_Smith_2.png (42 images)
  - ContactSheet_Wedding_Smith_3.png (16 images)
Result: Three sheets with all images
```

### Example 3: Mixed Formats
```
Input: Folder with 20 DNG + 20 JPG files
Title: "Test Shoot - Dec 2024"
Output: ContactSheet_Test_Shoot-Dec_2024.png
Result: One sheet with all 40 images, sorted alphabetically
```

## Advanced Usage

### Batch Processing
To process multiple folders:
1. Generate contact sheet for first folder
2. Click "Generate Another"
3. Select next folder
4. Repeat as needed

### Custom Workflows
The app integrates well with other tools:
- Use with **Adobe Lightroom** for catalog management
- Combine with **Finder** for batch renaming
- Share sheets via **email** or **cloud storage**

## Limitations

### Current Limitations
- Fixed grid size (6×7, 42 images per sheet)
- Fixed output dimensions (2048×1782)
- No custom fonts or colors
- No PDF export
- No drag-and-drop folder selection

### Planned Features
See ARCHITECTURE.md for roadmap of future enhancements.

## Support

For issues, questions, or feature requests:
- Check TESTING.md for known issues
- Review ARCHITECTURE.md for technical details
- Submit issues on the project repository

## Version History

### v1.0.0 (Current)
- Initial release
- Support for standard and RAW image formats
- Automatic multi-sheet generation
- macOS support
- Modern dark-themed UI

---

**Enjoy creating professional contact sheets!**

