# DNG and RAW File Support

## Overview

Contact Sheet Generator v3.0.0 includes support for DNG (Digital Negative) and other RAW file formats. However, the level of support depends on how Sharp's underlying image processing library (libvips) was compiled.

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

When you select a folder with DNG or other RAW files, the app:

1. **Detects RAW files** by extension (.dng, .cr2, etc.)
2. **Extracts embedded previews** using Sharp/libvips
3. **Processes the preview** just like standard image files
4. **Includes in contact sheet** if successful

## Common Issues with DNG Files

### Issue: "No images could be loaded" or DNG files are skipped

**Cause:** Sharp's precompiled binaries may not include full RAW support, particularly if libvips wasn't compiled with libraw support.

**Solutions:**

#### Option 1: Check Console Output (Recommended)
1. Open Contact Sheet Generator
2. In development mode, open DevTools (View → Toggle Developer Tools)
3. Try loading your DNG folder
4. Check the console for detailed error messages:
   - "RAW processing failed" indicates Sharp can't process DNGs
   - "Successfully loaded" indicates DNGs are working

#### Option 2: Use Embedded JPEG Previews
Most DNG files contain embedded JPEG previews. If Sharp can't process the RAW data, it should still extract these previews. The enhanced error logging in v3.0.0 will tell you exactly what's happening.

#### Option 3: Convert DNGs to JPEG/PNG
If DNG processing consistently fails:
1. Use Adobe Camera Raw, Lightroom, or Capture One
2. Export your DNGs as JPEG or PNG files
3. Generate contact sheets from the exported files
4. This also gives you control over RAW processing (exposure, white balance, etc.)

#### Option 4: Use DNG Converter
Adobe's free DNG Converter can create DNGs with larger embedded previews:
1. Download Adobe DNG Converter
2. Convert your DNGs with "Full Size" preview option
3. Use the converted DNGs with Contact Sheet Generator

## Technical Details

### Sharp and libvips

Contact Sheet Generator uses [Sharp](https://sharp.pixelplumbing.com/) for image processing. Sharp depends on [libvips](https://www.libvips.org/), which can be compiled with [libraw](https://www.libraw.org/) for RAW support.

The precompiled Sharp binaries from npm may or may not include full RAW support depending on:
- Operating system (macOS, Windows, Linux)
- Architecture (Intel, Apple Silicon, ARM)
- Build configuration

### What the App Does Differently in v3.0.0

Enhanced error handling:
- **Detailed logging** - Every DNG file loading attempt is logged with success/failure
- **Metadata checking** - Verifies file can be read before processing
- **Graceful failures** - Skips problematic files and continues with others
- **User feedback** - Shows exactly which files failed and why
- **Summary reporting** - Reports X images loaded, Y images skipped

### Checking Sharp's RAW Support

You can verify Sharp's capabilities:

```javascript
const sharp = require('sharp');
console.log(sharp.format);
```

Look for formats like `dng`, `nef`, `cr2` in the supported formats list.

## Best Practices

### For Reliable Contact Sheets

1. **Test First** - Try a small batch (10-20 DNGs) before processing hundreds
2. **Check Console** - Look for "Successfully loaded" messages for your DNGs
3. **Mixed Format** - You can include both JPEGs and DNGs in the same folder
4. **Embedded Previews** - Ensure your DNGs have embedded previews (most do)

### For Best Quality

If you need maximum quality contact sheets from RAW files:

1. **Process RAW files first** in your preferred RAW processor
2. **Export as 16-bit TIFF** or high-quality JPEG
3. **Generate contact sheets** from the processed files
4. This gives you:
   - Control over RAW processing
   - Consistent color/exposure
   - Maximum quality
   - Faster processing

## Error Messages Explained

### "RAW processing failed: unsupported image format"
- Sharp's libvips doesn't have RAW support compiled in
- **Solution:** Convert DNGs to JPEG/TIFF first

### "RAW processing failed: VipsJpeg: Corrupt JPEG data"
- DNG doesn't have an embedded JPEG preview (rare)
- **Solution:** Use Adobe DNG Converter with full-size preview option

### "No images could be loaded. X files failed to process"
- All DNG files in the folder failed to load
- **Solution:** Check console for specific errors, consider converting files

### "Successfully loaded X images, Y images skipped"
- Some DNGs worked, others didn't
- **Solution:** Check which files failed (listed in error message), those may be corrupted

## Future Improvements

Planned enhancements for better RAW support:

### v3.1.0 (Short term)
- Better RAW format detection
- Automatic fallback to alternative processing methods
- More detailed error messages per file

### v3.2.0 (Medium term)
- Option to use external RAW processors
- Batch conversion tools
- RAW processing presets

### v4.0.0 (Long term)
- Native libraw integration
- Custom Sharp builds with guaranteed RAW support
- Advanced RAW processing options

## Getting Help

If you're experiencing DNG issues:

1. **Check the console output** - Enable DevTools to see detailed logs
2. **Note the specific error messages** - Include these when reporting issues
3. **Test with a single DNG file** - Isolate if it's a file or system issue
4. **Try the conversion workflow** - Verify your DNGs work when converted to JPEG

## Technical Support

### Reporting DNG Issues

When reporting DNG problems, please include:

1. **System info:**
   - macOS version
   - Mac model (Intel or Apple Silicon)
   - Contact Sheet Generator version

2. **Error details:**
   - Console output (copy the full error messages)
   - Number of DNG files attempted
   - DNG source (camera model, software that created them)

3. **What you've tried:**
   - Does the same folder work if you convert DNGs to JPEG?
   - Do standard JPEG files in the same folder work?
   - Can you open the DNGs in Preview or another app?

## Summary

DNG support in Contact Sheet Generator v3.0.0:

✅ **Included** - DNG files are recognized and processed  
✅ **Enhanced logging** - Detailed error messages for troubleshooting  
✅ **Graceful handling** - Skips problematic files, processes the rest  
✅ **User feedback** - Clear messages about what succeeded/failed  

⚠️ **Dependent on Sharp/libvips** - RAW support varies by platform  
⚠️ **May require conversion** - If Sharp can't process DNGs natively  

💡 **Recommended workflow** - For critical work, convert RAW files first for maximum control and reliability

