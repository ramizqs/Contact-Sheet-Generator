# DNG and RAW File Support

## Overview

Contact Sheet Generator includes support for DNG (Digital Negative) and other RAW file formats. The app uses a smart multi-tier approach to extract previews from RAW files with optimal quality and performance.

## Supported RAW Formats

The application attempts to process the following RAW formats:
- **DNG** - Adobe Digital Negative
- **CR2** - Canon RAW
- **NEF** - Nikon RAW
- **ARW** - Sony RAW
- **ORF** - Olympus RAW
- **RW2** - Panasonic RAW
- **RAF** - Fujifilm RAW

## How RAW Processing Works

The app uses a three-tier fallback system for RAW/DNG files:

1. **exiftool** (Best) ⭐
   - Extracts embedded preview with color profiles intact
   - Preserves black & white conversions, tone curves, etc.
   - Fastest method (no conversion needed)
   - Requires separate installation

2. **sips** (Good)
   - macOS native RAW converter (built-in)
   - Converts RAW sensor data to JPEG
   - May not respect all color profiles

3. **Sharp** (Fallback)
   - Attempts to extract embedded preview via libvips
   - Slowest method
   - May fail on some DNG files without embedded previews

## Installing exiftool (Recommended for DNG Users)

For optimal DNG/RAW performance, install exiftool:

```bash
# Using Homebrew (recommended)
brew install exiftool

# If you don't have Homebrew, install it first:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Benefits:**
- ⚡ Instant DNG loading (extracts embedded previews)
- ✅ Preserves color profiles (B&W mode, picture styles, etc.)
- 🎨 Shows images exactly as they appear in Finder

**Verification:**
```bash
which exiftool
# Should output: /usr/local/bin/exiftool or /opt/homebrew/bin/exiftool

exiftool -ver
# Should output version number (e.g., 12.70)
```

After installing, restart Contact Sheet Generator. You should see:
```
✓ exiftool detected - Will extract embedded DNG previews (respects color profiles)
```

## Common Issues and Solutions

### Issue: DNGs Load Slowly

**Cause:** exiftool not installed or not found in PATH

**Solution:**
1. Install exiftool using Homebrew (see above)
2. Restart the app
3. The app will now use fast preview extraction

### Issue: Black & White DNGs Show in Color

**Cause:** Using sips/Sharp instead of exiftool

**Solution:**
1. Install exiftool (see above)
2. exiftool extracts the embedded preview that respects color profiles
3. Your B&W settings will now be preserved

### Issue: "No images could be loaded"

**Causes:**
- DNGs don't have embedded previews (rare)
- Sharp's libvips doesn't have RAW support compiled in
- Corrupted files

**Solutions:**

#### Option 1: Install exiftool (Quick Fix)
- Most effective solution
- Works with 99% of DNG files
- Preserves color profiles

#### Option 2: Convert with Adobe DNG Converter
1. Download Adobe DNG Converter (free)
2. Convert DNGs with "Full Size" embedded preview option
3. Use converted DNGs with Contact Sheet Generator

#### Option 3: Process RAW First (Best Quality) ⭐ **RECOMMENDED FOR PROFESSIONAL WORK**
1. Import DNGs into Lightroom / Capture One / Adobe Camera Raw
2. Apply your processing (white balance, exposure, etc.)
3. Export as:
   - 16-bit TIFF (maximum quality)
   - OR high-quality JPEG (quality 95+)
4. Generate contact sheets from exports

**Why this is best:**
- Full control over RAW processing
- Consistent look across all images
- Maximum quality output
- Contact sheets match your artistic intent
- Faster processing (no RAW extraction needed)

### Issue: Path Resolution in Packaged App

**Problem:** The packaged DMG app loads DNGs slower than dev mode

**Cause:** macOS apps launched from Finder have a limited PATH environment variable and can't find exiftool/sips installed via Homebrew

**Solution:** This has been fixed in v3.2.1+ - the app now actively searches for tools in common locations:
- `/opt/homebrew/bin` (Homebrew Apple Silicon)
- `/usr/local/bin` (Homebrew Intel)
- `/opt/local/bin` (MacPorts)
- `/usr/bin` (System utilities)

## Best Practices

### For Reliable Contact Sheets

1. **Install exiftool** - For best DNG/RAW support
2. **Test First** - Try a small batch (10-20 files) before processing hundreds
3. **Check Console** - Look for success messages in DevTools
4. **Mixed Format** - You can include both JPEGs and DNGs in the same folder

### For Maximum Quality

If you need professional-grade contact sheets from RAW files:

1. **Process RAW files first** in your preferred RAW processor
2. **Export as 16-bit TIFF** or high-quality JPEG
3. **Generate contact sheets** from the processed files
4. Benefits:
   - Control over RAW processing
   - Consistent color/exposure
   - Maximum quality
   - Faster processing

## Diagnostic Information

### At Startup

The app checks tool availability:
```
✓ exiftool available at: /opt/homebrew/bin/exiftool
✓ sips available at: /usr/bin/sips
✓ Using embedded preview (respects color profile)
```

### During Loading

Watch the console for per-file status:
```
📸 Loading 50 images...
Loading RAW file: IMG_0001.DNG
  ✓ RAW metadata: 6000x4000, format: tiff
  ✓ Successfully loaded IMG_0001.DNG (using exiftool)
```

### After Processing

Results summary:
```
✅ Successfully loaded: 45/50 images
❌ Failed to load: 5 images
   Failed files: IMG_0002.DNG, IMG_0005.DNG, ...
```

## Technical Details

### Sharp and libvips

Contact Sheet Generator uses [Sharp](https://sharp.pixelplumbing.com/) for image processing. Sharp depends on [libvips](https://www.libvips.org/), which can be compiled with [libraw](https://www.libraw.org/) for RAW support.

The precompiled Sharp binaries from npm may or may not include full RAW support depending on:
- Operating system (macOS, Windows, Linux)
- Architecture (Intel, Apple Silicon, ARM)
- Build configuration

### Why exiftool is Better

DNG files contain embedded JPEG previews that include any applied color profiles. By using exiftool to extract these previews:

✅ Black and white modes are preserved  
✅ Color grading is respected  
✅ Camera picture styles are maintained  
✅ Any in-camera processing is reflected  
✅ Faster than converting RAW data  
✅ Smaller file handling

### File Size Impact

Embedded JPEG previews are typically:
- Full-frame cameras: 1-3 MB per preview
- APS-C cameras: 500 KB - 2 MB per preview
- Much smaller than converting full RAW data

## Troubleshooting

### Check Tool Availability

Open DevTools (View → Toggle Developer Tools) and check the Console for:
- Tool detection messages at startup
- Per-file loading status
- Error messages with specific causes

### Test with Sample Files

Before processing large batches:
1. Test with 10-20 files first
2. Check console output for success rate
3. Verify output quality
4. Adjust workflow if needed

### Verify Installation

```bash
# Check exiftool
which exiftool
exiftool -ver

# Check sips (should be built into macOS)
which sips
```

## FAQ

### Q: Do I need to rebuild/reinstall the app to use exiftool?

**A:** No! Just install exiftool and restart the app.

### Q: Will this work with other RAW formats (CR2, NEF, etc.)?

**A:** Yes! exiftool supports embedded preview extraction from most RAW formats.

### Q: What if I don't have exiftool?

**A:** The app will automatically fall back to sips or Sharp. It will still work, but may be slower and might not preserve color profiles.

### Q: Does exiftool affect processing speed?

**A:** Actually, it's often **faster** because extracting a preview is quicker than converting full RAW data.

### Q: Can I verify it's working?

**A:** Yes! Open DevTools and check the Console. You'll see messages like:
```
✓ exiftool detected - Will extract embedded DNG previews (respects color profiles)
🔍 Extracting embedded preview: IMG_1234.DNG
✓ Successfully extracted preview: IMG_1234.DNG (1024KB)
```

## Summary

**DNG support in Contact Sheet Generator:**

✅ **Included** - DNG files are recognized and processed  
✅ **Smart fallback** - Multiple methods for maximum compatibility  
✅ **Enhanced logging** - Detailed error messages for troubleshooting  
✅ **Graceful handling** - Skips problematic files, processes the rest  
✅ **User feedback** - Clear messages about what succeeded/failed  
✅ **exiftool integration** - Optional but recommended for best results

⚠️ **Best practices:**
- Install exiftool for optimal performance
- Test with small batches first
- For critical work, process RAW files in dedicated editor first

💡 **Recommended workflow for professional work:**  
RAW Files → Lightroom/Capture One → Export TIFF/JPEG → Contact Sheet Generator

