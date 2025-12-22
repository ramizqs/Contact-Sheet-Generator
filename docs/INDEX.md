# Documentation Index

Welcome to the Contact Sheet Generator documentation! This guide will help you find the information you need.

## 📖 Quick Start

New to Contact Sheet Generator? Start here:

- **[README.md](../README.md)** - Project overview and quick introduction
- **[Installation Guide](user/INSTALLATION.md)** - How to install and set up the app
- **[Quick Start Guide](user/QUICKSTART.md)** - Get started in 5 minutes
- **[Usage Guide](user/USAGE.md)** - Detailed usage instructions

## 👥 User Documentation

Everything end users need to know:

### Installation & Setup
- **[Installation Guide](user/INSTALLATION.md)** - Complete installation instructions
  - System requirements
  - First launch security setup
  - Optional exiftool installation for DNG support
  - Troubleshooting

### Using the App
- **[Quick Start Guide](user/QUICKSTART.md)** - Fast introduction
- **[Usage Guide](user/USAGE.md)** - Detailed feature explanations
  - How to create contact sheets
  - Metadata fields
  - Resolution options
  - Output formats

## 🔧 Developer Documentation

For developers building, modifying, or distributing the app:

### Building & Development
- **[Architecture](../ARCHITECTURE.md)** - Technical architecture overview
- **[Quick Build Guide](developer/QUICK_BUILD_GUIDE_v3.2.1.md)** - Build instructions
- **[Testing Guide](developer/TESTING.md)** - How to test the application

### Advanced Topics
- **[Bundling exiftool](developer/BUNDLING_EXIFTOOL.md)** - Bundling exiftool with the app
- **[Installing exiftool](developer/INSTALL_EXIFTOOL.md)** - exiftool setup for development

## 📦 Distribution

For those distributing the app to others:

- **[Distribution Guide](distribution/DISTRIBUTION.md)** - Complete distribution instructions
  - Building DMG files
  - Distribution methods
  - Code signing
  - Notarization
  - Troubleshooting
- **[DMG Creation](distribution/README_DMG.md)** - DMG-specific documentation

## ✨ Features

Detailed documentation on specific features:

- **[DNG & RAW Support](features/DNG_SUPPORT.md)** - Comprehensive guide to DNG/RAW file support
  - Supported RAW formats
  - How RAW processing works
  - Installing and using exiftool
  - Troubleshooting DNG issues
  - Best practices for RAW workflows

## 📝 Version History & Releases

Historical documentation and release notes:

- **[CHANGELOG.md](../CHANGELOG.md)** - Detailed changelog for all versions
- **[Version 3.2.1](releases/VERSION_3.2.1_SELF_CONTAINED.md)** - Self-contained build
- **[Version 3.2.0](releases/VERSION_3.2.0_BUILD.md)** - Build improvements
- **[Version 3.1.0](releases/VERSION_3.1.0_RAW_SUPPORT.md)** - RAW support introduction
- **[Version 3.0.0](releases/VERSION_3.0.0_RELEASE.md)** - Major release
- **[Version 2.0.0 Release](releases/VERSION_2.0.0_RELEASE.md)** - Resolution options
- **[Version 2.0.0 Complete](releases/VERSION_2.0.0_COMPLETE.md)** - Full v2.0.0 notes
- **[Version 1.1.0](releases/VERSION_1.1.0_RELEASE.md)** - Icon and font updates
- **[What's New in 2.0.0](releases/WHATS_NEW_2.0.0.md)** - Feature highlights

## 🗂️ Documentation Structure

```
docs/
├── INDEX.md (this file)
├── user/                    # End user documentation
│   ├── INSTALLATION.md      # Installation instructions
│   ├── QUICKSTART.md        # Quick start guide
│   └── USAGE.md             # Detailed usage guide
├── developer/               # Developer documentation
│   ├── BUNDLING_EXIFTOOL.md
│   ├── INSTALL_EXIFTOOL.md
│   ├── QUICK_BUILD_GUIDE_v3.2.1.md
│   └── TESTING.md
├── distribution/            # Distribution & release docs
│   ├── DISTRIBUTION.md      # Distribution guide
│   └── README_DMG.md        # DMG creation
├── features/                # Feature-specific documentation
│   └── DNG_SUPPORT.md       # DNG/RAW file support
└── releases/                # Version release notes
    ├── VERSION_3.2.1_SELF_CONTAINED.md
    ├── VERSION_3.2.0_BUILD.md
    ├── VERSION_3.1.0_RAW_SUPPORT.md
    ├── VERSION_3.0.0_RELEASE.md
    ├── VERSION_2.0.0_RELEASE.md
    ├── VERSION_2.0.0_COMPLETE.md
    ├── VERSION_1.1.0_RELEASE.md
    └── WHATS_NEW_2.0.0.md
```

## 🔍 Finding What You Need

### I want to...

- **Install the app** → [Installation Guide](user/INSTALLATION.md)
- **Learn how to use it** → [Quick Start](user/QUICKSTART.md) or [Usage Guide](user/USAGE.md)
- **Work with DNG/RAW files** → [DNG Support](features/DNG_SUPPORT.md)
- **Build the app from source** → [Quick Build Guide](developer/QUICK_BUILD_GUIDE_v3.2.1.md)
- **Distribute the app to others** → [Distribution Guide](distribution/DISTRIBUTION.md)
- **Understand the architecture** → [Architecture](../ARCHITECTURE.md)
- **See what changed in each version** → [CHANGELOG](../CHANGELOG.md)
- **Test the application** → [Testing Guide](developer/TESTING.md)

## 🆘 Getting Help

### Common Issues

1. **Security warning on first launch**
   - See [Installation Guide - First Launch Security Notice](user/INSTALLATION.md#first-launch-security-notice)

2. **DNG files not loading or loading slowly**
   - See [DNG Support Guide](features/DNG_SUPPORT.md)
   - Install exiftool for best results

3. **Build or distribution issues**
   - See [Distribution Guide - Troubleshooting](distribution/DISTRIBUTION.md#troubleshooting)

4. **App won't start**
   - See [Installation Guide - Troubleshooting](user/INSTALLATION.md#troubleshooting)

## 📚 Additional Resources

- **Root Level Files:**
  - [README.md](../README.md) - Project overview
  - [ARCHITECTURE.md](../ARCHITECTURE.md) - Technical architecture
  - [CHANGELOG.md](../CHANGELOG.md) - Complete version history

---

**Current Version:** 3.2.1

Last updated: December 2025

