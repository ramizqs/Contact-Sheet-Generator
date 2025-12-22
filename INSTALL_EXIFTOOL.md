# Quick Install: exiftool

## Install exiftool (Required for Color Profile Support)

Open Terminal and run:

```bash
brew install exiftool
```

If you don't have Homebrew installed, first install it:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Verify Installation

```bash
which exiftool
# Should show: /opt/homebrew/bin/exiftool or /usr/local/bin/exiftool

exiftool -ver
# Should show version number
```

## After Installation

1. Restart Contact Sheet Generator
2. Open DevTools (View → Toggle Developer Tools)
3. Look for this message in Console:
   ```
   ✓ exiftool detected - Will extract embedded DNG previews (respects color profiles)
   ```

## Test with Your B&W DNGs

Process a folder with your black and white DNGs. You should now see them in B&W on the contact sheet, just like in Finder!

## Console Output to Expect

```
Loading RAW file: IMG_1234.DNG
  🔍 Extracting embedded preview: IMG_1234.DNG
  ✓ Successfully extracted preview: IMG_1234.DNG (1024KB)
     Preview respects applied color profiles (e.g., B&W rendering)
  ✓ Using embedded preview (respects color profile)
```

That's it! Your DNGs will now display with their correct color profiles.

