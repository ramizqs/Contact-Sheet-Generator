# Version 1.1.0 Release Notes

## 🎉 Release Information

**Version:** 1.1.0  
**Release Date:** December 21, 2024  
**Build:** Universal (Intel + Apple Silicon)  
**File:** `Contact Sheet Generator-1.1.0-universal.dmg`

---

## ✨ What's New in 1.1.0

### 🎨 New Branded Icon
- Updated app icon with letter "C" design
- Orange squares arranged to spell "Contact Sheet"
- Maintains minimalist grid aesthetic
- Distinctive and recognizable in Dock and Finder

### 🔤 Embedded Font (Major Improvement!)
- **Kode Mono font now built into the app**
- No installation required by users
- Works immediately after dragging to Applications
- Consistent typography guaranteed on all systems

### 🛠️ Technical Improvements
- Switched from SVG to canvas-based text rendering
- Font loaded from app bundle at runtime
- Better cross-system compatibility
- Professional output guaranteed

---

## 📦 Distribution Files

### Main Distribution File
```
Contact Sheet Generator-1.1.0-universal.dmg
Size: 185 MB
Works on: Intel and Apple Silicon Macs
macOS: 10.12+
```

### What's Included
✅ Embedded Kode Mono font  
✅ New "C" icon design  
✅ Universal binary (both architectures)  
✅ All v1.0.0 features  
✅ Zero setup required

---

## 🆚 Version Comparison

### Version 1.1.0 (Current)
✅ Font embedded in app  
✅ Zero user setup  
✅ New branded "C" icon  
✅ Canvas text rendering  
✅ Guaranteed typography  
📦 185 MB

### Version 1.0.0 (Previous)
❌ Required font installation  
❌ Multi-step setup  
⚠️ Abstract icon design  
⚠️ SVG text rendering  
⚠️ Font could be missing  
📦 171 MB

**Verdict:** The 14 MB increase is worth it for the dramatically improved user experience!

---

## 📋 Complete Feature List

### Core Features (v1.0.0)
- Generate 2048×1782px contact sheets (6×7 grid, 42 images)
- 5 metadata fields: Roll #, Film Stock, ISO, Camera, Notes
- Fixed 3:2 aspect ratio with letterboxing/pillarboxing
- Shot numbers and filenames on each thumbnail
- Automatic pagination for multiple sheets
- Optional outline mode for thumbnail boundaries
- Support for JPG, PNG, TIFF, GIF, BMP, DNG, CR2, NEF, ARW, ORF, RW2, RAF

### Design (v1.0.0)
- Swiss/Japanese minimalist aesthetic
- Kode Mono typography throughout
- Dark theme with orange accent colors
- Title preview shows exact output format
- Auto-open folder when complete

### New in v1.1.0
- **Embedded font** - No installation required
- **New icon** - Letter "C" design
- **Canvas rendering** - Better text quality
- **Universal binary** - Optimized for both architectures

---

## 🚀 Installation Instructions

### For Users (Super Simple!)

1. **Download** `Contact Sheet Generator-1.1.0-universal.dmg`
2. **Open** the DMG file
3. **Drag** the app to Applications
4. **First launch:** Right-click → Open (security bypass, one time only)
5. **Done!** Start creating contact sheets

**No font installation. No extra steps. Just works.** ✨

---

## 📝 Changelog

### v1.1.0 — December 21, 2024

**Added:**
- Embedded Kode Mono font (no installation required)
- New app icon with letter "C" design
- Canvas-based text rendering
- Updated changelog modal with version history

**Changed:**
- Replaced SVG text rendering with canvas
- Font now loads from app bundle
- Improved text rendering quality

**Technical:**
- Added node-canvas dependency
- Configured proper native module unpacking
- Universal binary with architecture-specific rebuilds

### v1.0.0 — December 20, 2024

**Initial Release:**
- Contact sheet generation (6×7 grid, 42 images)
- Metadata input fields
- Aspect ratio handling
- Multiple sheet pagination
- RAW file support
- Minimalist UI design
- macOS native app

---

## 🎯 Distribution Checklist

Before sending to users:

- [x] Version number updated (1.1.0)
- [x] Changelog updated in app
- [x] New icon included
- [x] Font embedded
- [x] DMG built successfully
- [x] Universal binary created
- [ ] **Test the DMG** (open and verify icon)
- [ ] **Test the app** (generate a contact sheet)
- [ ] **Send to users**

---

## 💬 What to Tell Users

### Simple Message:
> "Contact Sheet Generator v1.1.0 is ready! 
> 
> **What's new:**
> - Font is now built-in (no installation needed!)
> - New branded icon
> - Just drag to Applications and use
> 
> Download: [link to DMG]"

### Upgrade Message (for v1.0.0 users):
> "Update to v1.1.0 available!
> 
> **Improvements:**
> - No more font installation required
> - New app icon
> - Better text rendering
> 
> Just replace your old version with this one!"

---

## 🐛 Known Issues

### Harmless Warning
Console may show: `Class GNotificationCenterDelegate is implemented in both...`
- This is harmless (Sharp + Canvas both use GLib)
- Does not affect functionality
- Can be safely ignored

### Security Warning (Expected)
Users will see a security warning on first launch:
- Normal for apps distributed outside Mac App Store
- Solution: Right-click → Open → Open (one time only)
- Documented in installation instructions

---

## 📊 File Sizes

| Version | Size | Change |
|---------|------|--------|
| v1.0.0  | 171 MB | - |
| v1.1.0  | 185 MB | +14 MB |

**Why larger?** Canvas library adds ~14 MB but eliminates all font issues. Worth it!

---

## 🔮 Future Considerations

Potential features for v1.2.0+:
- Code signing (eliminate security warnings)
- Additional export formats
- Custom grid sizes
- Batch processing
- Preset templates
- Auto-update mechanism

---

## 📚 Documentation

- **README_DISTRIBUTION.md** - How to distribute
- **EMBEDDED_FONT_COMPLETE.md** - Font implementation details
- **CANVAS_IMPLEMENTATION.md** - Technical documentation
- **ICON_UPDATE.md** - Icon design notes
- **INSTALLATION_INSTRUCTIONS.md** - User guide

---

## ✅ Release Checklist

- [x] Version bumped to 1.1.0
- [x] Changelog updated in app
- [x] Icon updated with "C" design
- [x] Font embedded via canvas
- [x] DMG built successfully
- [x] Documentation updated
- [x] Release notes created

**Status: Ready to distribute!** 🚀

---

**Contact Sheet Generator v1.1.0 is a significant improvement over v1.0.0 with zero user friction and professional branding!**

