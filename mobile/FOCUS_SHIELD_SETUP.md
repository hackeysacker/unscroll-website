# Focus Shield Setup Guide

This guide walks you through setting up the **Focus Shield** feature, which uses iOS Screen Time APIs to provide real, system-level app blocking during focus sessions.

## ⚠️ Important Prerequisites

Focus Shield requires:
- **iOS device** (iPhone/iPad running iOS 15+)
- **Bare React Native workflow** (ejected from Expo managed workflow)
- **Apple Developer Program** membership ($99/year)
- **Screen Time API entitlement** (requires Apple approval)

## Step 1: Eject from Expo Managed Workflow

Since you're currently using Expo SDK 54, you need to eject to a bare workflow to add native iOS modules.

### Option A: Expo Prebuild (Recommended)

```bash
cd mobile
npx expo prebuild
```

This creates the `ios/` and `android/` directories while keeping Expo modules intact.

### Option B: Full Eject (More Control)

```bash
cd mobile
npx expo eject
```

⚠️ **Warning**: After ejecting, you cannot go back to managed workflow without losing native code.

## Step 2: Install Native Dependencies

### Update Info.plist

Add the Screen Time API usage description to `mobile/ios/FocusFlow/Info.plist`:

```xml
<key>NSFamilyControlsUsageDescription</key>
<string>FocusFlow needs Screen Time permission to block distracting apps during your focus sessions.</string>
```

### Add Capabilities in Xcode

1. Open `mobile/ios/FocusFlow.xcworkspace` in Xcode
2. Select your project in the navigator
3. Select the FocusFlow target
4. Go to "Signing & Capabilities" tab
5. Click "+ Capability"
6. Add **"Family Controls"**

### Update Podfile

Add to `mobile/ios/Podfile`:

```ruby
target 'FocusFlow' do
  # ... existing pods ...

  # Required for Screen Time API
  pod 'FamilyControls'
  pod 'ManagedSettings'
  pod 'DeviceActivity'
end
```

Then run:

```bash
cd ios
pod install
```

## Step 3: Add Native Module Files

The following files have been created for you:

- `mobile/ios/FocusShieldModule/FocusShieldModule.swift` - Swift implementation
- `mobile/ios/FocusShieldModule/FocusShieldModule.m` - Objective-C bridge
- `mobile/src/modules/FocusShield.ts` - React Native interface
- `mobile/src/components/FocusShieldControl.tsx` - UI component

### Link the Native Module in Xcode

1. Open `mobile/ios/FocusFlow.xcworkspace`
2. Right-click on FocusFlow folder → "Add Files to FocusFlow"
3. Navigate to `ios/FocusShieldModule/`
4. Select both `.swift` and `.m` files
5. Ensure "Copy items if needed" is checked
6. Click "Add"

### Create Bridging Header (if needed)

If this is your first Swift file in the project:

1. Xcode will prompt "Would you like to configure an Objective-C bridging header?"
2. Click "Create Bridging Header"
3. This creates `FocusFlow-Bridging-Header.h`

## Step 4: Request Screen Time API Entitlement

Apple requires manual approval to use the Screen Time API.

### Apply for Entitlement

1. Go to https://developer.apple.com/contact/request/family-controls-distribution
2. Fill out the form explaining your use case:

**Example explanation:**
```
FocusFlow is a focus and attention training app that helps users overcome
phone addiction through gamified exercises. We need the Screen Time API to
provide real app blocking during focus sessions, which is essential for our
users who struggle with impulse control and app switching habits. Our "Focus
Shield" feature blocks distracting apps system-wide during training exercises,
helping users build healthier phone usage patterns.
```

3. Wait for Apple's response (typically 2-7 business days)

### Add Entitlement File

Once approved, create `mobile/ios/FocusFlow/FocusFlow.entitlements`:

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

Then in Xcode:
1. Select FocusFlow target
2. Go to "Signing & Capabilities"
3. Ensure "Family Controls" capability shows up

## Step 5: Update App Bundle ID

Make sure your app bundle ID matches what you registered with Apple:

1. In Xcode, go to target settings
2. Update Bundle Identifier (e.g., `com.yourcompany.focusflow`)
3. Update in `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.focusflow"
    }
  }
}
```

## Step 6: Usage in Your App

### Import and Use Focus Shield

```typescript
import FocusShield from './src/modules/FocusShield';
import { FocusShieldControl } from './src/components/FocusShieldControl';

// Check availability
if (FocusShield.isAvailable()) {
  // Request permission
  const result = await FocusShield.requestAuthorization();

  // Enable blocking
  await FocusShield.enable({
    blockAllApps: true,
    allowedApps: ['com.apple.mobilesafari', 'com.apple.MobileSMS']
  });

  // Disable blocking
  await FocusShield.disable();
}
```

### Add to Your UI

Add the `FocusShieldControl` component anywhere in your app:

```typescript
import { FocusShieldControl } from './src/components/FocusShieldControl';

export function SettingsScreen() {
  return (
    <View>
      <FocusShieldControl />
    </View>
  );
}
```

## Step 7: Testing

### On Simulator
⚠️ Screen Time API **does not work** in iOS Simulator. You must test on a real device.

### On Real Device

1. Build for device:
```bash
cd mobile
npx expo run:ios --device
```

2. On your iPhone:
   - Grant Screen Time permission when prompted
   - Toggle Focus Shield on
   - Try opening Instagram, TikTok, etc. - they should be blocked
   - Toggle Focus Shield off to restore access

## Common Bundle IDs for Popular Apps

Use these when configuring `blockedApps`:

```typescript
const COMMON_DISTRACTING_APPS = [
  'com.burbn.instagram',           // Instagram
  'com.facebook.Facebook',         // Facebook
  'com.zhiliaoapp.musically',      // TikTok
  'com.atebits.Tweetie2',         // Twitter/X
  'com.google.chrome.ios',         // Chrome
  'com.snapchat.snapchat',        // Snapchat
  'com.reddit.Reddit',            // Reddit
  'ph.telegra.Telegraph',         // Telegram
  'net.whatsapp.WhatsApp',        // WhatsApp
  'com.toyopagroup.picaboo',      // Snapchat (alt)
];
```

## Troubleshooting

### "Module not found" error
- Make sure you ran `pod install` after adding the native module
- Rebuild the app: `npx expo run:ios --device`

### "Permission denied" when enabling shield
- Check that authorization status is "approved"
- Call `requestAuthorization()` first

### Screen Time dialog doesn't appear
- Ensure you added `NSFamilyControlsUsageDescription` to Info.plist
- Check that Family Controls capability is enabled in Xcode

### Apps aren't actually blocked
- Screen Time API only works on physical devices, not simulator
- Verify you have the entitlement file and it's properly configured
- Check Xcode logs for any error messages

### Build fails with Swift compilation errors
- Ensure bridging header is created
- Check that Swift version is compatible (Swift 5.0+)
- Clean build folder: Product → Clean Build Folder in Xcode

## Next Steps

Once Focus Shield is working:

1. **Integrate with exercises**: Automatically enable Focus Shield when users start focus exercises
2. **Scheduled sessions**: Allow users to schedule automatic blocking periods
3. **Custom app lists**: Let users create multiple profiles (Work, Study, Sleep, etc.)
4. **Usage statistics**: Track which apps users try to access during blocks
5. **Rewards system**: Award extra points for completing exercises with Focus Shield active

## Alternative: Focus Mode (No Native Modules)

If you can't get Screen Time API approval or prefer to stay in managed Expo:

- Use friction-based deterrents (delays, confirmations, streaks)
- Focus reminders and notifications
- Track app switches (on Android with AccessibilityService)
- See `FOCUS_MODE_ALTERNATIVE.md` for implementation details

## Resources

- [Apple FamilyControls Documentation](https://developer.apple.com/documentation/familycontrols)
- [Screen Time API WWDC Videos](https://developer.apple.com/videos/play/wwdc2021/10123/)
- [React Native Native Modules Guide](https://reactnative.dev/docs/native-modules-ios)
- [Expo Prebuild Documentation](https://docs.expo.dev/workflow/prebuild/)
