# Contact Sheet Generator - Installation Guide

## Installation

1. Download the DMG file
2. Open it and drag **Contact Sheet Generator** to your Applications folder
3. Launch from Applications

## For Optimal DNG/RAW Performance (Recommended)

If you work with DNG or RAW files, install **exiftool** for instant preview loading:

```bash
# If you have Homebrew installed:
brew install exiftool

# If you don't have Homebrew, install it first:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### What's the difference?

| Tool | DNG Loading Speed | What it does |
|------|------------------|--------------|
| **exiftool** (recommended) | ⚡ Instant | Extracts embedded preview with color profiles intact |
| **sips** (built into macOS) | ✓ Fast | Converts RAW to JPEG on-the-fly |
| **Neither** | ⚠️ Slower | Falls back to Sharp's basic extraction |

### Do I need this?

- **✅ If you use DNG/RAW files frequently**: Yes, install exiftool for best experience
- **✅ If you want B&W DNGs to display correctly**: Yes, exiftool preserves color profiles
- **⏭️ If you only use JPG/PNG**: No, the app works perfectly out of the box

## System Requirements

- macOS 10.15 or later
- Apple Silicon (M1/M2/M3) or Intel processor

## Troubleshooting

### App won't open / "App is damaged"
```bash
xattr -cr /Applications/Contact\ Sheet\ Generator.app
```

### Slow DNG loading
Check if exiftool is installed:
```bash
which exiftool
```

If it returns nothing, install it:
```bash
brew install exiftool
```

## Support

For issues or questions, check the documentation included with the app.

---

**Version 3.2.1** - Includes automatic tool detection for optimal performance

