# How to See the QR Code

When you run `npm start`, Expo will automatically open a page in your browser with the QR code. Here's how to access it:

## Method 1: Automatic Browser Opening (Default)

1. Run this command:
   ```powershell
   cd mobile
   npm start
   ```

2. **Expo will automatically open your default browser** to:
   ```
   http://localhost:8081
   ```

3. You'll see:
   - A **QR code** in the center
   - Connection options (LAN, Tunnel, etc.)
   - Instructions below the QR code

## Method 2: Manual Browser Access

If the browser doesn't open automatically:

1. After running `npm start`, look at the terminal output
2. You'll see a message like:
   ```
   Metro waiting on exp://192.168.x.x:8081
   ```
3. Open your browser and go to:
   ```
   http://localhost:8081
   ```
   OR
   ```
   http://127.0.0.1:8081
   ```

## Method 3: Terminal QR Code (Alternative)

Some terminals can display QR codes directly:

1. Run `npm start`
2. Press `s` in the terminal to switch to QR code view
3. The QR code will appear in your terminal (if your terminal supports it)

## Method 4: Expo DevTools

1. Run `npm start`
2. Press `m` to open Expo DevTools menu
3. Select "Open in browser"
4. The QR code will be displayed

## What You'll See

When you open the Expo page, you'll see:

```
┌─────────────────────────┐
│                         │
│      [QR CODE]          │
│                         │
└─────────────────────────┘

Connection: LAN
URL: exp://192.168.x.x:8081

Scan this QR code with:
- Expo Go (Android)
- Camera app (iOS)
```

## Troubleshooting

### Browser doesn't open automatically
- Manually open: `http://localhost:8081`
- Check if port 8081 is available

### Can't see QR code
- Make sure you're on the same Wi-Fi network as your phone
- Try the tunnel option: Press `s` then select "tunnel"
- Check firewall settings

### QR code not working
- Make sure Expo Go is installed on your phone
- Ensure phone and computer are on same Wi-Fi
- Try tunnel mode for better connectivity

## Quick Steps Summary

1. **Open PowerShell/Command Prompt**
2. **Navigate to mobile folder**: `cd mobile`
3. **Start Expo**: `npm start`
4. **Browser opens automatically** → QR code is there!
5. **Scan with Expo Go app** on your phone

That's it! 🎉





















