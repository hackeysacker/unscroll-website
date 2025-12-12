# How to View Your Mobile App on Windows

Since you're on Windows, here are the best ways to view your React Native/Expo app:

## Option 1: Use Expo Go on Your Phone (Easiest & Recommended) 📱

This is the fastest way to test your app:

### Steps:
1. **Install Expo Go** on your phone:
   - **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Install dependencies** (if not already done):
   ```bash
   cd mobile
   npm install
   ```

3. **Start the Expo development server**:
   ```bash
   cd mobile
   npm start
   ```
   This will open Expo DevTools in your browser.

4. **Connect your phone**:
   - Make sure your phone and computer are on the **same Wi-Fi network**
   - Scan the QR code shown in the terminal/browser with:
     - **Android**: Expo Go app (camera button)
     - **iOS**: Camera app (it will open Expo Go)

5. **The app will load on your phone!** 🎉

---

## Option 2: Android Emulator (For Testing Without Phone) 📱💻

If you want to test on an emulator on your Windows PC:

### Prerequisites:
1. **Install Android Studio**:
   - Download from: https://developer.android.com/studio
   - Install with Android SDK, Android SDK Platform, and Android Virtual Device

2. **Set up Android Emulator**:
   - Open Android Studio
   - Go to Tools → Device Manager
   - Create a new virtual device (recommended: Pixel 5 or similar)
   - Start the emulator

3. **Run your app**:
   ```bash
   cd mobile
   npm install
   npm run android
   ```
   This will automatically detect the running emulator and install the app.

---

## Option 3: Expo Web (Limited - Some Features May Not Work) 🌐

You can run the app in a web browser, but some mobile-specific features won't work:

```bash
cd mobile
npm install
npm run web
```

**Note**: This may have limitations with:
- Touch gestures
- Native features (haptics, notifications)
- Some React Native components

---

## Option 4: Windows Subsystem for Android (WSA) - Advanced ⚙️

If you have Windows 11 with WSA installed:

1. Install Android apps via WSA
2. Use ADB to connect:
   ```bash
   adb connect 127.0.0.1:58526
   npm run android
   ```

---

## Troubleshooting

### "Cannot connect to Metro bundler"
- Make sure your phone and computer are on the same Wi-Fi
- Try using the tunnel option: `npm start -- --tunnel`
- Check firewall settings

### "Expo Go not found"
- Make sure Expo Go is installed on your phone
- Try restarting the Expo development server

### "Android emulator not detected"
- Make sure Android Studio is installed
- Start the emulator before running `npm run android`
- Check that `ANDROID_HOME` environment variable is set

### Port already in use
- Kill the process using port 8081:
  ```bash
  npx kill-port 8081
  ```

---

## Quick Start (Recommended)

```bash
# 1. Navigate to mobile folder
cd mobile

# 2. Install dependencies (first time only)
npm install

# 3. Start Expo
npm start

# 4. Scan QR code with Expo Go app on your phone
```

That's it! Your app should load on your phone. 🚀



















