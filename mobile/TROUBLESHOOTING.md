# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "npm is not recognized"
**Problem**: Node.js/npm is not installed or not in PATH

**Solution**:
1. Download and install Node.js from: https://nodejs.org
2. Choose the LTS (Long Term Support) version
3. Restart your terminal after installation
4. Verify: `npm --version` should show a version number

---

### Issue 2: "Dependencies not installed"
**Problem**: You need to install packages first

**Solution**:
```powershell
cd mobile
npm install
```
Wait for it to finish (may take 2-5 minutes)

---

### Issue 3: "Port 8081 already in use"
**Problem**: Another process is using the port

**Solution**:
```powershell
# Kill the process using port 8081
npx kill-port 8081

# Or manually:
# 1. Open Task Manager (Ctrl+Shift+Esc)
# 2. Find "node" processes
# 3. End them
# 4. Try npm start again
```

---

### Issue 4: "Cannot find module" or "Module not found"
**Problem**: Dependencies not installed or corrupted

**Solution**:
```powershell
cd mobile
# Clean and reinstall
npm cache clean --force
rm -r node_modules  # or: Remove-Item -Recurse -Force node_modules
npm install
```

---

### Issue 5: Browser doesn't open / No QR code appears
**Problem**: Expo DevTools not starting

**Solution**:
1. **Manually open browser**: Go to `http://localhost:8081`
2. **Check terminal output**: Look for the URL in the terminal
3. **Try tunnel mode**: Press `s` in terminal, then select `tunnel`
4. **Check firewall**: Allow Node.js through Windows Firewall

---

### Issue 6: "Expo CLI not found"
**Problem**: Expo CLI needs to be installed globally

**Solution**:
```powershell
npm install -g expo-cli
# Or use npx (no installation needed):
npx expo start
```

---

### Issue 7: "Cannot connect to Metro bundler"
**Problem**: Network/firewall issue

**Solution**:
1. **Check Wi-Fi**: Make sure phone and computer are on same network
2. **Try tunnel mode**: 
   ```powershell
   npm start -- --tunnel
   ```
3. **Check firewall**: Allow Node.js in Windows Firewall
4. **Try different network**: Switch to mobile hotspot if needed

---

### Issue 8: "Error: spawn EACCES" or permission errors
**Problem**: Permission issues

**Solution**:
1. **Run as Administrator**: Right-click PowerShell → "Run as Administrator"
2. **Check antivirus**: Temporarily disable to test
3. **Check file permissions**: Make sure you have write access to the mobile folder

---

### Issue 9: QR Code doesn't scan
**Problem**: Connection issues

**Solution**:
1. **Same Wi-Fi**: Phone and computer must be on same network
2. **Try tunnel mode**: More reliable across networks
   ```powershell
   npm start -- --tunnel
   ```
3. **Manual connection**: In Expo Go, tap "Enter URL manually" and enter the URL from terminal

---

### Issue 10: App crashes on phone
**Problem**: Code errors or missing dependencies

**Solution**:
1. **Check terminal**: Look for error messages
2. **Check phone logs**: In Expo Go, shake device → "Show Dev Menu" → "View Logs"
3. **Restart**: Close Expo Go, restart `npm start`, reconnect

---

## Step-by-Step Fresh Start

If nothing works, try this complete reset:

```powershell
# 1. Navigate to mobile folder
cd "C:\Users\ivw20\Desktop\ai attention app\mobile"

# 2. Clean everything
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force

# 3. Fresh install
npm install

# 4. Start Expo
npm start
```

---

## Getting Help

If you're still stuck:

1. **Check the terminal output**: Copy the full error message
2. **Check Expo Go logs**: Shake device → Dev Menu → View Logs
3. **Try tunnel mode**: `npm start -- --tunnel`
4. **Check Expo status**: https://status.expo.dev

---

## Quick Diagnostic Commands

Run these to check your setup:

```powershell
# Check Node.js
node --version

# Check npm
npm --version

# Check if Expo is installed
npx expo --version

# Check if dependencies are installed
cd mobile
Test-Path node_modules

# Check if port 8081 is in use
netstat -ano | findstr :8081
```

---

## Still Not Working?

Share:
1. The exact error message from terminal
2. What command you ran
3. What you expected to happen
4. What actually happened

This will help diagnose the specific issue!



















