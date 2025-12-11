# Focus Journey Testing Guide

## Server Status
🟢 **Expo Dev Server Running**: http://localhost:8081

⚠️ Web bundler failing (expected - this is a mobile-only app)

## How to Test

### Option 1: Physical Device (Recommended)
1. **Install Expo Go** on your phone:
   - iOS: Download from App Store
   - Android: Download from Google Play

2. **Connect to the dev server**:
   - Make sure your phone and computer are on the same WiFi network
   - Open Expo Go app
   - Scan the QR code from the terminal (press `?` then `w` to see it in the browser)
   - Or enter the URL manually: `exp://192.168.x.x:8081`

3. **The app will load** and you'll see the onboarding flow or dashboard

### Option 2: Emulator
**Android Emulator**:
```bash
# In the Expo terminal, press 'a' to open Android emulator
```

**iOS Simulator** (Mac only):
```bash
# In the Expo terminal, press 'i' to open iOS simulator
```

## Testing Checklist

### 1. Navigation Flow
- [ ] Open app → See Dashboard
- [ ] Tap "Progress Path" button → See VerticalProgressPath with 250 levels
- [ ] See simplified companion avatar floating above current level
- [ ] See level states:
  - ✓ Green = Completed
  - ▶ Colored = Current level
  - Purple = Available (next level)
  - 🔒 Gray = Locked

### 2. Level Selection
- [ ] Tap current level → Opens FocusJourneyPage
- [ ] See level header with:
  - Realm name
  - Level number
  - Difficulty level (1-10)
  - XP required
- [ ] See "Recommended Next" card
- [ ] See "Required Activities" section (2-4 challenges)
- [ ] See "Bonus Activities" section (exercises)

### 3. Starting a Challenge
- [ ] Tap a challenge activity → Opens challenge (e.g., Focus Hold, Gaze Hold)
- [ ] Complete the challenge
- [ ] Returns to FocusJourneyPage
- [ ] XP should be awarded
- [ ] Level should progress if enough XP earned

### 4. Starting an Exercise
- [ ] Tap an exercise activity → Opens exercise (e.g., Slow Breathing, Box Breathing)
- [ ] Complete the exercise
- [ ] Returns to FocusJourneyPage
- [ ] XP should be awarded

### 5. Mastery Tests (Every 10 Levels)
- [ ] Navigate to level 10, 20, 30, etc.
- [ ] See "Mastery Test" card
- [ ] Tap to start test
- [ ] Complete sequence of multiple challenges
- [ ] Pass test (70%+ score) to unlock next realm

### 6. Progression System
- [ ] Complete several challenges to earn XP
- [ ] Verify level increases when XP threshold reached
- [ ] Verify progress path shows newly completed levels in green
- [ ] Verify current level indicator moves up
- [ ] Verify locked levels remain locked until previous levels completed

### 7. Companion Evolution
Check companion emoji changes at these milestones:
- [ ] Levels 1-25: 🌱 (Seedling)
- [ ] Levels 26-50: 🌿 (Herb)
- [ ] Levels 51-75: ✨ (Sparkles)
- [ ] Levels 76-100: 💫 (Dizzy)
- [ ] Continue through all 10 stages to level 250

### 8. Back Navigation
- [ ] From FocusJourneyPage → Back to VerticalProgressPath
- [ ] From VerticalProgressPath → Back to Dashboard
- [ ] From challenge/exercise → Back to FocusJourneyPage
- [ ] No navigation loops or stuck states

### 9. Difficulty Scaling
Test at different level ranges:
- [ ] **Levels 1-50** (Beginner):
  - 2 beginner challenges (Gaze Hold, Focus Hold, etc.)
  - 1 breathing exercise
  - 1 grounding exercise
  - Duration: Base × 1.0 to 1.1

- [ ] **Levels 51-150** (Intermediate):
  - 2-3 intermediate challenges (Tap Only Correct, Memory Flash, etc.)
  - 1 cognitive exercise
  - Duration: Base × 1.1 to 1.3

- [ ] **Levels 151-250** (Advanced):
  - 3-4 advanced challenges (Impulse Spike, Delay Unlock, etc.)
  - 1-2 advanced exercises
  - Duration: Base × 1.3 to 1.5

### 10. Visual Polish
- [ ] Smooth animations throughout
- [ ] No visual glitches
- [ ] Haptic feedback on taps
- [ ] Colors match realm themes
- [ ] Text is readable
- [ ] No layout issues on your device screen size

## Known Issues

### Non-Critical (Pre-existing)
- TypeScript warnings in some challenge components
- Avatar component has some type issues
- These don't affect Focus Journey functionality

### Critical (Report if found)
- [ ] App crashes
- [ ] Navigation gets stuck
- [ ] Level progression doesn't work
- [ ] Activities don't load
- [ ] XP not awarded

## What Should Work

✅ All 19 challenges accessible
✅ All 25 exercises accessible
✅ 250 levels with proper unlocking
✅ Difficulty scaling (duration + XP)
✅ Mastery tests every 10 levels
✅ XP-based level progression
✅ Companion evolution
✅ Complete navigation flow
✅ Activity completion tracking

## Expected Behavior

### First Launch
1. Onboarding flow
2. Baseline test to determine starting level
3. Dashboard shows progress
4. Tap "Progress Path" to see your journey

### Typical Session
1. Open app → Dashboard
2. Tap progress path button
3. See current level highlighted
4. Tap to see activities
5. Complete 2-4 activities
6. Earn XP and level up
7. Return to path to see progress
8. Watch companion evolve

## Debug Output

To see detailed logs:
```bash
# In Expo terminal, press:
# 'j' - Open debugger
# 'r' - Reload app
# 'shift+m' - Show menu on device
```

## Performance

Expected performance:
- **Smooth 60 FPS** animations
- **< 1 second** navigation between screens
- **Instant** level node tap response
- **No lag** when scrolling progress path

## Reporting Issues

If you find bugs, note:
1. Device type (iPhone/Android model)
2. Screen where issue occurred
3. What you were doing
4. Error messages (if any)
5. Screenshots/screen recording

## Next Steps After Testing

If everything works:
- [ ] Consider adding XP gain animations
- [ ] Add completion celebration effects
- [ ] Track daily streaks
- [ ] Add achievement badges
- [ ] Polish visual effects

If issues found:
- [ ] Report specific problems
- [ ] I'll fix them immediately
- [ ] Re-test

---

**The app is ready to test!** Open the Expo Go app and scan the QR code to begin.
