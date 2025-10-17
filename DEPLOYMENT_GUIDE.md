# 🚀 StopList - Complete Deployment Guide

## Prerequisites

✅ All features implemented  
✅ App tested locally  
✅ AdMob account created  
✅ Google Play / Apple Developer accounts ready  

Now let's deploy!

---

## Step 1: Initialize Expo Project

Your app is now Expo-ready! Let's configure it properly.

### 1.1 Login to Expo
```bash
npx expo login
```
Enter your credentials for the account: **sinabehdadk**

### 1.2 Link to Your Expo Account
```bash
# This will associate the project with your Expo account
npx expo whoami  # Verify you're logged in as sinabehdadk
```

### 1.3 Initialize EAS
```bash
cd /home/pi/projects/TodoCheckbox
eas init
```

This will:
- Create a project in your Expo account
- Generate a project ID
- Update your `app.json` with the project ID

### 1.4 Configure Project ID
After running `eas init`, you'll get a project ID. Update `app.json`:

```json
"extra": {
  "eas": {
    "projectId": "YOUR_ACTUAL_PROJECT_ID_HERE"
  }
}
```

---

## Step 2: Set Up AdMob

### 2.1 Create AdMob Account
1. Go to https://apps.admob.com/
2. Sign in with Google account
3. Complete setup

### 2.2 Create App in AdMob
1. Click "Apps" → "Add App"
2. Select "Android"
3. Enter name: **StopList**
4. Copy the **App ID**: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### 2.3 Create Ad Units
Create these 3 ad units in AdMob:

**1. Banner Ad**
- Type: Banner
- Name: StopList Banner
- Copy Ad Unit ID

**2. Interstitial Ad**
- Type: Interstitial
- Name: StopList Interstitial
- Copy Ad Unit ID

**3. Rewarded Ad** (for future use)
- Type: Rewarded
- Name: StopList Rewarded
- Copy Ad Unit ID

### 2.4 Update Configuration Files

**File: `app.json`**
```json
"plugins": [
  [
    "react-native-google-mobile-ads",
    {
      "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
      "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
    }
  ]
]
```

**File: `AdMobConfig.js`**
```javascript
const AD_UNIT_IDS = {
  banner: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  },
  interstitial: {
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX',
  },
  // ... rest
};
```

### 2.5 Repeat for iOS
1. In AdMob, click "Add App" again
2. Select "iOS"
3. Create same ad units
4. Update configuration with iOS IDs

---

## Step 3: Create Privacy Policy

**REQUIRED** for both stores!

### Option 1: Use Free Generator
1. Go to https://www.privacypolicies.com/
2. Fill in:
   - App name: StopList
   - Description: Task reminder app
   - Data collection: We use AdMob for advertisements
   - No user accounts
   - No data sharing
3. Generate policy
4. Copy the text

### Option 2: Host on GitHub Pages
```bash
# Create a simple privacy policy page
mkdir stoplist-privacy
cd stoplist-privacy
echo "<!DOCTYPE html>
<html>
<head>
  <title>StopList Privacy Policy</title>
  <style>
    body { max-width: 800px; margin: 50px auto; padding: 20px; font-family: Arial; }
    h1 { color: #ff3b30; }
  </style>
</head>
<body>
  <h1>StopList Privacy Policy</h1>
  <p>Last updated: $(date +%Y-%m-%d)</p>
  
  <h2>Information We Collect</h2>
  <p>StopList does not collect, store, or share any personal information. All your tasks and reminders are stored locally on your device.</p>
  
  <h2>Advertising</h2>
  <p>We use Google AdMob to display advertisements. AdMob may collect device information for ad personalization. You can opt out of personalized ads in your device settings.</p>
  
  <h2>Data Storage</h2>
  <p>All data is stored locally on your device. We do not have access to your data.</p>
  
  <h2>Contact Us</h2>
  <p>For questions, email: stoplist.app@gmail.com</p>
</body>
</html>" > index.html

# Push to GitHub
git init
git add index.html
git commit -m "Privacy policy"
git branch -M main
# Create repo on GitHub first, then:
git remote add origin https://github.com/yourusername/stoplist-privacy.git
git push -u origin main

# Enable GitHub Pages in repo settings
# Your privacy policy URL: https://yourusername.github.io/stoplist-privacy/
```

---

## Step 4: Build for Android

### 4.1 Configure Build
```bash
cd /home/pi/projects/TodoCheckbox
eas build:configure
```

Select:
- Platform: Android
- Build type: APK (for testing) or AAB (for store)

### 4.2 Build Production Release
```bash
# For Google Play Store (recommended)
eas build --platform android --profile production

# OR for direct APK download
eas build --platform android --profile preview
```

This will:
1. Upload your code to Expo servers
2. Build the app in the cloud
3. Provide download link when complete
4. Usually takes 10-20 minutes

### 4.3 Download Build
After build completes:
```bash
# Download URL will be shown in terminal
# Also visible at: https://expo.dev/accounts/sinabehdadk/projects/stoplist/builds
```

---

## Step 5: Submit to Google Play Store

### 5.1 Create Developer Account
1. Go to https://play.google.com/console/signup
2. Pay $25 one-time fee
3. Complete verification (1-2 days)

### 5.2 Create App in Console
1. Click "Create App"
2. Name: StopList
3. Default language: English (US)
4. App type: App
5. Free or paid: Free

### 5.3 Fill Out Store Listing

**App Details:**
- App name: StopList - Don't Do List
- Short description: (from APP_STORE_LISTING.md)
- Full description: (from APP_STORE_LISTING.md)
- App icon: Upload `assets/icon.png`
- Feature graphic: Create 1024x500 image with app name
- Screenshots: Upload 6-8 images (create from app)

**Categorization:**
- App category: Productivity
- Tags: Self-improvement, Habits

**Contact Details:**
- Email: stoplist.app@gmail.com
- Privacy policy URL: Your GitHub Pages URL

**Store Settings:**
- Countries: All countries (or select specific ones)

### 5.4 Content Rating
1. Click "Content Rating"
2. Fill questionnaire:
   - No violence
   - No sexual content
   - No inappropriate language
   - No gambling
3. Get "Everyone" rating

### 5.5 Upload App Bundle
```bash
# Option A: Upload manually
# Download AAB from Expo dashboard
# Upload to Google Play Console → Production → Create Release

# Option B: Use EAS Submit (automated)
eas submit --platform android

# Follow prompts to authenticate with Google
```

### 5.6 Review and Publish
1. Complete all required sections
2. Review summary
3. Send for review
4. Wait 1-3 days for approval

---

## Step 6: Build for iOS (Optional)

### 6.1 Requirements
- Apple Developer Account ($99/year)
- Mac computer (or use Expo's cloud build)

### 6.2 Configure iOS Build
```bash
eas build:configure --platform ios
```

### 6.3 Build for App Store
```bash
eas build --platform ios --profile production
```

### 6.4 Submit to App Store
```bash
eas submit --platform ios
```

You'll need:
- Apple ID
- App-specific password
- Team ID

Or upload manually via Xcode/Transporter.

---

## Step 7: Set Up Over-The-Air (OTA) Updates

### 7.1 Configure EAS Update
Already set up in your `eas.json`!

### 7.2 Publish Initial Update Channel
```bash
eas update:configure
eas update --branch production --message "Initial release"
```

### 7.3 How to Push Updates

**For Bug Fixes & Small Changes:**
```bash
# 1. Make your code changes
# 2. Test locally: npx expo start
# 3. Publish update:
eas update --branch production --message "Fix: [describe fix]"

# Users will get update on next app restart!
# NO app store review needed!
```

**Update Frequency:**
- Bug fixes: Push immediately
- Small features: Weekly
- Major changes: Requires new app store build

### 7.4 Monitor Updates
View update status:
```bash
# Dashboard
https://expo.dev/accounts/sinabehdadk/projects/stoplist/updates

# Or CLI
eas update:list --branch production
```

---

## Step 8: Post-Launch Monitoring

### 8.1 Set Up Analytics

**Google Analytics for Firebase:**
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

Track:
- Daily active users (DAU)
- Tasks created
- Reminders set
- Retention rates

**AdMob Dashboard:**
- Monitor at https://apps.admob.com/
- Check daily:
  - Impressions
  - Click-through rate (CTR)
  - Revenue

### 8.2 Monitor Crashes
```bash
npm install @react-native-firebase/crashlytics
```

Set up crash reporting to catch issues immediately.

### 8.3 Respond to Reviews
- **Daily**: Check Google Play Console for new reviews
- Respond within 24 hours
- Fix bugs mentioned in reviews ASAP

---

## Step 9: Growth & Updates

### Week 1-2: Initial Launch
```bash
# Push small fixes as you find them
eas update --branch production --message "Fix: [issue]"

# Monitor metrics daily
# Respond to all reviews
# Fix any crashes immediately
```

### Week 3-4: First Feature Update
```bash
# Add small features users request
# Test locally
eas update --branch production --message "New: [feature]"
```

### Month 2+: Major Updates
```bash
# For major changes requiring new permissions:
# 1. Update version in app.json
# 2. Build new version:
eas build --platform android --profile production

# 3. Submit to store:
eas submit --platform android

# 4. Wait for review
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
eas build --platform android --profile production --clear-cache
```

### Ads Not Showing
- Check AdMob account is active
- Verify Ad Unit IDs are correct
- Test on real device (not emulator)
- Production ads take 1-2 hours to activate

### App Rejected by Google
Common reasons:
1. **Missing privacy policy** → Add URL in store listing
2. **Crashes during review** → Test thoroughly on multiple devices
3. **Misleading description** → Be honest about features
4. **Missing permissions explanation** → Explain why you need notifications

Fix and resubmit:
```bash
eas build --platform android --profile production
eas submit --platform android
```

### OTA Update Not Working
```bash
# Check update channel
eas update:list --branch production

# Force republish
eas update --branch production --message "Force update" --force
```

---

## Command Reference

```bash
# Development
npx expo start                    # Start dev server
npx expo start --android         # Run on Android
npx expo start --ios             # Run on iOS

# Building
eas build --platform android     # Build Android
eas build --platform ios         # Build iOS
eas build --platform all         # Build both

# Submitting
eas submit --platform android    # Submit to Google Play
eas submit --platform ios        # Submit to App Store

# Updates (OTA)
eas update --branch production   # Push update
eas update:list                  # List updates
eas update:view [ID]            # View specific update

# Project Management
eas project:info                 # Show project info
eas build:list                   # List all builds
eas credentials                  # Manage credentials
```

---

## Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Google Play Developer | $25 | One-time |
| Apple Developer Program | $99 | Annual (optional) |
| Expo (Free Tier) | $0 | Free |
| AdMob | $0 | Free |
| Hosting (GitHub Pages) | $0 | Free |
| **Total First Year** | **$25-$124** | - |

**Revenue Potential**: $500-$5,000+ in first year (see MONETIZATION_GUIDE.md)

---

## Success Checklist

Before launch:
- [ ] App builds successfully
- [ ] No crashes in testing
- [ ] Ads display correctly
- [ ] Notifications work
- [ ] Privacy policy published
- [ ] Store listing complete
- [ ] Screenshots created
- [ ] Beta tested by 5+ people
- [ ] Developer account active
- [ ] AdMob configured

After launch:
- [ ] Monitor reviews daily
- [ ] Track analytics
- [ ] Fix bugs within 24 hours
- [ ] Push updates weekly
- [ ] Respond to user feedback
- [ ] Market on social media

---

## Timeline

| Phase | Duration | Task |
|-------|----------|------|
| Setup | 1-2 hours | EAS init, AdMob setup |
| Build | 2-3 hours | First build (includes waiting) |
| Store Listing | 2-4 hours | Screenshots, description, etc. |
| Submission | 30 mins | Submit to stores |
| Review | 1-3 days | Wait for approval |
| **Total** | **2-3 days** | **Ready to launch!** |

---

## Next Steps (Right Now!)

1. ✅ Run `eas init` to create Expo project
2. ⏳ Set up AdMob account and get Ad Unit IDs
3. ⏳ Update `app.json` and `AdMobConfig.js` with real IDs
4. ⏳ Create privacy policy
5. ⏳ Run `eas build --platform android`
6. ⏳ While building, create Google Play Developer account
7. ⏳ Create app listing content
8. ⏳ Submit when build completes
9. ⏳ Launch! 🚀

---

**You're ready! Let's build this thing.**

Questions? Issues? Check the troubleshooting section or the Expo docs:
https://docs.expo.dev/

