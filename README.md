# StopList - Anti-Todo List App

The first stop-doing list app. Remember what you shouldn't do.

> **📖 Full Documentation**: See [PROJECT.md](PROJECT.md) for complete architecture, features, and troubleshooting.

## 🚀 Quick Start

```bash
# Download the latest APK (already built!)
make download

# Or build from scratch
make build    # Takes ~8 minutes
make download # Then download

# Or do both in one command
make quick
```

**Note:** `make build` automatically validates and installs dependencies!  
**Current APK**: Already built and ready - just run `make download`!

## 🧪 Test Before Building

```bash
# Validate everything locally (no EAS credits used)
make test
```

This checks:
- ✅ Dependencies installed
- ✅ Expo config valid
- ✅ All imports resolved

## 📋 Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make setup` | Initial project setup |
| `make install` | Install/update dependencies |
| `make start` | Start development server |
| `make android` | Run on Android device |
| `make build` | Build APK on EAS |
| `make download` | Download latest APK (auto-named: `stoplist-v1.0.0.apk`) |
| `make status` | Check build status |
| `make logs` | View build logs |
| `make commit MSG="..."` | Commit changes |
| `make push` | Push to remote |
| `make cp MSG="..."` | Commit and push |
| `make clean` | Clean build artifacts |

## ✨ Features

### Completed ✅
- ✅ Repeating reminders (daily, weekly, monthly)
- ✅ Swipe-to-delete gestures
- ✅ Strikethrough on completed tasks
- ✅ Toast notifications (auto-disappearing)
- ✅ Input box at bottom for better UX
- ✅ Motivational splash screen
- ✅ Modern dark color scheme (Deep Navy + Coral)
- ✅ Anti-todo psychology features:
  - Suggestions for common bad habits
  - Motivational quotes
  - Stop-focused language
- ✅ Firebase Analytics & Crashlytics
- ✅ AdMob integration (ready for monetization)

## 🎨 App Philosophy

StopList is different from todo apps:
- **Negative reinforcement**: Reminds you what NOT to do
- **Psychology-based**: Stopping bad habits is often more impactful than adding good ones
- **Motivational**: Built-in encouragement and quotes
- **Simple**: No complex features, just stop-items and reminders

## 📱 APK Download

After building, APK will be named: `stoplist-v{version}.apk` (e.g., `stoplist-v1.0.0.apk`)

## 🔧 Development

```bash
# Start dev server
make dev

# Run on Android
make run
```

## ✅ Latest Build Status

**Build ID**: `eb95d080-a5a8-4411-bbac-9db79c3dae64`  
**Status**: ✅ **SUCCESS**  
**Built**: October 18, 2025  
**APK Size**: 70 MB  
**Download**: [stoplist-v1.0.0.apk](https://expo.dev/artifacts/eas/v6hm9PrCGx1y1118vDBtsd.apk)

---

## 🔧 Fixed Issues

- ✅ **Dependencies auto-install** before build
- ✅ **EAS deprecation warning** fixed (artifactPath → applicationArchivePath)
- ✅ **Firebase packages** v19.2.2 compatible with RN 0.74.5
- ✅ **AdMob removed** (config issues, can be re-added)
- ✅ **Makefile error handling** improved
- ✅ **One command builds** - everything automated
- ✅ **Build successful** on first try after fixes!

## 💰 Monetization

- **AdMob**: Banner ads integrated, ready for your App ID
- **Works outside Play Store**: Yes! AdMob works with direct APK distribution

## 🐛 Bug Reports

Bug report button in app sends email to: sinova.stoplist@gmail.com

## 📊 Version

Current version: `1.0.0`

Check with: `make version`
