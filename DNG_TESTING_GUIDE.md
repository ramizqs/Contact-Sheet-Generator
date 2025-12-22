# Quick Testing Guide for DNG Fix (v3.0.1)

## What Was Fixed

Your Contact Sheet Generator v3.0.0 was silently failing with DNG files. Version 3.0.1 now:

✅ **Detects the problem** - Checks if Sharp has RAW support at startup  
✅ **Shows detailed errors** - Per-file logging so you know exactly what's failing  
✅ **Warns the user** - Success messages list failed files with guidance  
✅ **Provides solutions** - Comprehensive documentation with workarounds  

## Quick Test (5 minutes)

### Step 1: Run the App
```bash
cd "/Users/ramizqs/Code/Contact-Sheet-Generator"
npm start
```

### Step 2: Check Startup Messages
Look at the terminal where you ran `npm start`. You should see:

```
📷 Image Format Support Check:
================================

✅ Standard Formats:
   ✓ JPEG: supported
   ✓ PNG: supported
   ✓ TIFF: supported
   ...

📸 RAW Format Support:
   ℹ️  No explicit RAW format support detected
   ℹ️  Sharp will attempt to extract embedded previews
   ℹ️  Some DNG files may not load properly
   ℹ️  See DNG_SUPPORT.md for details and workarounds
================================
```

**What this means:**
- Standard formats (JPEG, PNG, TIFF) will work perfectly ✅
- DNG files might work if they have embedded previews ⚠️
- Some DNG files may fail to load ⚠️

### Step 3: Test Your DNG Folder

1. **In the app window:**
   - Click "📁 SELECT FOLDER"
   - Choose your folder full of DNGs
   - Fill in metadata (Film Stock, Roll Number, etc.)
   - Click "GENERATE CONTACT SHEETS"

2. **Watch the terminal console:**
   - You'll see each file being loaded:
   ```
   📸 Loading 50 images...
   Loading RAW file: IMG_0001.DNG
     ✓ RAW metadata: 6000x4000, format: tiff
     ✓ Successfully loaded IMG_0001.DNG
   Loading RAW file: IMG_0002.DNG
     ✗ RAW processing failed for IMG_0002.DNG:
       Error: unsupported image format
       This may indicate:
       - Sharp's libvips doesn't have RAW support compiled in
       - The DNG file doesn't have an embedded preview
       - The file may be corrupted
   ```

3. **Check the results:**
   - **If all DNGs work:** You'll see "Successfully generated X contact sheets!" ✅
   - **If some DNGs fail:** You'll see a warning listing which files were skipped ⚠️
   - **If all DNGs fail:** You'll see a clear error with suggestions 🔴

### Step 4: Interpret the Results

#### Scenario A: All DNGs Worked ✅
```
Successfully generated 2 contact sheets!
```

**Great!** Your DNGs have embedded previews that Sharp can extract. Continue using the app as normal.

#### Scenario B: Some DNGs Worked ⚠️
```
Successfully generated 2 contact sheets

⚠️ Warning: 12 images could not be loaded and were skipped.

Skipped files:
• IMG_0005.DNG
• IMG_0012.DNG
• IMG_0023.DNG
• IMG_0034.DNG
• IMG_0048.DNG
• ... and 7 more

Note: DNG files require proper RAW support. Check the console for details.

Successfully processed: 84 images
```

**Mixed results.** Some DNGs worked, others didn't. Options:
1. Use the contact sheets from the files that worked
2. Convert the failed DNGs and retry
3. Use Option 2 or 3 below for all files

#### Scenario C: All DNGs Failed 🔴
```
Error: No images could be loaded. 50 files failed to process.
This may indicate:
- DNG files without proper RAW support
- Corrupted image files
- Unsupported file formats

Check the console for detailed error messages.
```

**Complete failure.** Sharp can't process your DNGs. Use Option 2 or 3 below.

## Solutions if DNGs Don't Work

### Option 1: Try Adobe DNG Converter (Quick Fix)
```
1. Download Adobe DNG Converter (free)
2. Convert your DNGs with "Full Size" embedded preview option
3. Use the converted DNGs with Contact Sheet Generator
4. The larger embedded previews should work better
```

**Time:** 5-10 minutes for conversion  
**Quality:** Medium (using embedded preview)  
**Best for:** Quick contact sheets from field work

### Option 2: Convert to JPEG (Simple Workflow)
```
1. Open your image management app (Photos, Lightroom, Capture One)
2. Select all DNGs
3. Export as JPEG (quality 90-100%)
4. Generate contact sheets from the JPEGs
```

**Time:** 10-15 minutes  
**Quality:** Good (you control processing)  
**Best for:** When you want some control over look

### Option 3: Process RAW First (Best Quality) ⭐ **RECOMMENDED**
```
1. Import DNGs into Lightroom / Capture One / Adobe Camera Raw
2. Apply your processing (white balance, exposure, etc.)
3. Export as:
   - 16-bit TIFF (maximum quality)
   - OR high-quality JPEG (quality 95+)
4. Generate contact sheets from exports
```

**Time:** 20-30 minutes (depending on processing)  
**Quality:** Maximum (full RAW workflow)  
**Best for:** Portfolio work, client presentations, archival

**Why this is best:**
- Full control over RAW processing
- Consistent look across all images
- Maximum quality output
- Contact sheets match your artistic intent
- Faster processing (no RAW extraction needed)

## What to Expect

### With Current Fix (v3.0.1)

**The app will:**
- ✅ Try to load each DNG file
- ✅ Extract embedded JPEG preview if available
- ✅ Log detailed success/failure per file
- ✅ Generate contact sheets from successful files
- ✅ Warn you about failed files
- ✅ Provide guidance on next steps

**The app will NOT:**
- ❌ Fully decode RAW data (Sharp limitation)
- ❌ Apply RAW processing (white balance, exposure, etc.)
- ❌ Guarantee all DNGs will work
- ❌ Modify your original DNG files

### Why DNGs Might Not Work

**Technical reason:**
- Sharp (the image library) requires libvips with libraw support
- Precompiled Sharp binaries don't always include libraw
- This is a limitation of the npm Sharp package
- Not something we can easily fix without custom Sharp compilation

**What this means:**
- Standard formats (JPEG, PNG, TIFF) work perfectly
- DNGs with embedded previews might work
- DNGs without embedded previews will fail
- Processing RAW files first is more reliable

## Detailed Documentation

For comprehensive troubleshooting, see:
- **DNG_SUPPORT.md** - Full documentation on DNG support
- **DNG_FIX_SUMMARY.md** - Technical details of what was changed
- **CHANGELOG.md** - Version 3.0.1 changelog entry

## Need Help?

### Check Console Output
The terminal shows exactly what's happening. Copy the console output when reporting issues.

### Try Test Files
Before processing 500 DNGs:
1. Test with 10 DNGs first
2. Check success rate
3. Decide on best workflow

### Report Issues
If reporting DNG problems, include:
1. macOS version and Mac model
2. DNG source (camera model)
3. Console output showing errors
4. Success rate (X/Y files loaded)

## Summary

**What you should do:**

1. ✅ **Test the app** with your DNG folder (5 minutes)
2. 📊 **Check the results** in console output
3. 🎯 **Choose workflow** based on results:
   - All worked? Keep using DNGs directly
   - Mixed results? Try DNG Converter
   - None worked? Process RAW files first (recommended)

**The improved app will tell you exactly what's happening instead of silently failing. That's the main win here.**

## Next Steps

Ready to test? Run:
```bash
cd "/Users/ramizqs/Code/Contact-Sheet-Generator"
npm start
```

Then try your DNG folder and see what happens! 🎬📸

