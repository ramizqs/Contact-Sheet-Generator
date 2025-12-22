# Quick Build Guide - v3.2.1

## What Changed

✅ **exiftool is now bundled with the app** (fully self-contained)
✅ **No user setup required** - works at full speed immediately
✅ **ASAR disabled** - Better performance

## Files Added to Git

```bash
assets/exiftool          # 312KB executable
assets/lib/              # ~3MB of Perl modules
```

These files MUST be committed to git for the build to work.

## Build Steps

### 1. Commit the new files (if not done already)
```bash
git add assets/exiftool assets/lib/
git add services/rawProcessor.js package.json
git commit -m "v3.2.1: Bundle exiftool for self-contained distribution"
```

### 2. Build the DMG
```bash
npm run build:universal
```

### 3. Test the DMG
```bash
# Install from dist/Contact Sheet Generator-3.2.1-universal.dmg
# Open the app
# Check Console.app for:
#   ✓ Using bundled exiftool at: /Applications/Contact Sheet Generator.app/Contents/Resources/app/assets/exiftool
#   Version: 12.70 (bundled with app)
```

### 4. Verify DNG Performance
- Load a folder with DNG files
- Should be **instant** (just like dev mode)
- Check that B&W DNGs display correctly

## Distribution

The DMG is now fully self-contained. Users can:
1. Download the DMG
2. Install to Applications
3. Start using immediately

**No Homebrew, no exiftool installation, no setup whatsoever!**

## Troubleshooting

### Build fails
- Make sure `assets/exiftool` and `assets/lib/` are committed
- Check that `assets/exiftool` is executable: `chmod +x assets/exiftool`

### exiftool not found in packaged app
- Check Console.app for errors
- Verify path in `rawProcessor.js` matches actual location in app bundle
- For universal builds, both architectures need access to the script

### Still slow in production
- Check Console.app - should show "Using bundled exiftool"
- If it says "sips" or "Sharp", exiftool isn't being found
- Verify `assets/exiftool` and `assets/lib/` exist in the .app bundle

---

**Bottom Line**: Build, test, ship. It just works! 🚀

