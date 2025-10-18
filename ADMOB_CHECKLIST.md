# AdMob Setup Checklist

## ✅ Code Implementation (DONE)

- ✅ AdMob plugin configured in app.json
- ✅ App ID: `ca-app-pub-4990808025747866~4500674364`
- ✅ Banner ID: `ca-app-pub-4990808025747866/9254694633`
- ✅ Interstitial ID: `ca-app-pub-4990808025747866/8429338759`
- ✅ react-native-google-mobile-ads installed (v14.2.3)
- ✅ AdMobConfig.js properly configured

## 🌐 AdMob Console Setup Required

Visit: https://apps.admob.google.com/

### 1️⃣ Verify Your AdMob Account
- [ ] Account is verified (email confirmed)
- [ ] Payment information added (to receive earnings)
- [ ] Tax information completed

### 2️⃣ Check Your App Status
Navigate to: Apps → StopList

- [ ] App is created in AdMob
- [ ] Package name matches: `com.sinabehdadk.stoplist`
- [ ] App platform: Android

### 3️⃣ Verify Ad Units Status
Navigate to: Apps → StopList → Ad units

**Banner Ad Unit:**
- [ ] Status: Active (green)
- [ ] ID: `ca-app-pub-4990808025747866/9254694633`
- [ ] Format: Banner

**Interstitial Ad Unit:**
- [ ] Status: Active (green)
- [ ] ID: `ca-app-pub-4990808025747866/8429338759`
- [ ] Format: Interstitial

### 4️⃣ App-ads.txt (Optional but Recommended)
- [ ] If you have a website, add app-ads.txt file
- Download from: AdMob → Settings → App-ads.txt

---

## 🚫 Why You Don't See Ads Now

### ❌ Using Expo Go App
If you're testing with `npm start` + Expo Go:
- **Problem**: Expo Go doesn't support native modules like AdMob
- **Solution**: Build production APK with `make build`

### ✅ After Building Production APK
You WILL see ads because:
- ✓ Native AdMob module will be included
- ✓ Real ad IDs will be used
- ✓ Ads will load from Google's servers

---

## 💰 When Will You Start Earning?

### Timeline:
1. **Day 1**: Build APK → Install on your phone → See test impressions
2. **Day 2-3**: First real users install → Google reviews implementation
3. **Day 3-7**: Ads get approved → Revenue starts appearing
4. **Day 30+**: Payment threshold reached ($100) → Money transferred

### What Counts as Valid Impression:
- ✅ Real user installs app
- ✅ User sees ad
- ✅ User clicks ad (pays more)
- ❌ YOU testing on your own device (doesn't count)

---

## 🔧 Testing Your Implementation

### After Building Production APK:

1. **Install on Your Phone**
   ```bash
   make build
   make download
   # Install: builds/stoplist-v1.0.5.apk
   ```

2. **What You Should See:**
   - Footer shows "v1.0.5"
   - Banner ad loads (might take 30-60 seconds first time)
   - If on WiFi, should see Google ads

3. **Check Logs** (if needed):
   ```bash
   adb logcat | grep -i "admob\|banner"
   ```

4. **Check AdMob Console:**
   - Wait 24 hours
   - Go to Reports → Check impressions
   - First few impressions trigger Google review

---

## ⚠️ Common Issues

### Issue 1: "No ads showing"
**Cause**: Using Expo Go  
**Fix**: Build production APK

### Issue 2: "Ad failed to load"
**Causes**:
- No internet connection
- Ad inventory temporarily empty (try again later)
- AdMob account not fully activated

**Check**: Look for error message in app (dev mode only)

### Issue 3: "Ads show but no revenue"
**Causes**:
- Testing on your own device (Google filters your clicks)
- Need real users to generate revenue
- Payment info not set up in AdMob

---

## 📱 For Iranian Users (Special Notes)

### If Distributing via Telegram/APK:
- Users WITH VPN: ✅ Will see ads → You earn
- Users WITHOUT VPN: ❌ Won't see Google ads → No revenue

### Alternative (Better for Iran):
Consider adding **Tapsell** (Iranian ad network):
- https://tapsell.ir/
- Better fill rate in Iran
- Can run alongside AdMob
- Pays in Iranian Toman

---

## ✅ Ready to Test?

Run:
```bash
make build
```

Then install the APK and ads should work! 🚀

