# Testing Guide for Contact Sheet Generator

## Manual Testing Checklist

### 1. Installation Test
- [x] npm install completes successfully
- [x] All dependencies installed without errors
- [x] App starts with `npm start`

### 2. UI Tests
- [ ] Application window opens correctly
- [ ] All UI elements are visible and properly styled
- [ ] Dark theme renders correctly
- [ ] Buttons are responsive to clicks
- [ ] Input field accepts text

### 3. Folder Selection Tests
- [ ] "Select Folder" button opens folder picker dialog
- [ ] Dropping a folder over the "01 / Folder" card selects and scans it
- [ ] Dropping a file or unsupported item shows an error without changing the selection
- [ ] Selecting a folder displays the folder path
- [ ] Image count is displayed correctly
- [ ] Sheet count is calculated correctly (count / 42, rounded up)
- [ ] Canceling folder selection doesn't crash the app

### 4. Image Format Tests
Test with folders containing different formats:
- [ ] JPG/JPEG files
- [ ] PNG files
- [ ] TIFF files
- [ ] GIF files
- [ ] BMP files
- [ ] DNG (RAW) files
- [ ] Mixed formats in one folder

### 5. Image Count Tests
- [ ] Folder with < 42 images (generates 1 sheet)
- [ ] Folder with exactly 42 images (generates 1 sheet)
- [ ] Folder with 43-84 images (generates 2 sheets)
- [ ] Folder with > 84 images (generates 3+ sheets)
- [ ] Empty folder (should show error)

### 6. Title Input Tests
- [ ] Title input updates preview in real-time
- [ ] Special characters in title are handled correctly
- [ ] Empty title disables Generate button
- [ ] Long titles are displayed properly

### 7. Generation Tests
- [ ] Progress bar appears during generation
- [ ] Progress messages update correctly
- [ ] Generation completes successfully
- [ ] Success message displays with correct file count
- [ ] Generated files appear in the source folder

### 8. Output Validation
- [ ] Contact sheet is exactly 2048×1782 pixels
- [ ] Images are arranged in 6 columns × 7 rows
- [ ] Each thumbnail maintains 3:2 aspect ratio
- [ ] Filenames appear below each thumbnail
- [ ] Title appears at the top, centered
- [ ] Background is black
- [ ] Text is white and readable
- [ ] Sequential numbering for multiple sheets

### 9. File Naming Tests
- [ ] Single sheet: `ContactSheet_[title].png`
- [ ] Multiple sheets: `ContactSheet_[title]_1.png`, `ContactSheet_[title]_2.png`, etc.
- [ ] Special characters in title are sanitized
- [ ] Spaces in title are replaced with underscores
- [ ] File conflicts are handled (appends number)

### 10. Error Handling Tests
- [ ] Invalid folder path handled gracefully
- [ ] Corrupt image files are skipped
- [ ] RAW files that fail to load are handled
- [ ] Insufficient disk space error
- [ ] Permission errors are reported clearly

### 11. Edge Cases
- [ ] Very large image files (>50MB)
- [ ] Very small image files (<100KB)
- [ ] Portrait orientation images
- [ ] Square images
- [ ] Panoramic images
- [ ] Images with EXIF rotation data
- [ ] Portrait rotation checkbox rotates portrait images only in generated output
- [ ] Portrait rotation leaves source files unchanged
- [ ] Filenames with special characters
- [ ] Filenames with unicode characters
- [ ] Very long filenames (>100 characters)

### 12. Performance Tests
- [ ] 42 images process in reasonable time (<30 seconds)
- [ ] 100+ images don't freeze the UI
- [ ] Memory usage is reasonable
- [ ] App remains responsive during generation

### 13. Post-Generation Tests
- [ ] "Open Folder" button opens the correct folder
- [ ] "Generate Another" button resets the form
- [ ] Can generate from a different folder immediately
- [ ] Can change title and regenerate

## Automated Testing Notes

Currently, the app relies on manual testing. Future improvements could include:
- Unit tests for image processing functions
- Integration tests for IPC communication
- E2E tests with mock image folders
- Performance benchmarks

## Known Issues

Document any known issues here during testing.

## Test Results

Date: ___________
Tested by: ___________

Notes:
