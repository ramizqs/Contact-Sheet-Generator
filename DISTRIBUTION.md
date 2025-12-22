# Distribution Guide

## Building the DMG Installer

To create a DMG installer that you can distribute to others:

### 1. Build the Application

Run the build command:

```bash
npm run build
```

This will create a universal DMG (works on both Intel and Apple Silicon Macs) in the `dist` folder.

### 2. Locate the DMG File

After building, you'll find the DMG file at:
```
dist/Contact Sheet Generator-{version}.dmg
```

### 3. Distribute the DMG

You can now share this DMG file with others via:
- Email
- File sharing services (Dropbox, Google Drive, etc.)
- USB drive
- Your own website

## Installation Instructions for Recipients

Send these instructions to your users:

1. **Download** the DMG file
2. **Double-click** the DMG file to mount it
3. **Drag** the "Contact Sheet Generator" app to the Applications folder
4. **Open** the app from your Applications folder
5. On first launch, if you see a security warning:
   - Go to **System Settings** > **Privacy & Security**
   - Scroll down and click **Open Anyway** next to the Contact Sheet Generator warning
   - Alternatively, right-click the app and select **Open**, then click **Open** in the dialog

## Code Signing (Optional but Recommended)

For a smoother installation experience without security warnings, you should sign the app with an Apple Developer certificate:

### Prerequisites
- Apple Developer account ($99/year)
- Developer ID Application certificate installed on your Mac

### Signing the App

1. Get your Developer ID:
```bash
security find-identity -v -p codesigning
```

2. Update `package.json` to add your signing identity:
```json
"mac": {
  "identity": "Developer ID Application: Your Name (TEAM_ID)"
}
```

3. Build again:
```bash
npm run build
```

The app will now be signed and notarized, allowing users to install it without security warnings.

## Notarization (For Distribution Outside Mac App Store)

To distribute without security warnings, you need to notarize the app:

1. Add to your `package.json`:
```json
"mac": {
  "identity": "Developer ID Application: Your Name (TEAM_ID)"
},
"afterSign": "scripts/notarize.js"
```

2. Create a notarization script with your Apple ID credentials

3. Rebuild the app

For detailed notarization instructions, see: https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/

## Building for Specific Architectures

If you want to build for only Apple Silicon or Intel:

### Apple Silicon only:
```bash
electron-builder --mac --arm64
```

### Intel only:
```bash
electron-builder --mac --x64
```

### Both (Universal):
```bash
npm run build
```
(This is the default and recommended option)

## Troubleshooting

### Users can't open the app due to security restrictions

If users see "Contact Sheet Generator can't be opened because it is from an unidentified developer":

1. Right-click (or Control-click) the app
2. Select **Open**
3. Click **Open** in the dialog

This only needs to be done once. After that, the app can be opened normally.

### App is damaged and can't be opened

This can happen with unsigned apps. Users can fix this by running in Terminal:
```bash
xattr -cr "/Applications/Contact Sheet Generator.app"
```

Then try opening the app again.

