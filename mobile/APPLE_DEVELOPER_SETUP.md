# Apple Developer Setup for Focus Shield

This guide walks you through **exactly** what you need to do in Apple Developer to enable Focus Shield.

## Step 1: Apple Developer Program Membership

### Do you have an Apple Developer account?

**Check**: Go to https://developer.apple.com/account

- ✅ **If you can sign in**: You're already a member, skip to Step 2
- ❌ **If you can't sign in or it says "Join"**: Continue below

### Enrolling in Apple Developer Program

1. Go to https://developer.apple.com/programs/enroll/
2. Click **"Start Your Enrollment"**
3. Sign in with your Apple ID
4. Choose enrollment type:
   - **Individual**: $99/year (most common - use your personal Apple ID)
   - **Organization**: $99/year (requires D-U-N-S number)
5. Complete the enrollment form
6. Pay $99 USD (annual fee)
7. Wait for approval (usually instant, can take up to 48 hours)

💡 **Tip**: Use the same Apple ID you use for App Store purchases to keep everything in one account.

## Step 2: Register Your App Bundle ID

### What is a Bundle ID?
It's a unique identifier for your app (like `com.yourname.focusflow`). Choose carefully - **you cannot change it later**.

### Register Bundle ID

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click the **"+"** button (top left)
3. Select **"App IDs"** → Continue
4. Select **"App"** → Continue
5. Fill in the form:

   **Description**: `FocusFlow - Attention Training App`

   **Bundle ID**: Select **"Explicit"**
   - Enter: `com.YOURNAME.focusflow`
   - Example: `com.johnsmith.focusflow`
   - 💡 Use lowercase, no spaces, no special characters except dots

6. Scroll down to **"Capabilities"**
7. ⚠️ **IMPORTANT**: Check the box for **"Family Controls"**
   - This is NOT enabled by default
   - You MUST check this box or Screen Time API won't work

8. Click **"Continue"** → **"Register"**

✅ Your Bundle ID is now registered with Family Controls capability!

## Step 3: Request Screen Time API Entitlement

Apple requires manual approval before you can use the Screen Time API in production.

### Fill Out the Request Form

1. Go to https://developer.apple.com/contact/request/family-controls-distribution
2. Fill out the form:

---

**Apple ID**: your@email.com

**Team ID**:
- Find it at https://developer.apple.com/account
- It's a 10-character code like `A1B2C3D4E5`

**App Name**: FocusFlow

**App Bundle ID**: com.yourname.focusflow (use the exact one you registered)

**App Store URL**:
- If not published yet, write: `Not yet published - in development`

**Describe how your app will use the Family Controls framework**:

```
FocusFlow is a focus and attention training application designed to help
users overcome phone addiction and improve their ability to concentrate.
Our app uses gamified exercises and challenges to train attention skills.

We need the Family Controls framework to implement our "Focus Shield"
feature, which:

1. Blocks distracting apps system-wide during focus training sessions
2. Helps users build healthier phone usage habits by preventing impulsive
   app switching
3. Provides real accountability for users who struggle with self-control
4. Allows users to customize which apps are blocked during practice

This is essential for our user base (primarily students and professionals
with ADHD or attention difficulties) who need more than just reminders -
they need actual system-level blocking to succeed in their focus training.

Without the Family Controls API, users can simply switch away from our app
during exercises, defeating the purpose of attention training. Real app
blocking is a core feature requirement for our app's effectiveness.
```

**Will your app be marketed toward parents/guardians to monitor or restrict device usage?**:
- Select **"No"**

**Additional Information**:
```
Our app is marketed toward individual users (adults and teens) for
self-improvement and focus training, not for parental control. Users
choose to restrict their own device usage as part of their personal
development journey.
```

---

3. Click **"Submit"**

### What Happens Next?

- Apple reviews your request (typically **2-7 business days**)
- You'll receive an email with their decision
- ✅ **If approved**: You can use the API in production
- ❌ **If rejected**: They'll explain why and you can resubmit with clarifications

💡 **Approval Tips**:
- Be specific about your use case
- Emphasize it's for **self-control**, not parental monitoring
- Explain why friction-based alternatives aren't sufficient
- Mention your target users (people with ADHD, phone addiction, etc.)

## Step 4: Create App Store Connect Record

Even if you're not ready to publish, you should create the App Store Connect record.

### Create App Record

1. Go to https://appstoreconnect.apple.com
2. Click **"My Apps"**
3. Click the **"+"** button → **"New App"**
4. Fill in the form:

   **Platforms**: iOS

   **Name**: FocusFlow

   **Primary Language**: English (U.S.)

   **Bundle ID**: Select `com.yourname.focusflow` (the one you registered)

   **SKU**: `focusflow001` (any unique identifier, just for your reference)

   **User Access**: Full Access

5. Click **"Create"**

✅ Your app now exists in App Store Connect (you can add screenshots, descriptions, etc. later)

## Step 5: Create Provisioning Profile

This links your Bundle ID with your developer certificate so you can build to real devices.

### Development Provisioning Profile (for testing)

1. Go to https://developer.apple.com/account/resources/profiles/list
2. Click **"+"** button
3. Select **"iOS App Development"** → Continue
4. **App ID**: Select `com.yourname.focusflow`
5. **Certificates**: Select your development certificate
   - If you don't have one, create it first (Xcode can do this automatically)
6. **Devices**: Select your iPhone
   - If your device isn't listed, add it first:
     - Go to https://developer.apple.com/account/resources/devices/list
     - Click "+" → Enter device name and UDID
     - (Get UDID from Finder when iPhone is connected, click on your device)
7. **Profile Name**: `FocusFlow Development`
8. Click **"Generate"** → **"Download"**

### Install the Profile

- Double-click the downloaded `.mobileprovision` file
- It will install into Xcode automatically

## Step 6: Update Your Xcode Project

Now that everything is set up in Apple Developer, configure Xcode:

### 6.1 Set Bundle Identifier

1. Open `mobile/ios/FocusFlow.xcworkspace` in Xcode
2. Select **FocusFlow** project in navigator (blue icon at top)
3. Select **FocusFlow** target
4. Go to **"General"** tab
5. Under **"Identity"**, set:
   - **Bundle Identifier**: `com.yourname.focusflow` (exact match with Apple Developer)

### 6.2 Configure Signing

1. Still in target settings, go to **"Signing & Capabilities"** tab
2. Check **"Automatically manage signing"**
3. **Team**: Select your Apple Developer team
   - If it says "Add account", sign in with your Apple ID
4. ✅ Xcode should say **"Signing Certificate: Apple Development"**

### 6.3 Add Family Controls Capability

1. Still in **"Signing & Capabilities"**
2. Click **"+ Capability"** button
3. Search for and add **"Family Controls"**
4. ✅ You should see "Family Controls" appear in the capabilities list

### 6.4 Verify Entitlements File

Xcode should auto-create `FocusFlow.entitlements`. Verify it contains:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.developer.family-controls</key>
	<true/>
</dict>
</plist>
```

## Step 7: Update app.json

Back in your code, update `mobile/app.json`:

```json
{
  "expo": {
    "name": "FocusFlow",
    "slug": "focusflow",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourname.focusflow",
      "supportsTablet": false,
      "infoPlist": {
        "NSFamilyControlsUsageDescription": "FocusFlow needs Screen Time permission to block distracting apps during your focus sessions, helping you build better attention habits."
      }
    }
  }
}
```

## Step 8: Register Your Test Device

To test on your iPhone before publishing:

1. Connect iPhone to Mac with USB cable
2. Open **Finder** (on macOS Catalina+) or **iTunes** (older macOS)
3. Click on your iPhone in sidebar
4. Click on the phone name/capacity to reveal **UDID**
5. Right-click → **"Copy UDID"**
6. Go to https://developer.apple.com/account/resources/devices/list
7. Click **"+"** button
8. **Platform**: iOS
9. **Device Name**: Your iPhone (e.g., "John's iPhone 14")
10. **Device ID (UDID)**: Paste the UDID
11. Click **"Continue"** → **"Register"**

## Step 9: Build to Your Device

Now you're ready to test!

```bash
cd mobile
npx expo prebuild
npx expo run:ios --device
```

Xcode will:
1. Build your app
2. Sign it with your developer certificate
3. Install it on your connected iPhone
4. Launch the app

## Quick Checklist

Before building, verify you've completed:

- [ ] Enrolled in Apple Developer Program ($99 paid)
- [ ] Registered Bundle ID with Family Controls capability
- [ ] Submitted Screen Time API entitlement request
- [ ] Created App Store Connect record
- [ ] Created development provisioning profile
- [ ] Added test device to developer portal
- [ ] Set Bundle ID in Xcode
- [ ] Enabled "Automatically manage signing" in Xcode
- [ ] Added Family Controls capability in Xcode
- [ ] Updated app.json with Bundle ID and permissions

## Troubleshooting

### "No signing certificate found"
- Open Xcode preferences → Accounts → Select your Apple ID → Download Manual Profiles
- Or: Create certificate at https://developer.apple.com/account/resources/certificates/list

### "Family Controls capability not available"
- Make sure you checked "Family Controls" when registering Bundle ID
- Delete and re-register Bundle ID if you forgot to check it

### "Entitlement request still pending"
- You can still develop and test without approval
- Approval is only needed for App Store distribution
- TestFlight builds will work while pending

### "Device not recognized"
- Make sure iPhone is unlocked
- Trust the computer when prompted on iPhone
- Register device UDID at https://developer.apple.com/account/resources/devices/list

### "App installs but permission dialog doesn't appear"
- Check that `NSFamilyControlsUsageDescription` is in Info.plist
- Verify Family Controls capability is in entitlements file
- Screen Time API only works on physical devices (not simulator)

## Cost Summary

- **Apple Developer Program**: $99/year (required)
- **Everything else**: Free

## Timeline

- Enrollment: Instant to 48 hours
- Bundle ID registration: Instant
- Entitlement approval: 2-7 business days (typically 3-4 days)
- First build to device: About 30 minutes of setup

## Need Help?

If you get stuck on any step, common issues:

1. **Can't find Team ID**: https://developer.apple.com/account → Membership → Team ID
2. **Can't find UDID**: Connect iPhone → Finder → Click device → Click serial number to show UDID
3. **Signing errors**: Xcode → Preferences → Accounts → Download Manual Profiles
4. **Entitlement questions**: https://developer.apple.com/contact/

You're now ready to build and test Focus Shield on your iPhone! 🚀
