# 🚀 Google Play Store Release Checklist - StopList v1.0.7

## ⚠️ CRITICAL: Fix Play Console Declarations FIRST!

Your app was **rejected** because you accidentally declared it as a Financial/Health/Government app.  
**StopList is a PRODUCTIVITY app** - follow this checklist carefully!

---

## 📋 PART 1: Play Console - App Content Declarations

### Go to: [Play Console](https://play.google.com/console) → Your App → **Policy** → **App content**

---

### ✅ 1. App access
- **Question:** Do all users see the same content?
- **Answer:** ✅ **Yes, all users see the same content**
- **Why:** No login required, all features accessible to everyone

---

### ✅ 2. Ads
- **Question:** Does your app contain ads?
- **Answer:** ✅ **Yes, my app contains ads**
- **Ad formats:** Banner ads, Interstitial ads
- **Save**

---

### ✅ 3. Content ratings
- **Should already be set** (PEGI 3, ESRB Everyone, etc.)
- If not, complete the questionnaire:
  - Violence: No
  - Sexual content: No
  - Language: No
  - Controlled substances: No
  - Gambling: No
  - User interaction: No
  - Shares location: No
  - Shares personal info: No

---

### ❌ 4. News apps ⚠️ CRITICAL
- **Question:** Is this a news app?
- **Answer:** ❌ **No**
- **Why:** StopList is a task/reminder app, NOT a news app

---

### ❌ 5. COVID-19 contact tracing
- **Question:** Is this a COVID-19 contact tracing or status app?
- **Answer:** ❌ **No**

---

### ✅ 6. Data safety ⚠️ CRITICAL
**Go to:** Policy → Data safety

#### Data Collection
- **Question:** Does your app collect or share user data?
- **Answer:** ✅ **Yes**

#### What data is collected?
Select ONLY these:

**Location:**
- ❌ Approximate location - NO
- ❌ Precise location - NO

**Personal info:**
- ❌ Name - NO
- ❌ Email - NO
- ❌ User IDs - NO
- ❌ Address - NO
- ❌ Phone number - NO
- ❌ Other - NO

**App activity:**
- ✅ **App interactions** - YES
  - Purpose: Analytics
  - Data is collected: ✅ Yes
  - Data is shared: ❌ No
  - Data collection is optional: ❌ No (required for ads)
  - Data is encrypted in transit: ✅ Yes
  - Users can request deletion: ❌ No

**Device or other IDs:**
- ✅ **Device or other IDs** - YES
  - Purpose: Advertising or marketing
  - Data is collected: ✅ Yes
  - Data is shared: ✅ Yes (with Google AdMob)
  - Data collection is optional: ❌ No (required for ads)
  - Data is encrypted in transit: ✅ Yes
  - Users can request deletion: ❌ No

**Save**

---

### ❌ 7. Government apps ⚠️ CRITICAL - THIS IS YOUR MAIN ERROR!
- **Question:** Is your app a government app?
- **Answer:** ❌ **No**
- **Question:** Is your app developed by or on behalf of a government agency?
- **Answer:** ❌ **No**
- **Why:** StopList is a personal productivity app, NOT a government service

---

### ❌ 8. Financial features ⚠️ CRITICAL - THIS IS YOUR MAIN ERROR!
- **Question:** Does your app offer financial features?
- **Answer:** ❌ **No**
- **Question:** Banking services?
- **Answer:** ❌ **No**
- **Question:** Stock trading?
- **Answer:** ❌ **No**
- **Question:** Loans or credit?
- **Answer:** ❌ **No**
- **Question:** Cryptocurrency wallet or exchange?
- **Answer:** ❌ **No**
- **Why:** StopList is a task reminder app - no financial features at all!

---

### ❌ 9. Health ⚠️ CRITICAL - THIS IS YOUR MAIN ERROR!
- **Question:** Is this a health app?
- **Answer:** ❌ **No**
- **Question:** Does it provide medical features?
- **Answer:** ❌ **No**
- **Question:** Does it conduct human subjects research?
- **Answer:** ❌ **No**
- **Why:** StopList is a task reminder app - no health/medical features!

---

### ✅ 10. Privacy Policy
- **Question:** Privacy policy URL
- **Answer:** `https://github.com/sbehdadk/stoplist/blob/main/privacy-policy.html`
- **Should already be set**

---

### ✅ 11. Advertising ID ⚠️ IMPORTANT
- **Question:** Does your app use advertising ID?
- **Answer:** ✅ **Yes**
- **Why:** Your app uses AdMob SDK which requires advertising ID

**Select these purposes:**
- ✅ **Advertising or marketing** (to show ads)
- ✅ **Analytics** (to measure ad performance)

**Do NOT select:**
- ❌ App functionality
- ❌ Developer communications
- ❌ Fraud prevention
- ❌ Personalization
- ❌ Account management

---

### ✅ 12. Target audience
- **Target age:** 13+
- **Appeal to children:** No
- **Save**

---

## 📋 PART 2: Store Listing Settings

### Go to: **Store presence** → **Store listing**

---

### ✅ 1. App category ⚠️ CRITICAL - THIS MIGHT BE YOUR ERROR!
- **Category:** **Productivity** 
- **NOT:** Finance, Health & Fitness, Business, Medical, Lifestyle, Tools, Games
- **Why:** StopList is a task management/reminder app = Productivity

---

### ✅ 2. App name
- **Name:** StopList
- **Short description:** Simple task manager with notifications
- **Full description:** (keep your current description)

---

### ✅ 3. Graphics
- App icon: ✅ Already set
- Feature graphic: ✅ Already set
- Screenshots: ✅ Already set

---

## 📋 PART 3: Build and Upload v1.0.7

### Step 1: Update version in codebase
```bash
# This will be done automatically
```

### Step 2: Commit and push
```bash
git add -A
git commit -m "Release v1.0.7 - Fix Play Console compliance"
git push origin main
```

### Step 3: Build AAB
```bash
make build-aab
```

### Step 4: Download AAB
```bash
make download
```

### Step 5: Upload to Play Console
1. Go to: **Release** → **Production** → **Create new release**
2. Upload: `stoplist-v1.0.7.aab`
3. Release name: `v1.0.7`
4. Release notes:
   ```
   • Bug fixes and performance improvements
   • Updated for latest Android compatibility
   ```
5. **BEFORE clicking "Save" or "Review release":**
   - Go back to PART 1 and verify ALL declarations are correct
   - Especially: Government (No), Financial (No), Health (No), Category (Productivity)

### Step 6: Review and Submit
1. Click **Save**
2. Click **Review release**
3. Verify everything looks correct
4. Click **Start rollout to Production**

---

## 🎯 VERIFICATION CHECKLIST

Before submitting, confirm these are ALL set correctly:

- [ ] **Government app:** ❌ No
- [ ] **Financial features:** ❌ No  
- [ ] **Health app:** ❌ No
- [ ] **App category:** ✅ Productivity
- [ ] **Advertising ID:** ✅ Yes (Advertising/Analytics only)
- [ ] **Data safety:** ✅ Only Device ID + App interactions
- [ ] **Ads declaration:** ✅ Yes
- [ ] **Privacy policy:** ✅ Set
- [ ] **Content rating:** ✅ Everyone/PEGI 3
- [ ] **News app:** ❌ No
- [ ] **COVID app:** ❌ No

---

## 🚨 COMMON MISTAKES TO AVOID

1. ❌ Selecting "Finance" or "Business" as app category → Use "Productivity"
2. ❌ Declaring financial features → StopList has NONE
3. ❌ Declaring health features → StopList has NONE  
4. ❌ Declaring as government app → StopList is NOT
5. ❌ Collecting personal info in Data safety → Only Device ID + App interactions
6. ❌ Using wrong advertising ID purposes → Only Advertising + Analytics

---

## 📞 If Still Rejected

If rejected again after following this checklist:

1. **Appeal the decision** in Play Console
2. Write:
   ```
   Our app StopList is a simple task reminder/to-do list app for productivity.
   
   It does NOT offer:
   - Financial services (no banking, trading, loans, cryptocurrency)
   - Health/medical features (no health tracking, medical advice, research)
   - Government services (personal app, not government-related)
   - VPN services
   
   App category: Productivity
   Features: Task creation, local notifications, simple UI
   
   We have corrected all app content declarations to accurately reflect 
   our app's actual features. Please review.
   ```

---

## ✅ Expected Timeline

- Upload: Immediate
- Review: 1-7 days (usually 1-3 days)
- If approved: Live on Play Store within hours
- If rejected: Email notification + 7 days to fix

---

## 🎉 Success Indicators

You'll know it's successful when:
- ✅ Status changes to "Pending publication"
- ✅ No policy violation errors
- ✅ Email: "Your app is now live on Google Play"
- ✅ App appears in search: "StopList"

---

**Good luck! 🚀**

