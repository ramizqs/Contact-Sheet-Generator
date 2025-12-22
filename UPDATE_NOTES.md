# Important Update Notes

## App Restart Required for Changes

**Key Point**: When you make code changes, the Electron app must be **restarted** to pick them up. Simply reloading with Cmd+R is not enough - the app caches the code when it starts.

### How to Restart the App

**Option 1**: Close and reopen
1. Quit the app (Cmd+Q)
2. Run `npm start` again in terminal

**Option 2**: Kill and restart via terminal
```bash
pkill -f "electron ."
npm start
```

The app has been **restarted automatically** with all your recent changes.

## Latest Changes Implemented

### 1. Shot Numbers + Filenames
**New Layout**: Each thumbnail now shows:
- **Left side**: Shot number (01, 02, 03, etc.) - left aligned
- **Right side**: Filename - right aligned
- Both use same gray color (#999999) and Kode Mono font

Example:
```
[      Thumbnail Image      ]
01                  0000734008.tif
```

### 2. All Previous Fixes Included
- ✅ Text alignment (8px padding)
- ✅ Larger title (22pt / 29px)
- ✅ Fixed dropdown chevron (no double arrows)
- ✅ Reordered metadata: Roll, Film, Aspect, Camera
- ✅ Arrow before "Select Folder", after "Generate"
- ✅ Horizontal checkboxes layout
- ✅ Show outline feature (now properly draws gray borders)

## Testing Your Changes

The app is now **running in terminal 7** with all updates:

1. **Look for the Electron window** (Cmd+Tab to switch)
2. **Select a folder** with images
3. **Fill in metadata** (Roll, Film, etc.)
4. **Optional**: Check "Show outline" to see borders
5. **Generate** contact sheets
6. **Verify output**:
   - Shot numbers on left (01, 02, 03...)
   - Filenames on right
   - 22pt gray title
   - Properly aligned text (not too far left)
   - Gray outline borders (if enabled)
   - All other refinements

## Current Feature Set

### UI
- Arrow before "Select Folder" button
- 4 metadata fields: Roll, Film, Aspect, Camera
- Aspect ratio dropdown: 3:2, 4:3, 16:9, 1:1, 5:4, 7:5
- Two checkboxes (horizontal): "Open when complete", "Show outline"
- Arrow after "Generate" button

### Contact Sheet Output
- 2048 × 1782 px
- 6 columns × 7 rows (42 images per sheet)
- 22pt gray title (#999999)
- Shot numbers (left) + Filenames (right)
- Optional 1px gray outline (#666666)
- Configurable aspect ratios with letterboxing
- Kode Mono font throughout

## Troubleshooting

### Changes not appearing?
- **Restart the app** - code changes require full restart
- Check terminal for errors
- Verify files saved correctly

### Outline not showing?
- Make sure checkbox is **checked** before generating
- Outline only appears when enabled
- Should be subtle gray 1px border

### Font looks wrong?
- Kode Mono must be installed system-wide
- See `INSTALL_FONT.md` for instructions
- Fallback: Courier New, monospace

## Next Steps

You're all set! The app has all your requested features and is ready to generate contact sheets with:
- Shot numbers and filenames
- Customizable aspect ratios
- Optional outlines
- Professional typography
- Minimalist design

Generate a test contact sheet to see all the changes in action! 🎉

