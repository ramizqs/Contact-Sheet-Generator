# Bundling exiftool with the App (Optional)

## Overview

To make the app fully self-contained with optimal DNG performance, you can bundle exiftool directly in the app bundle. Users won't need to install anything.

## Steps

### 1. Download exiftool

```bash
# Download the macOS standalone version
cd assets
curl -O https://exiftool.org/Image-ExifTool-12.70.tar.gz
tar -xzf Image-ExifTool-12.70.tar.gz
mv Image-ExifTool-12.70/exiftool ./exiftool
chmod +x ./exiftool
rm -rf Image-ExifTool-12.70*
```

### 2. Update package.json

Ensure exiftool is included in the build:

```json
"build": {
  "files": [
    "main.js",
    "preload.js",
    "renderer/**/*",
    "services/**/*",
    "utils/**/*",
    "assets/**/*"  // This already includes assets/exiftool
  ]
}
```

### 3. Modify rawProcessor.js

Update the path search to check the app bundle first:

```javascript
// Add at the top of findCommand() function
async function findCommand(command) {
  // FIRST: Check if bundled with the app
  if (command === 'exiftool') {
    const { app } = require('electron');
    const fsSync = require('fs');
    
    let bundledPath;
    if (app.isPackaged) {
      // In packaged app, check Resources
      bundledPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'assets', 'exiftool');
    } else {
      // In dev mode, check assets
      bundledPath = path.join(__dirname, '..', 'assets', 'exiftool');
    }
    
    if (fsSync.existsSync(bundledPath)) {
      console.log(`✓ Using bundled ${command} at: ${bundledPath}`);
      return bundledPath;
    }
  }
  
  // THEN: Try system-installed version
  // ... rest of existing code
}
```

### 4. Code Signing Considerations

Since exiftool is an executable, you may need to:

1. **Sign it separately**:
   ```bash
   codesign --force --sign "Developer ID Application: Your Name" assets/exiftool
   ```

2. **Or** add to entitlements if unsigned:
   ```xml
   <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
   <true/>
   ```

### 5. Test

```bash
npm run build:universal
# Install and test - exiftool should work without installation
```

## Pros & Cons

### ✅ Pros
- **Zero setup** - app works at full speed immediately
- **Consistent behavior** - same performance for all users
- **Portable** - no external dependencies

### ❌ Cons
- **App size** increases by ~1MB
- **Maintenance** - need to update bundled exiftool occasionally
- **Code signing complexity** - may need to sign the binary
- **License** - exiftool is Perl Artistic/GPL (check compatibility)

## Alternative: Keep it Simple

**Recommended approach**: Just document that users should install exiftool for best performance. The app will work fine with just `sips` (built into macOS), it'll just be slightly slower for DNGs.

Most photography apps (Lightroom, Capture One, etc.) have external dependencies. Users who work with RAW files usually have these tools installed already.

