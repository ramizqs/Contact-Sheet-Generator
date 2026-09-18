# Changelog

## Version 3.3.0 (September 18, 2026)

### New Folder Workflow
- **Drag and drop folders** directly onto the `01 / Folder` section to select and scan them.
- **Stylized drop zone** dims the folder controls and displays a dashed outline with a clear drop prompt while dragging.

### Auto-Rotate Images
- Added an optional **Auto-Rotate Images** setting for portrait images.
- Portraits are rotated to landscape only in the generated contact sheet; original files are never modified.

## Version 3.2.0 (December 21, 2024)

### 🎨 Enhanced RAW Support: Color Profile Preservation

#### exiftool Integration for DNG Preview Extraction
- **✅ NEW: Color profile preservation!** Using exiftool to extract embedded DNG previews
- **Respects applied color profiles**: Black & white rendering, film simulations, etc.
- **Primary processing method**: exiftool extracts preview → Sharp processes
- **Three-tier system**: exiftool (best) → sips (good) → Sharp (fallback)

#### Why This Matters
- **DNGs with color profiles** (e.g., B&W conversion in Leica cameras) now render correctly
- **Embedded previews** preserve the camera's/software's color rendering
- **Better than sips**: sips re-processes RAW data, may ignore applied profiles
- **Faster processing**: Extracting preview is quicker than full RAW conversion

#### Processing Priority Order
1. **exiftool** - Extracts embedded JPEG preview (preserves color profile) ⭐ **BEST**
2. **sips** - Full RAW conversion (may lose color profile)
3. **Sharp** - Embedded preview extraction (limited support)

#### Technical Details
- `extractDngPreview()`: Uses exiftool to extract `-PreviewImage`
- 50MB buffer for large previews
- Automatic detection of exiftool availability
- Falls back gracefully if exiftool not installed

#### Installation Note
For full color profile support:
```bash
brew install exiftool
```

If exiftool not installed, app falls back to sips/Sharp methods.

### Other Changes
- **Removed GIF support**: GIF removed from supported formats list
- **Updated format check**: Now detects both exiftool and sips availability
- **Enhanced logging**: Shows which method successfully processed each file

## Version 3.1.0 (December 21, 2024)

### 🎉 Major Feature: FULL RAW/DNG SUPPORT

#### Native RAW Processing with macOS sips
- **✅ FIXED: All DNG files now work!** Using macOS native `sips` command for RAW conversion
- **Proper RAW decoding**: sips fully decodes RAW sensor data (not just embedded previews)
- **Automatic fallback**: Falls back to Sharp's preview extraction if sips is unavailable
- **Support for all RAW formats**: DNG, CR2, NEF, ARW, ORF, RW2, RAF, and more
- **No external dependencies**: Uses built-in macOS tools (sips)
- **High quality**: sips uses macOS Core Image for professional RAW processing

#### New RAW Processing Module
- **services/rawProcessor.js**: Dedicated RAW file processor using sips
  - `processRawWithSips()`: Converts RAW to JPEG with best quality settings
  - `isSipsAvailable()`: Runtime check for sips availability
  - `isSipsFormatSupported()`: Checks format support
  - Automatic temporary file management
  - 30-second timeout per file for safety
  
#### Enhanced Image Loading Pipeline
- **Primary method**: macOS sips conversion (when available)
- **Fallback method**: Sharp embedded preview extraction
- **Detailed logging**: Shows which method succeeded for each file
- **Smart error handling**: Tries multiple methods before giving up

#### Improved Format Detection
- Startup check now detects sips availability
- Clear indication when full RAW support is enabled
- Success message: "✅ macOS sips: AVAILABLE - Full RAW/DNG processing enabled!"

### Technical Improvements
- Two-stage processing for RAW files: convert → process
- Temp file cleanup after conversion
- Better error messages distinguishing between sips and Sharp failures
- Progress indicators for RAW conversion

### Why This Matters
- **Before**: 0/81 Leica DNG files loaded ❌
- **After**: All DNG files should load successfully ✅
- **Quality**: Full RAW data processing, not just previews
- **Reliability**: Native macOS support, no compilation issues

## Version 3.0.1 (December 21, 2024)

### Bug Fixes & Improvements

#### Enhanced DNG and RAW File Support
- **Improved Error Handling**: DNG files that fail to load now provide detailed error messages
  - Per-file loading status logged to console
  - Clear indication of which files succeeded vs failed
  - Helpful diagnostic information about causes of failure
- **User-Facing Warnings**: Success messages now include warnings when some images fail to load
  - Lists failed filenames (up to 5, then "and X more")
  - Shows count of successfully processed images
  - Links to DNG_SUPPORT.md for troubleshooting
- **Format Support Diagnostics**: App checks Sharp's capabilities at startup
  - Displays supported standard formats (JPEG, PNG, TIFF, etc.)
  - Checks for RAW format support (DNG, CR2, NEF, etc.)
  - Warns if RAW support is not available
  - References documentation for workarounds
- **Better RAW Processing**: Enhanced DNG file loading with explicit JPEG conversion
  - Verifies metadata before processing
  - Converts RAW previews to JPEG format for better compatibility
  - Catches and reports specific RAW processing errors

#### New Documentation
- **DNG_SUPPORT.md**: Comprehensive guide to DNG and RAW file handling
  - How RAW processing works
  - Common issues and solutions
  - Error message explanations
  - Recommended workflows (convert first vs process directly)
  - Technical details about Sharp/libvips/libraw
- **DNG_FIX_SUMMARY.md**: Summary of changes and testing instructions

#### Technical Improvements
- `loadAndProcessImages()` now returns detailed statistics:
  - Array of successfully loaded images
  - Count of failed images
  - List of failed filenames
- Main process checks for zero successfully loaded images and provides helpful error
- Progress messages show actual count of images being processed
- Defensive code for Electron app initialization

### Known Limitations
- Sharp's precompiled binaries may not include full RAW support depending on platform
- Some DNG files without embedded JPEG previews may fail to load
- Recommended workflow: Process RAW files in dedicated RAW editor first, then generate contact sheets from exports

## Version 3.0.0 (December 21, 2024)

### Planned Major Features
- **Increased Text Contrast**: Enhanced readability of titles and filenames in generated contact sheets
  - Improved visibility for printing and presentations
  - Better legibility in various viewing conditions
- **Auto-Detection of Image Aspect Ratio**: Automatically detect the most common aspect ratio in selected folder
  - Scans first images to determine predominant format
  - Auto-selects appropriate aspect ratio
  - Reduces manual configuration
- **Better Support for Image Aspect Ratios**: Improved handling of mixed aspect ratios within a single folder
  - Smart detection of multiple formats
  - Options for handling diverse image dimensions
  - Professional handling of edge cases
- **Contact Sheet Sizing Options**: Multiple output dimensions beyond the current fixed size
  - Letter format (8.5×11" at 300dpi)
  - A4 format (8.27×11.69" at 300dpi)
  - Square format (Instagram-friendly)
  - Custom dimensions
  - Resolution scaling integration with existing 2K/4K/6K/8K options

### Design Improvements
- **DMG Installer Enhancement**: Custom black background for installer window
- **Updated DMG Icon**: Special installer version of app icon

### Goals
- More flexible output formats for different use cases
- Smarter defaults based on folder contents
- Better visual clarity in generated sheets
- Support for diverse photography workflows
- Professional-grade installer experience

## Version 2.3.0 (December 20, 2024)

### Additional Refinements
- **Folder Icon Button**: Changed from "SELECT FOLDER →" to "📁 SELECT FOLDER"
  - More intuitive visual indicator
  - Cleaner, more modern appearance
- **Larger Title**: Increased contact sheet title from 16pt to 22pt
  - More prominent and readable
  - Better visual hierarchy
- **Aspect Ratio Selector**: Added dropdown with 6 common ratios
  - 3:2 (35mm film - default)
  - 4:3 (Medium format)
  - 16:9 (Widescreen)
  - 1:1 (Square/Instagram)
  - 5:4 (4×5 large format)
  - 7:5 (5×7 print)
  - Fully integrated with thumbnail generation
  - Maintains proper letterboxing/pillarboxing
- **Kode Mono Preview**: Title preview now uses Kode Mono font
  - Accurate representation of final output
  - Consistent typography throughout app
- **Better Text Alignment**: Increased left padding from 2px to 5px
  - Title and filenames properly aligned
  - No longer overshoots thumbnail edges
- **Balanced Title Padding**: Adjusted title vertical position
  - Equal spacing above and below title
  - Better visual balance with image grid

### Technical Improvements
- Added parseAspectRatio() helper function
- Dynamic thumbnail calculation based on selected ratio
- 4-column metadata grid layout
- Custom styled select dropdown
- Aspect ratio state management
- Pass-through architecture from UI to image processor

## Version 2.2.0 (December 20, 2024)

### Final Polish & Refinements
- **Custom App Icon**: Created minimalist grid-based icon with orange accents
  - 6×7 grid pattern representing contact sheet layout
  - Orange highlighted cells matching UI buttons
  - SVG-based design for clean scaling
- **Persistent UI**: All interface elements now visible from start
  - Folder info shows "No folder selected" in empty state
  - No more hidden sections - better user understanding
  - Smooth state transitions instead of show/hide
- **Larger Window**: Increased from 800×680 to 800×760
  - Accommodates all UI states without scrolling
  - Better proportions for complete workflow
- **Kode Mono Branding**: App title now uses Kode Mono font
  - Consistent typography throughout application
  - Professional, cohesive aesthetic
- **Refined Contact Sheet Typography**:
  - Text color: White → Gray (#999999) for subtlety
  - Title size: 36px → 21px (16pt) - less prominent
  - Filenames: Left-aligned to thumbnail edges
  - Images are now the focus, text provides context
  
### User Experience Improvements
- Immediate visual feedback on app state
- Text doesn't compete with images in contact sheets
- More professional, editorial appearance
- Clearer information hierarchy

## Version 2.1.0 (December 20, 2024)

### UI Polish & Refinements
- **macOS Integration**: Added top padding (45px) to prevent window controls overlap
- **Orange Accent Buttons**: Primary action buttons now use warm orange (#ff6b35)
  - Select Folder and Generate buttons styled with orange
  - Disabled state: dark brown (#4a2618) with reduced opacity
  - Hover state: lighter orange (#ff8555)
- **Button Text Improvements**: "Select Folder →" with arrow instead of icon
- **Smart Tooltips**: Disabled generate button shows helpful tooltip on hover
  - Dynamic message based on what's missing
  - "Select a folder and fill in at least one metadata field"
- **Contact Sheet Typography**:
  - Title font size reduced: 44px → 36px (better proportions)
  - Title alignment: Center → Left-aligned to first column
  - Title height: 100px → 80px
  - Filename font size increased: 12px → 14px (more readable)
  - Better balanced spacing above and below title

### Design Improvements
- More compact and polished interface
- Better visual hierarchy with orange accent
- Improved accessibility with tooltips
- Refined contact sheet layout with left-aligned title

## Version 2.0.0 (December 20, 2024)

### Major UI Redesign - Swiss/Japanese Minimalist Aesthetic
- **Complete visual overhaul** with clean, minimal design philosophy
- **Monospace typography** throughout entire interface (Menlo/Monaco)
- **Reduced color palette**: Near-black background (#0a0a0a), dark gray cards (#141414), white accents
- **Flat design**: No gradients, minimal borders, 2px border-radius
- **Compact layout**: Fits entirely on 800×680 screen without scrolling
- **Grid-based spacing**: Precise 8px base unit system
- **Typography hierarchy**: Uppercase section headers with letter-spacing
- **Minimalist icons**: Simple geometric symbols (□, ▶, ↻, —)

### Contact Sheet Improvements
- **Uppercase Titles**: All contact sheet titles now render in uppercase with letter-spacing
- **Fixed Text Overlap**: Increased spacing between thumbnails and filenames (36px + 6px gap)
- **Kode Mono Font**: Properly implemented using system-installed font
  - Title: 44px, weight 600, 2px letter-spacing
  - Filenames: 12px, weight 400
  - Requires Kode Mono installed system-wide
- **Better Layout**: Improved vertical spacing prevents image/text collision

### UI Component Updates
- **Compact Header**: Single-line title, removed subtitle
- **Inline Folder Info**: Condensed display with key-value pairs
- **Smaller Inputs**: Tighter metadata grid with 8px gaps
- **Minimal Buttons**: Uppercase text, subtle hover states, 11px font
- **Refined Progress**: 2px progress bar, uppercase status text
- **Streamlined Footer**: Single line with supported formats

### Technical Changes
- Window size reduced to 800×680 pixels
- Removed base64 font embedding (uses system fonts)
- Simplified SVG text rendering
- Updated spacing constants in contact sheet generator
- Complete CSS rewrite with design system

### Breaking Changes
- **Requires Kode Mono font** to be installed system-wide for contact sheets
- UI no longer supports themes (fixed dark minimalist design)

## Version 1.1.0 (December 20, 2024)

### UI Improvements
- **Compact Layout**: Reduced padding and margins throughout to fit all content on one screen without scrolling
- **Responsive Window**: Set window to 850×750 with minimum size constraints
- **Smaller Headers**: Reduced header sizes and spacing for better space utilization

### Metadata Input
- **Multiple Fields**: Replaced single title input with three separate metadata fields:
  - Film Stock (e.g., "Porta 400")
  - Roll Number (e.g., "R3129")
  - Camera (e.g., "Nikon FM2")
- **Dynamic Title Preview**: Contact sheet title is built from metadata fields: `Roll - Film Stock - Camera`

### File Naming
- **Roll-Based Naming**: Filename now based on roll number instead of full title
- **Underscore Prefix**: All generated files start with `_` to appear at top of folder listings
- **Date Fallback**: If roll number is blank, uses current date (YYYY-MM-DD) with auto-incrementing serial number
- **Examples**:
  - With roll number: `_R3129.png`, `_R3129_2.png`
  - Without roll number: `_2024-12-20_1.png`, `_2024-12-20_2.png`

### Auto-Open Feature
- **New Checkbox**: Added "Open folder when completed" option
- **Default Enabled**: Checkbox is checked by default
- **Automatic**: Folder opens automatically after successful generation if enabled

### Layout Fixes
- **Increased Filename Space**: Raised filename area from 24px to 28px to prevent cropping
- **Better Spacing**: Increased vertical spacing between rows from 20px to 24px
- **Improved Separation**: Thumbnails and filenames now have better visual separation

### Technical Changes
- Updated IPC communication to pass metadata object instead of single title string
- Enhanced file naming logic with date-based serial counting
- Improved state management for multiple metadata fields

## Version 1.0.0 (December 20, 2024)

### Initial Release
- Electron-based desktop application for macOS
- 2048×1782px contact sheet generation
- 6×7 grid layout (42 images per sheet)
- Support for JPG, PNG, TIFF, GIF, BMP, DNG, and RAW formats
- Automatic multi-sheet generation for >42 images
- Modern dark-themed UI
- Progress indicators and error handling
