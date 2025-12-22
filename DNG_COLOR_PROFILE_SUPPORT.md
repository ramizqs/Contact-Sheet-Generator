# DNG Color Profile Support

## Overview

As of this update, Contact Sheet Generator can now extract embedded previews from DNG files that **respect applied color profiles**. This means if you shot in black and white mode (or applied any other color profile), the contact sheet will display the images exactly as they appear in macOS Finder.

## How It Works

DNG files contain embedded JPEG previews that include any applied color profiles. The app now uses `exiftool` to extract these previews, ensuring that:

- ✅ Black and white modes are preserved
- ✅ Color grading is respected  
- ✅ Camera picture styles are maintained
- ✅ Any in-camera processing is reflected

## Installation

### Step 1: Install exiftool

**Using Homebrew (Recommended):**
```bash
brew install exiftool
```

**Alternative Methods:**
- Download from https://exiftool.org/
- Install via MacPorts: `sudo port install p5-image-exiftool`

### Step 2: Verify Installation

```bash
which exiftool
# Should output: /usr/local/bin/exiftool or /opt/homebrew/bin/exiftool

exiftool -ver
# Should output version number (e.g., 12.70)
```

### Step 3: Restart Contact Sheet Generator

After installing exiftool, restart the app. You should see:
```
✓ exiftool detected - Will extract embedded DNG previews (respects color profiles)
```

## Processing Order

The app now tries these methods in order:

1. **exiftool preview extraction** ⭐ (Best - respects color profiles)
2. **sips conversion** (Fallback - may not respect profiles)
3. **Sharp embedded preview** (Last resort)

## Testing

### Before exiftool:
- DNGs shot in B&W mode → Showed in color on contact sheet

### After exiftool:
- DNGs shot in B&W mode → Shows in B&W on contact sheet ✓
- DNGs with color profiles → Profiles are respected ✓

## Troubleshooting

### "exiftool not found" in Console

**Problem:** exiftool is not installed or not in PATH

**Solution:** 
1. Install exiftool using one of the methods above
2. Restart Contact Sheet Generator
3. Check Console output for confirmation

### "No embedded preview found"

**Problem:** Some DNGs don't have embedded previews (rare)

**Solution:** The app will automatically fall back to sips or Sharp processing

### Still showing color instead of B&W

**Causes:**
1. exiftool not installed (check Console output)
2. DNG doesn't have embedded preview
3. exiftool not in system PATH

**Solution:**
1. Verify exiftool is installed: `which exiftool`
2. Check app Console for "exiftool detected" message
3. If still failing, check individual file processing logs

## Technical Details

### What Changed

**Before:**
```javascript
// Used sips to convert RAW data to JPEG
// This bypasses embedded previews and color profiles
sips -s format jpeg "${dng_file}" --out "${output}"
```

**After:**
```javascript
// Extract embedded preview that respects color profiles
exiftool -b -PreviewImage "${dng_file}"
```

### Benefits

1. **Accurate representation** - Shows exactly what you shot
2. **Faster processing** - Extracts preview vs. converting RAW data
3. **Smaller file handling** - Preview is typically smaller than full RAW
4. **Profile preservation** - All camera settings respected

### File Size Impact

Embedded JPEG previews are typically:
- Full-frame cameras: 1-3 MB per preview
- APS-C cameras: 500 KB - 2 MB per preview
- Much smaller than converting full RAW data

## FAQ

### Q: Do I need to rebuild/reinstall the app?

**A:** No! Just install exiftool and restart the app.

### Q: Will this work with other RAW formats (CR2, NEF, etc.)?

**A:** Yes! exiftool supports embedded preview extraction from most RAW formats.

### Q: What if I don't have exiftool?

**A:** The app will automatically fall back to the previous methods (sips or Sharp).

### Q: Does this affect processing speed?

**A:** Actually, it's often **faster** because extracting a preview is quicker than converting full RAW data.

### Q: Can I verify it's working?

**A:** Yes! Open DevTools (View → Toggle Developer Tools) and check the Console. You'll see messages like:
```
✓ exiftool detected - Will extract embedded DNG previews (respects color profiles)
🔍 Extracting embedded preview: IMG_1234.DNG
✓ Successfully extracted preview: IMG_1234.DNG (1024KB)
   Preview respects applied color profiles (e.g., B&W rendering)
```

## Version History

- **Current Update:** Added exiftool support for color profile preservation
- **v3.0.0:** Initial DNG support with sips
- **v2.0.0:** Standard image format support

## Summary

This update solves the problem where DNGs shot in black and white (or with other color profiles) were appearing in full color on contact sheets. By extracting the embedded preview that Finder uses, we now get accurate representations of your images.

**Action Required:** Install exiftool and restart the app to enable this feature.

