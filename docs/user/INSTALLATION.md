# Contact Sheet Generator - Installation Guide

## System Requirements

- macOS 10.15 or later
- Apple Silicon (M1/M2/M3) or Intel processor

## Installation Steps

1. **Download the DMG file**

2. **Open the DMG** by double-clicking it

3. **Drag Contact Sheet Generator** to your Applications folder

4. **Eject the DMG** by:
   - Right-clicking the mounted disk on your desktop and selecting "Eject"
   - Or dragging it to the Trash

5. **Launch the app** from your Applications folder

## First Launch Security Notice

On macOS, when you first open the app, you might see a security warning:

> "Contact Sheet Generator can't be opened because it is from an unidentified developer"

This is normal for apps distributed outside the Mac App Store. To open the app:

### Method 1: Using System Settings (Recommended)
1. Go to **System Settings** > **Privacy & Security**
2. Scroll down to the Security section
3. You'll see a message about Contact Sheet Generator being blocked
4. Click **Open Anyway**
5. Click **Open** in the confirmation dialog

### Method 2: Right-Click to Open
1. **Right-click** (or Control-click) the Contact Sheet Generator app in your Applications folder
2. Select **Open** from the menu
3. Click **Open** in the dialog that appears

**Note:** You only need to do this once. After the first time, you can open the app normally.

## Optional: Install exiftool for DNG/RAW Support

If you work with DNG or RAW files, installing **exiftool** will provide:
- ⚡ Instant DNG preview loading
- ✅ Correct black & white rendering
- 🎨 Preserved color profiles

### Installation

```bash
# If you have Homebrew installed:
brew install exiftool

# If you don't have Homebrew, install it first:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Verification

```bash
which exiftool
# Should output: /usr/local/bin/exiftool or /opt/homebrew/bin/exiftool

exiftool -ver
# Should output version number (e.g., 12.70)
```

After installing exiftool, restart Contact Sheet Generator.

### Do I need exiftool?

| If you use... | Do you need it? |
|--------------|----------------|
| **Only JPG/PNG files** | ⏭️ No, app works perfectly out of the box |
| **DNG/RAW files occasionally** | ✅ Recommended for better experience |
| **DNG/RAW files frequently** | ✅ Yes, install for best performance |
| **B&W DNG files** | ✅ Yes, to display B&W correctly |

## Using the App

Once installed:

1. Click **"📁 SELECT FOLDER"** to choose a folder containing images
2. Fill in metadata fields:
   - Roll Number
   - Film Stock
   - ISO
   - Camera
   - Notes (optional)
3. Choose your resolution (2K, 4K, 6K, or 8K)
4. Click **"GENERATE CONTACT SHEETS"**
5. The output folder will open automatically when complete

## Troubleshooting

### "App is damaged and can't be opened"

This is a quarantine flag issue. To fix:

1. Open **Terminal** (found in Applications > Utilities)
2. Type the following command and press Enter:
   ```bash
   xattr -cr "/Applications/Contact Sheet Generator.app"
   ```
3. Try opening the app again

### App won't start or crashes

- Make sure you're running macOS 10.15 or later
- Try restarting your Mac
- Re-download the DMG file and reinstall

### DNG files load slowly

Check if exiftool is installed:
```bash
which exiftool
```

If it returns nothing, install it:
```bash
brew install exiftool
```

Then restart the app.

### Some images are skipped

The app will show a warning message listing which files couldn't be loaded. Common causes:
- Corrupted files
- Unsupported file formats
- DNG files without embedded previews (install exiftool to help)

Check the console output (View → Toggle Developer Tools) for detailed error messages.

## Uninstalling

To remove Contact Sheet Generator:

1. Open your Applications folder
2. Drag "Contact Sheet Generator" to the Trash
3. Empty the Trash

## Support

For more information:
- See `USAGE.md` for detailed usage instructions
- See `docs/features/DNG_SUPPORT.md` for DNG/RAW file support details
- Check the changelog (Help → View Changelog in the app) for version history

---

**Current Version:** 3.2.1

Enjoy using Contact Sheet Generator!

