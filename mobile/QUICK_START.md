# Quick Start - View Your App on Windows

## 🚀 Fastest Way: Use Your Phone with Expo Go

### Step 1: Install Expo Go on Your Phone
- **Android**: Search "Expo Go" in Google Play Store
- **iPhone**: Search "Expo Go" in App Store

### Step 2: Install Dependencies
Open PowerShell or Command Prompt in the project root, then:

```powershell
cd mobile
npm install
```

This will take a few minutes the first time.

### Step 3: Start the App
```powershell
npm start
```

This will:
- Start the Expo development server
- Open Expo DevTools in your browser
- Show a QR code

### Step 4: Connect Your Phone
1. Make sure your phone and computer are on the **same Wi-Fi network**
2. Open Expo Go app on your phone
3. **Android**: Tap "Scan QR code" and scan the QR code
4. **iPhone**: Use the Camera app to scan the QR code (it will open Expo Go)

### Step 5: Wait for the App to Load
The app will download and start on your phone! 🎉

---

## 🖥️ Alternative: Use Android Emulator

If you want to test on your computer instead:

### Prerequisites
1. Download and install [Android Studio](https://developer.android.com/studio)
2. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### Setup Emulator
1. Open Android Studio
2. Go to **Tools → Device Manager**
3. Click **Create Device**
4. Choose a device (e.g., Pixel 5)
5. Download a system image (e.g., Android 13)
6. Click **Finish** and **Start** the emulator

### Run App on Emulator
```powershell
cd mobile
npm install
npm run android
```

The app will automatically install and run on the emulator!

---

## ⚠️ Troubleshooting

### "Cannot connect to Metro bundler"
- Ensure phone and computer are on the same Wi-Fi
- Try: `npm start -- --tunnel` (slower but more reliable)

### "Port 8081 already in use"
```powershell
npx kill-port 8081
npm start
```

### "Expo Go not found"
- Make sure Expo Go is installed on your phone
- Restart the Expo server: Press `r` in the terminal

### Dependencies won't install
```powershell
cd mobile
npm cache clean --force
npm install
```

---

## 📝 Commands Reference

```powershell
# Install dependencies (first time only)
cd mobile
npm install

# Start development server
npm start

# Start on Android emulator (if emulator is running)
npm run android

# Start on web browser (limited features)
npm run web
```

---

## 🎯 Recommended Workflow

1. **First time setup**: Install dependencies (`npm install`)
2. **Daily development**: Just run `npm start` and scan QR code
3. **Testing**: Use Expo Go on your phone for best experience

Your app is ready to view! 🚀




















