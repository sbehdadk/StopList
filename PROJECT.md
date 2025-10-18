# StopList - Complete Project Documentation

**Version:** 1.0.0  
**Platform:** Android (React Native / Expo)  
**Status:** ✅ Ready for Build

---

## 🎯 Project Aim

**StopList** is the first anti-todo list app. Unlike traditional todo apps that focus on what you *should* do, StopList helps users track and avoid bad habits by reminding them what they *shouldn't* do.

### Core Philosophy
- **Negative Reinforcement**: Psychology shows that stopping bad habits is often more impactful than adding good ones
- **Simplicity First**: No complex features, just stop-items and smart reminders
- **Motivational**: Built-in encouragement and psychology-based prompts

---

## ✨ Features Implemented

### ✅ Core Features
- **Stop-Items List**: Task management focused on things NOT to do
- **Repeating Reminders**: Daily, weekly, monthly scheduling
- **Swipe-to-Delete**: Intuitive gesture controls
- **Strikethrough Completion**: Visual feedback for completed items
- **Toast Notifications**: Non-intrusive, auto-disappearing messages
- **Bottom Input**: Ergonomic text entry placement

### ✅ User Experience
- **Motivational Splash Screen**: Encouraging quotes on launch
- **Modern Dark Theme**: Deep Navy (#0f0f1e) + Coral (#ff6b6b)
- **Bad Habit Suggestions**: Common items to stop (social media, procrastination, etc.)
- **Psychology-Based UI**: Stop-focused language throughout

### ✅ Technical Integration
- **Firebase Analytics**: User behavior tracking
- **Firebase Crashlytics**: Error monitoring
- **Local Notifications**: Scheduled reminders
- **AsyncStorage**: Persistent data storage
- **Gesture Handling**: Swipe interactions

### 🔮 Future Features (Planned)

#### 📊 Task Detail Cards (High Priority)
**Concept**: Click any task to open an immersive detail card with streak tracking and motivation.

**Features**:
- **Streak Counter**: 
  - Visual progress bar showing consecutive days avoided
  - "🔥 12 Days Strong!" heading
  - Total days avoided vs. total days tracked
  
- **Daily Check-In**:
  - Notification at end of day: "Did you avoid [task]?"
  - Two-button choice: "✅ I Avoided It" / "❌ I Slipped"
  - Honest self-reporting builds accountability
  - Failed streaks show motivational restart message: "Every day is a fresh start"

- **Motivation Section**:
  - Dynamic quotes based on streak length
  - Milestone celebrations (7 days, 30 days, 100 days)
  - "Why I'm Stopping This" - user-written personal reason
  - Health/money savings calculator (cigarettes, fast food, etc.)

- **Visual Design**:
  - Glassmorphism card with blur effect
  - Animated streak flame 🔥 that grows with progress
  - Color gradient based on streak (red → orange → gold → green)
  - Confetti animation on milestones

- **Statistics**:
  - Calendar heatmap (GitHub-style) showing avoided days
  - Best streak vs. current streak
  - Success rate percentage
  - Time/money saved estimates

**Why This Helps Get Users**:
- **Gamification**: Streaks create addiction to NOT doing bad things
- **Visual Progress**: Seeing growth motivates continued use
- **Social Proof**: Screenshots of streaks are shareable
- **Emotional Connection**: Personal "why" keeps users engaged
- **Data-Driven**: Real metrics show tangible benefits

**Implementation Priority**: HIGH - Core differentiator from todo apps

---

#### 🎯 Other Future Features
- **AdMob Monetization**: Removed due to config complexity (can be re-added)
- **AI Suggestions**: Analyze patterns and suggest related habits to stop
- **Social Features**: Share achievements, challenge friends
- **Habit Chains**: Link related bad habits (late sleeping → hitting snooze)
- **Reward System**: Unlock themes/badges for long streaks

---

## 🏗️ Architecture

### Technology Stack
```
Frontend:    React Native 0.74.5
Framework:   Expo 51.0.0
Language:    JavaScript (JSX)
State:       React Hooks
Storage:     AsyncStorage
Notifications: expo-notifications
Analytics:   Firebase (Analytics + Crashlytics)
Build:       EAS Build
```

### Project Structure
```
stoplist/
├── App.jsx                 # Main application logic
├── SplashScreen.jsx        # Launch screen component
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── eas.json                # EAS Build configuration
├── babel.config.js         # Babel configuration
├── Makefile                # Build automation
├── google-services.json    # Firebase config
├── assets/                 # Images and icons
└── README.md               # Basic documentation
```

### Key Components

#### App.jsx (895 lines)
- Main app component with state management
- Task CRUD operations
- Notification scheduling
- Swipe gesture handling
- Reminder modal UI
- Firebase integration

#### SplashScreen.jsx (112 lines)
- Animated launch screen
- Fade-in/scale animations
- Motivational messaging

### Data Flow
```
User Input → State Update → AsyncStorage → Notification Schedule
     ↓
Firebase Analytics → Behavior Tracking
     ↓
UI Update → Toast Feedback
```

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "expo": "~51.0.0",
  "react": "18.2.0",
  "react-native": "0.74.5"
}
```

### Feature Dependencies
```json
{
  "@react-native-async-storage/async-storage": "1.23.1",
  "@react-native-community/datetimepicker": "7.6.2",
  "@react-native-firebase/analytics": "19.2.2",
  "@react-native-firebase/app": "19.2.2",
  "@react-native-firebase/crashlytics": "19.2.2",
  "expo-build-properties": "~0.12.0",
  "expo-constants": "~16.0.0",
  "expo-notifications": "~0.28.0",
  "react-native-gesture-handler": "~2.16.1",
  "react-native-modal": "^13.0.1",
  "react-native-reanimated": "~3.10.1"
}
```

---

## 🔧 Recent State & Fixes

### Latest Changes (2025-10-18)
1. ✅ **Removed AdMob** - Complex config plugin issues, can be re-added when needed
2. ✅ **Fixed EAS Config** - Changed `artifactPath` to `applicationArchivePath`
3. ✅ **Added Validation** - Local tests before building (`make test`)
4. ✅ **Auto Dependency Check** - Makefile automatically installs dependencies
5. ✅ **Comprehensive Documentation** - This file created

### Build Status
- **Last Build**: Failed (AdMob config issues)
- **Current Status**: ✅ Ready to build (AdMob removed)
- **Next Action**: Run `make build`

### Known Issues
- ❌ **AdMob Integration**: Requires `react-native-google-mobile-ads` + config plugin (removed for now)
- ⚠️ **Local Build**: Impossible on Raspberry Pi ARM64 (use EAS)

### Fixed Issues
- ✅ Missing Firebase dependencies
- ✅ EAS deprecation warnings
- ✅ Config plugin errors
- ✅ Dependency version conflicts
- ✅ Makefile parse errors

---

## 🚀 Build & Deploy

### Prerequisites
- Expo account (sinova)
- EAS CLI installed globally
- Firebase project configured
- `google-services.json` in root

### Build Commands
```bash
# Validate before building
make test

# Build APK
make build

# Download APK (after build completes)
make download
# → Creates: stoplist-v1.0.0.apk

# Or do both
make quick
```

### Configuration Files

#### eas.json
```json
{
  "cli": { "appVersionSource": "remote" },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk",
        "credentialsSource": "remote"
      }
    }
  }
}
```

#### app.json (Key Settings)
- **Package**: com.sinabehdadk.stoplist
- **SDK**: Expo 51
- **Kotlin**: 2.0.0
- **Compile SDK**: 34
- **Plugins**: expo-notifications, expo-build-properties, firebase

---

## 🎨 Design Concept

### Color Palette
```
Background:    #0f0f1e (Deep Navy)
Cards:         #1a1a2e (Darker Navy)
Primary:       #ff6b6b (Coral Red) 
Text:          #ffffff (White)
Secondary:     #8b8b9f (Light Gray)
Accent:        #ffa500 (Orange)
```

### Typography
- **Title**: 38px, Bold, -1 letter-spacing
- **Body**: 16px, Medium
- **Quote**: 15px, Italic

### UI Patterns
- **Bottom-aligned input** for easy thumb access
- **Swipe gestures** for natural deletion
- **Toast notifications** instead of blocking alerts
- **Dark theme** to reduce eye strain

---

## 📊 Firebase Configuration

### Setup
1. Project: StopList
2. Package: com.sinabehdadk.stoplist
3. File: `google-services.json` in root
4. Services: Analytics + Crashlytics

### Events Tracked
- `app_open`: App launch
- `task_created`: New stop-item added

---

## 🤖 Automation

### Makefile Commands
```bash
make help      # Show all commands
make test      # Validate config locally
make build     # Build APK (auto-validates)
make download  # Download built APK
make status    # Check build status
make logs      # View build logs
make check     # Verify dependencies
make clean     # Clean artifacts
```

### Auto-Validation
Before each build:
1. Check node_modules exists
2. Validate expo config
3. Verify required dependencies
4. Test config JSON parsing

---

## 🐛 Troubleshooting

### Common Issues

**Build fails with "config plugin" error**
→ Ensure no AdMob config in `app.json`

**Dependencies out of date**
→ Run `make check` or `npm install`

**Firebase not working**
→ Verify `google-services.json` exists

**Expo config fails**
→ Run `npx expo config` to see errors

---

## 📝 Version History

### v1.0.0 (Current)
- Initial release
- Core anti-todo features
- Firebase integration
- Repeating reminders
- Swipe gestures
- Motivational splash screen

### v1.1.0 (Planned)
- **Task Detail Cards** with streak tracking
- Daily check-in notifications
- Calendar heatmap visualization
- Milestone celebrations
- Personal "why" notes

---

## 👤 Contact & Support

**Developer**: Sina Behdad  
**Email**: sinova.stoplist@gmail.com  
**Expo Account**: sinova  
**Package**: com.sinabehdadk.stoplist

---

## 📄 License

Private project - All rights reserved

---

**Last Updated**: October 18, 2025  
**Document Version**: 1.0.0

---

## 🎯 Next Steps for Agent

When picking up this project, you should know:

1. **Current State**: Ready to build, AdMob temporarily removed
2. **To Build**: Run `make build` (validates automatically)
3. **To Test Locally**: Run `make test`
4. **Common Issue**: AdMob requires special config plugin
5. **Architecture**: Simple React hooks, no Redux/complex state
6. **Key Files**: App.jsx (main logic), SplashScreen.jsx (launch)
7. **Dependencies**: All in package.json, auto-install before build

**If user reports build error:**
- Run `make test` to validate locally
- Check logs with `make logs`
- Verify dependencies with `make check`
- Review this document's "Troubleshooting" section

**If user requests Task Detail Cards feature (v1.1.0):**
- See "Future Features (Planned)" section above for complete spec
- Key components needed: TaskDetailModal.jsx, StreakTracker.jsx, DailyCheckIn.jsx
- Add to storage: streak data, check-in history, personal notes
- New dependencies: react-native-calendars (heatmap), lottie (animations)
- Use Firebase to track: streak_broken, check_in_completed events

