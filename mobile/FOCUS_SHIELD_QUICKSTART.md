# Focus Shield Quick Start Guide

Get real iOS app blocking working in **15 minutes** (setup only - entitlement approval takes 2-7 days).

## What You're Getting

**Focus Shield** = Real system-level app blocking during focus sessions using iOS Screen Time API.

When enabled:
- ✅ Actually blocks Instagram, TikTok, etc. at OS level
- ✅ Users can't switch away from your app during exercises
- ✅ Gamified "unlock apps by earning XP" progression
- ✅ Scheduled blocking periods
- ✅ Custom app allow/block lists

## Before You Start

**You NEED:**
- [ ] Apple Developer Program membership ($99/year) - [Enroll here](https://developer.apple.com/programs/enroll/)
- [ ] A Mac (to run Xcode) - Can rent cloud Mac if needed
- [ ] iPhone for testing (Screen Time API doesn't work in simulator)

**Current Status:**
- ✅ All code is written and ready
- ✅ React Native interface complete
- ✅ Swift native module implemented
- ⏳ Waiting for you to set up Apple Developer account

## 5-Minute Web Setup (Do This First)

While waiting for Mac access, complete these steps on **any device** (Windows/Mac/Linux):

### Step 1: Join Apple Developer (5 min)

1. Go to https://developer.apple.com/programs/enroll/
2. Sign in with your Apple ID
3. Pay $99 (annual fee)
4. Wait for confirmation email (usually instant)

### Step 2: Register Bundle ID (2 min)

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click **"+"** button
3. Select **"App IDs"** → Continue
4. Select **"App"** → Continue
5. Fill in:
   - **Description**: `FocusFlow`
   - **Bundle ID**: `com.YOURNAME.focusflow` (lowercase, your actual name)
   - ⚠️ **CHECK "Family Controls" capability** (critical!)
6. Click Continue → Register

### Step 3: Request Entitlement (3 min)

1. Go to https://developer.apple.com/contact/request/family-controls-distribution
2. Fill out the form (copy from below):

**Form Fields:**

- **Apple ID**: (your email)
- **Team ID**: Find at https://developer.apple.com/account (10-character code like `A1B2C3D4E5`)
- **App Name**: FocusFlow
- **Bundle ID**: `com.yourname.focusflow` (same as Step 2)
- **App Store URL**: `Not yet published - in development`

**Describe how your app will use Family Controls**:
```
FocusFlow is a focus and attention training app that helps users overcome
phone addiction through gamified exercises. We need the Family Controls API
to implement our "Focus Shield" feature which blocks distracting apps at
the system level during focus training sessions.

This is essential for users who struggle with impulse control and need more
than reminders - they need actual app blocking to succeed. Users can
customize which apps are blocked and earn XP by completing exercises without
switching apps.

This is for self-control, not parental monitoring.
```

- **Will this be marketed toward parents?**: No
- **Additional info**: `Our app is for individual users (adults/teens) managing their own phone usage for personal development.`

3. Click Submit
4. Wait 2-7 business days for Apple's response

✅ **You're done with the web setup!** Continue below when you have Mac access.

---

## Mac Setup (30 min - Do This on Mac)

### Step 4: Eject from Expo (5 min)

Open Terminal in your project:

```bash
cd mobile
npx expo prebuild
```

This creates `ios/` and `android/` directories with native code.

### Step 5: Configure Xcode (15 min)

1. Open the project:
```bash
cd ios
open FocusFlow.xcworkspace
```

2. **Set Bundle ID**:
   - Select **FocusFlow** project (blue icon)
   - Select **FocusFlow** target
   - **General** tab
   - **Bundle Identifier**: `com.yourname.focusflow` (exact match from Step 2)

3. **Configure Signing**:
   - **Signing & Capabilities** tab
   - Check **"Automatically manage signing"**
   - **Team**: Select your Apple Developer team
   - Should say "Signing Certificate: Apple Development"

4. **Add Family Controls**:
   - Click **"+ Capability"**
   - Search: `Family Controls`
   - Add it
   - Verify it appears in capabilities list

5. **Add Usage Description**:
   - Open `FocusFlow/Info.plist`
   - Add this key:
   ```xml
   <key>NSFamilyControlsUsageDescription</key>
   <string>FocusFlow needs Screen Time permission to block distracting apps during your focus sessions.</string>
   ```

6. **Link Native Module Files**:
   - Right-click **FocusFlow** folder in Xcode
   - **"Add Files to FocusFlow"**
   - Navigate to `ios/FocusShieldModule/`
   - Select `FocusShieldModule.swift` and `FocusShieldModule.m`
   - Check **"Copy items if needed"**
   - Click **"Add"**
   - If prompted about bridging header, click **"Create Bridging Header"**

### Step 6: Install Pod Dependencies (2 min)

```bash
cd ios
pod install
```

### Step 7: Register Your iPhone (5 min)

1. Connect iPhone to Mac with USB
2. Unlock iPhone
3. Trust the computer when prompted
4. In Finder (macOS Catalina+) or iTunes:
   - Click your iPhone
   - Click on serial number to show **UDID**
   - Right-click → Copy UDID

5. Go to https://developer.apple.com/account/resources/devices/list
6. Click **"+"**
7. **Device Name**: Your iPhone
8. **UDID**: Paste
9. Click Register

### Step 8: Build to Device (3 min)

Back in Terminal:

```bash
cd mobile
npx expo run:ios --device
```

Or in Xcode:
1. Select your iPhone as the build target (top bar)
2. Click **▶️ Run** button

The app will build and install on your iPhone!

---

## Testing Focus Shield

Once the app is running on your iPhone:

### Test Authorization Flow

1. Open the app
2. Go to **Profile** screen (bottom nav)
3. You'll see **Focus Shield** card
4. Tap **"Grant Permission"**
5. iOS will show Screen Time permission dialog
6. Tap **"Allow"**

### Test App Blocking

1. Toggle **Focus Shield ON**
2. Try to open Instagram, TikTok, or other distracting apps
3. They should show the iOS shield screen (blocked!)
4. Toggle **Focus Shield OFF** to restore access

### Customize Blocked Apps

Tap **"Configure Blocked Apps"** to choose which apps to block.

---

## Common Issues & Fixes

### "FocusShieldModule not found"

**Fix**:
```bash
cd ios
pod install
cd ..
npx expo run:ios --device
```

### "Family Controls capability not available"

**Fix**: Make sure you checked "Family Controls" when registering Bundle ID in Step 2.

### "Permission dialog doesn't appear"

**Fix**: Check that `NSFamilyControlsUsageDescription` is in Info.plist.

### "Apps aren't actually blocked"

**Fix**: Screen Time API only works on real devices, not simulator. Make sure you're testing on actual iPhone.

### Build fails with code signing errors

**Fix**:
1. Xcode → Preferences → Accounts
2. Select your Apple ID
3. Click "Download Manual Profiles"
4. Try building again

---

## What Happens Without Entitlement Approval?

**You can still develop and test!**

- ✅ Authorization flow works
- ✅ App blocking works during development
- ✅ All features functional on your device
- ❌ Can't submit to App Store without approval
- ❌ Can't distribute via TestFlight without approval

**TL;DR**: Build now, wait for approval later.

---

## Next Steps After Setup

1. **Integrate with exercises**: Auto-enable Focus Shield when users start challenges
2. **Add scheduling**: Let users set daily blocking periods (e.g., 8pm-10pm)
3. **Gamify it**: Award bonus XP for completing exercises with Focus Shield active
4. **Create profiles**: Let users save different app configurations (Work, Study, Sleep)

---

## Timeline Summary

- **Web setup**: 10 minutes (do now)
- **Mac setup**: 30 minutes (when you have Mac access)
- **Entitlement approval**: 2-7 business days (passive waiting)
- **App Store submission**: After approval

---

## Getting Help

**Apple Developer Support**: https://developer.apple.com/contact/

**Stuck on Xcode?**: See detailed troubleshooting in `FOCUS_SHIELD_SETUP.md`

**Need cloud Mac?**:
- MacStadium: https://www.macstadium.com
- AWS EC2 Mac: https://aws.amazon.com/ec2/instance-types/mac/

---

## Architecture Overview

Here's how the pieces fit together:

```
React Native (JavaScript)
     ↓
FocusShield.ts (TypeScript interface)
     ↓
FocusShieldModule.m (Objective-C bridge)
     ↓
FocusShieldModule.swift (Swift implementation)
     ↓
iOS Screen Time APIs (FamilyControls, ManagedSettings, DeviceActivity)
     ↓
System-level app blocking
```

Your app calls `FocusShield.enable()` → Swift code tells iOS to block apps → Apps are actually blocked!

---

## Files You Have

All code is ready in your project:

- `mobile/ios/FocusShieldModule/FocusShieldModule.swift` - Native iOS implementation
- `mobile/ios/FocusShieldModule/FocusShieldModule.m` - Bridge to React Native
- `mobile/src/modules/FocusShield.ts` - JavaScript API
- `mobile/src/components/FocusShieldControl.tsx` - UI component (already added to Profile screen)
- `mobile/FOCUS_SHIELD_SETUP.md` - Detailed technical guide
- `mobile/APPLE_DEVELOPER_SETUP.md` - Step-by-step Apple setup
- `mobile/FOCUS_SHIELD_QUICKSTART.md` - This guide

**You're ready to go!** Just complete the Apple Developer steps and build to your device.
