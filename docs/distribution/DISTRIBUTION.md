# Distribution Guide

## Building the DMG Installer

To create a DMG installer that you can distribute to others:

### 1. Build the Application

Run the build command:

```bash
npm run build
```

This will create a universal DMG (works on both Intel and Apple Silicon Macs) in the `dist` folder.

### Available Build Commands

```bash
npm run build              # Universal binary (recommended)
npm run build:universal    # Same as above
npm run build:arm64        # Apple Silicon only
npm run build:x64          # Intel only
```

### 2. Locate the DMG File

After building, you'll find the DMG file at:
```
dist/Contact Sheet Generator-{version}-universal.dmg
```

The file will be approximately 185 MB in size.

### 3. Test the DMG

Before distributing, test the DMG yourself:

1. Mount the DMG by double-clicking it
2. Drag the app to Applications
3. Open it and verify everything works
4. Test the security bypass instructions (right-click > Open)
5. Test with sample images to ensure functionality

## Distribution Methods

You can share the DMG file with others via:

- **Email** (if under attachment limits)
- **File sharing services:**
  - Google Drive
  - Dropbox
  - OneDrive
  - WeTransfer
- **USB drive**
- **Your own website/server**

## Installation Instructions for End Users

Provide these instructions to your users:

1. **Download** the DMG file
2. **Double-click** the DMG file to mount it
3. **Drag** the "Contact Sheet Generator" app to the Applications folder
4. **Open** the app from your Applications folder
5. **On first launch**, if you see a security warning:
   - Go to **System Settings** > **Privacy & Security**
   - Scroll down and click **Open Anyway** next to the Contact Sheet Generator warning
   - Alternatively, right-click the app and select **Open**, then click **Open** in the dialog

## What's Included

The distributed app includes:

✅ **Universal binary** - Works on both Intel and Apple Silicon Macs  
✅ **Embedded font** - Kode Mono font is built-in, no installation required  
✅ **Self-contained** - All dependencies included  
✅ **Automatic tool detection** - Finds exiftool and sips if installed  
✅ **Professional output** - 2K, 4K, 6K, and 8K resolution options

## Optional: Recommend exiftool to Users

For users who work with DNG/RAW files, recommend they install exiftool:

```bash
brew install exiftool
```

This provides:
- Faster DNG loading
- Correct color profile preservation
- Better RAW file support

## Code Signing (Optional but Recommended)

For a smoother installation experience without security warnings, you should sign the app with an Apple Developer certificate.

### Prerequisites

- Apple Developer account ($99/year)
- Developer ID Application certificate installed on your Mac

### Getting Your Developer ID

```bash
security find-identity -v -p codesigning
```

### Update package.json

Add your signing identity to `package.json`:

```json
"build": {
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)"
  }
}
```

### Build with Signing

```bash
npm run build
```

The app will now be signed, allowing users to install it without security warnings.

## Notarization (For Distribution Outside Mac App Store)

To distribute without security warnings, you need to notarize the app with Apple.

### Setup

1. Add to your `package.json`:
```json
"build": {
  "mac": {
    "identity": "Developer ID Application: Your Name (TEAM_ID)",
    "hardenedRuntime": true,
    "entitlements": "build/entitlements.mac.plist",
    "entitlementsInherit": "build/entitlements.mac.plist"
  },
  "afterSign": "scripts/notarize.js"
}
```

2. Create a notarization script with your Apple ID credentials
3. Rebuild the app

For detailed notarization instructions, see:
- https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/
- https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution

## Troubleshooting

### Users can't open the app due to security restrictions

**Error:** "Contact Sheet Generator can't be opened because it is from an unidentified developer"

**Solution (for unsigned apps):**
1. Right-click (or Control-click) the app
2. Select **Open**
3. Click **Open** in the dialog

This only needs to be done once.

### "App is damaged and can't be opened"

This can happen with unsigned apps. Users can fix this by running in Terminal:

```bash
xattr -cr "/Applications/Contact Sheet Generator.app"
```

Then try opening the app again.

### Build fails with signing errors

- Verify your Developer ID certificate is installed
- Check that the identity in `package.json` matches your certificate
- Ensure Xcode command-line tools are installed: `xcode-select --install`

### DMG is too large

The DMG is approximately 185 MB due to:
- Universal binary (both Intel and Apple Silicon)
- Embedded Electron framework
- Embedded font
- Bundled exiftool (v3.2.1+)

This is normal and expected for an Electron app.

## Distribution Checklist

Before distributing to users:

- [ ] Build the universal DMG
- [ ] Test the DMG on your Mac
- [ ] Test on both Intel and Apple Silicon Macs (if possible)
- [ ] Verify the app icon appears correctly
- [ ] Test contact sheet generation with sample images
- [ ] Test with DNG/RAW files (if applicable)
- [ ] Prepare installation instructions
- [ ] Note any known issues or limitations
- [ ] Decide on distribution method (file sharing, website, etc.)
- [ ] Consider code signing for better user experience

## Version History in Distribution

Each release should include:
- Updated version number in `package.json`
- Updated `CHANGELOG.md` with changes
- Updated version display in the app (Help → About)

## Summary

**Quick Distribution Steps:**

1. ✅ Build: `npm run build`
2. ✅ Test: Open and verify the DMG
3. ✅ Share: Upload to file sharing service or your website
4. ✅ Document: Send installation instructions to users

**For Professional Distribution:**

1. ✅ Get Apple Developer account
2. ✅ Add code signing
3. ✅ Add notarization
4. ✅ Build and distribute

The app is self-contained and ready to share. Users will have the best experience if they also install exiftool for DNG/RAW support, but it works perfectly with standard image formats out of the box.

