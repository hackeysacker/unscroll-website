# Quick Fix Guide

## What error are you seeing?

Please tell me which of these applies:

### A) "npm is not recognized"
**Fix**: Install Node.js from https://nodejs.org (choose LTS version)

### B) "Cannot find module" or "Module not found"
**Fix**: Run this:
```powershell
cd mobile
npm install
```

### C) "Port 8081 already in use"
**Fix**: Run this:
```powershell
npx kill-port 8081
npm start
```

### D) Browser opens but no QR code
**Fix**: 
1. Manually go to: http://localhost:8081
2. Or press `s` in terminal and select "tunnel"

### E) "Expo CLI not found"
**Fix**: Run this instead:
```powershell
cd mobile
npx expo start
```

### F) Nothing happens when I run `npm start`
**Fix**: 
1. Make sure you're in the mobile folder: `cd mobile`
2. Install dependencies first: `npm install`
3. Then try: `npm start`

---

## Complete Fresh Start (If Nothing Works)

Run these commands one by one:

```powershell
# 1. Go to mobile folder
cd mobile

# 2. Remove old files
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# 3. Clean npm cache
npm cache clean --force

# 4. Install everything fresh
npm install

# 5. Start the app
npm start
```

---

## What to Share for Help

If it still doesn't work, please share:

1. **The exact error message** (copy from terminal)
2. **What command you ran** (e.g., "npm start")
3. **What you see** (e.g., "nothing happens", "error message", etc.)

This will help me fix the specific issue!



















