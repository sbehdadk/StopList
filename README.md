# StopList - Anti-Todo List App

The first stop-doing list app. Remember what you shouldn't do.

## 🚀 Quick Start

```bash
# View all available commands
make help

# Build APK (auto-installs dependencies)
make build

# Download APK after build
make download

# Or do both
make quick
```

**Note:** `make build` automatically checks and installs dependencies - just run it!

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

## 🔧 Fixed Issues

- ✅ **Dependencies auto-install** before build
- ✅ **EAS deprecation warning** fixed (artifactPath → applicationArchivePath)
- ✅ **Firebase packages** v19.2.2 compatible with RN 0.74.5
- ✅ **AdMob** v13.0.0 properly installed
- ✅ **Makefile error handling** improved
- ✅ **One command builds** - everything automated

## 💰 Monetization

- **AdMob**: Banner ads integrated, ready for your App ID
- **Works outside Play Store**: Yes! AdMob works with direct APK distribution

## 🐛 Bug Reports

Bug report button in app sends email to: sinova.stoplist@gmail.com

## 📊 Version

Current version: `1.0.0`

Check with: `make version`
