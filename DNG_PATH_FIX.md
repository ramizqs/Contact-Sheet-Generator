# DNG Preview Extraction Fix - Path Resolution

## Problem

The packaged DMG app (v3.2.0) was loading DNG files **much slower** than the development build (`npm start`). Investigation revealed that the packaged app was **not extracting embedded JPEG previews** from DNG files like the dev build was.

### Root Cause

**macOS apps launched from Finder have a very limited PATH environment variable.**

- **Dev mode (`npm start`)**: Inherits your terminal's PATH, which includes:
  - `/usr/local/bin` (Homebrew on Intel Macs)
  - `/opt/homebrew/bin` (Homebrew on Apple Silicon)
  - Other custom paths

- **Production mode (DMG)**: PATH is severely restricted, typically only:
  - `/usr/bin`
  - `/bin`

This means `exiftool` (installed via Homebrew) and even `sips` (sometimes in `/usr/bin`, sometimes elsewhere) couldn't be found, causing the app to fall back to Sharp's slower preview extraction method.

## Solution

Modified `services/rawProcessor.js` to **actively search for commands** in common installation locations instead of relying on PATH:

### Key Changes

1. **Added `findCommand()` function** - Searches common paths:
   - `/usr/local/bin` (Homebrew Intel)
   - `/opt/homebrew/bin` (Homebrew Apple Silicon)
   - `/opt/local/bin` (MacPorts)
   - `/usr/bin` (System utilities)
   - `/bin` (Core system)

2. **Cached command paths** at module load:
   ```javascript
   let sipsPath = null;
   let exiftoolPath = null;
   ```

3. **Updated all tool invocations** to use full paths:
   - `processRawWithSips()` now uses `"${sipsPath}" ...`
   - `extractDngPreview()` now uses `"${exiftoolPath}" ...`

4. **Smart fallback** - If paths aren't found at module load, functions will retry once before failing

### Additional Fix

Changed `package.json` build configuration:
- **Disabled ASAR packaging** (`"asar": false`)
- This eliminates module loading overhead and improves overall performance
- All files are now directly accessible (faster I/O)

## Testing

To verify the fix works:

1. **Build a new version**:
   ```bash
   npm run build:universal
   ```

2. **Install the new DMG** to `/Applications`

3. **Test with DNG files**:
   - Launch the app from Applications folder (not from terminal)
   - Load a folder with DNG files
   - Check Console.app logs for:
     - `✓ exiftool available at: /opt/homebrew/bin/exiftool`
     - `✓ sips available at: /usr/bin/sips`
     - `✓ Using embedded preview (respects color profile)`

4. **Performance should now match dev build** - DNG previews load instantly

## Technical Details

### Why This Matters for DNG Processing

The app uses a three-tier fallback system for RAW/DNG files:

1. **exiftool** (Best) - Extracts embedded preview with color profiles intact
   - Preserves black & white conversions, tone curves, etc.
   - Fastest method (no conversion needed)

2. **sips** (Good) - macOS native RAW converter
   - Converts RAW sensor data to JPEG
   - May not respect all color profiles

3. **Sharp** (Fallback) - Attempts to extract embedded preview
   - Slowest method
   - May fail on some DNG files

Without proper PATH resolution, the packaged app was always falling to method #3, making DNG loading extremely slow.

## Files Modified

- `services/rawProcessor.js` - Added path resolution logic
- `package.json` - Disabled ASAR packaging

## Version

This fix will be included in **v3.2.1** (or next release).

---

**Note**: This is a common issue with Electron apps on macOS. The solution can be applied to any command-line tool your app needs to use (ImageMagick, FFmpeg, etc.).

