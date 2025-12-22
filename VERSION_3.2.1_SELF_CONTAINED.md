# Version 3.2.1 - Fully Self-Contained Release

## Overview

Contact Sheet Generator v3.2.1 is now **fully self-contained** - it includes exiftool bundled directly in the app. No external dependencies required for optimal DNG/RAW performance!

## What's New

### 🎁 Bundled exiftool
- **exiftool 12.70** is now included with the app
- **Zero setup required** - works at full speed out of the box
- **No Homebrew installation needed** - the app is completely portable
- **Consistent performance** - all users get the same fast DNG loading

### 🚀 Performance Improvements
- **Disabled ASAR packaging** - Faster file I/O and module loading
- **Smart tool detection** - Automatically finds bundled tools regardless of PATH
- **Instant DNG preview extraction** - Uses embedded previews with color profiles intact

### 🔧 Technical Changes
- Added `assets/exiftool` (312KB) - Perl executable
- Added `assets/lib/` - ExifTool modules
- Modified `rawProcessor.js` - Checks bundled tools first, then system tools
- Updated `package.json` - Disabled ASAR, bumped version to 3.2.1

## For End Users

### Installation
1. Download the DMG
2. Drag to Applications
3. **That's it!** No additional setup needed

### DNG/RAW Performance
- **Instant loading** - Embedded JPEG previews extracted in milliseconds
- **Color profiles preserved** - Black & white DNGs display correctly
- **Wide format support** - DNG, CR2, NEF, ARW, ORF, RW2, RAF

## For Developers

### Building
```bash
npm run build:universal
```

The build process automatically includes:
- `assets/exiftool` - Executable (bundled)
- `assets/lib/` - Perl modules (bundled)
- `node_modules/sharp/` - Native modules (unpacked via asar: false)
- `node_modules/canvas/` - Native modules (unpacked via asar: false)

### How Bundled exiftool Works

1. **Path Detection** (`findCommand()` in `rawProcessor.js`):
   ```
   1. Check bundled assets/exiftool first
   2. Fall back to system PATH
   3. Search common installation directories
   ```

2. **Dev Mode vs Production**:
   - **Dev**: `__dirname/../assets/exiftool`
   - **Packaged**: `process.resourcesPath/app/assets/exiftool`

3. **Perl Module Resolution**:
   - exiftool script looks for `lib/` relative to its location
   - `assets/lib/Image/ExifTool/...` contains all required modules

### Why This Matters

**Before v3.2.1**:
- DMG apps launched from Finder had limited PATH
- Couldn't find exiftool in `/opt/homebrew/bin`
- Fell back to slow Sharp preview extraction
- Users needed to manually install exiftool

**After v3.2.1**:
- exiftool bundled with the app
- Works immediately for all users
- Consistent, fast performance
- True "download and go" experience

## License Compliance

exiftool is licensed under:
- **Perl Artistic License** (or)
- **GNU GPL v1+**

Both licenses allow redistribution. The bundled exiftool is:
- Unmodified from source
- Includes original LICENSE file (in assets/lib/)
- Attribution maintained

## App Size Impact

| Component | Size |
|-----------|------|
| exiftool binary | 312 KB |
| ExifTool modules | ~3 MB |
| **Total increase** | **~3.3 MB** |

This is a tiny increase (<1% of total app size) for a massive UX improvement.

## Testing Checklist

Before release, verify:

- [ ] Build completes without errors
- [ ] DMG installs correctly
- [ ] App launches without Homebrew/exiftool installed on system
- [ ] DNG files load instantly
- [ ] Console shows "Using bundled exiftool at: ..."
- [ ] Black & white DNGs display correctly
- [ ] Standard images (JPG, PNG, TIFF) work as expected
- [ ] Code signing is valid (if signed)

## Changelog

### Added
- Bundled exiftool 12.70 with full module library
- Automatic detection of bundled tools

### Changed
- Disabled ASAR packaging for improved I/O performance
- Updated tool path resolution to prioritize bundled versions
- Version bumped to 3.2.1

### Fixed
- Slow DNG loading in packaged DMG (PATH resolution issue)
- Inconsistent performance between dev and production builds

---

**Result**: Contact Sheet Generator is now a true "zero-setup" application with professional-grade RAW file support built-in. 🎉

