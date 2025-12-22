# Contact Sheet Generator v2.0.0 - Installation Instructions

Thank you for downloading Contact Sheet Generator v2.0.0!

## Installation Steps

1. **Drag the Contact Sheet Generator icon** to the Applications folder icon shown in the DMG window

2. **Eject the DMG** by:
   - Right-clicking the mounted disk on your desktop and selecting "Eject"
   - Or dragging it to the Trash

3. **Launch the app** by:
   - Opening your Applications folder
   - Double-clicking "Contact Sheet Generator"

## First Launch Security Notice

On macOS, when you first open the app, you might see a security warning saying:

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

## System Requirements

- macOS 10.13 or later
- Works on both Intel and Apple Silicon (M1/M2/M3) Macs

## Using the App

Once opened:
1. Click "Select Folder" to choose a folder containing images
2. Fill in metadata fields (Roll #, Film Stock, ISO, Camera, Notes)
3. Choose your resolution (2K, 4K, 6K, or 8K)
4. Click "Generate Contact Sheet" to create your contact sheet
5. The output folder will open automatically when complete

### What's New in v2.0.0
- **Resolution Options:** Choose from 2K, 4K, 6K, or 8K output
- **Embedded Font:** Kode Mono displays perfectly everywhere
- **Professional Output:** Scalable for any print size
- **Known Issues:** See the info panel (ⓘ) for current limitations

## Troubleshooting

### "App is damaged and can't be opened"

If you see this message, it's likely a quarantine flag issue. To fix:

1. Open **Terminal** (found in Applications > Utilities)
2. Type the following command and press Enter:
   ```bash
   xattr -cr "/Applications/Contact Sheet Generator.app"
   ```
3. Try opening the app again

### App won't start or crashes

- Make sure you're running macOS 10.13 or later
- Try restarting your Mac
- Re-download the DMG file and reinstall

## Support

If you experience any issues, please contact the person or organization who provided you with this software.

## Uninstalling

To remove Contact Sheet Generator:
1. Open your Applications folder
2. Drag "Contact Sheet Generator" to the Trash
3. Empty the Trash

---

Enjoy using Contact Sheet Generator!

