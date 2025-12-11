# Face Tracking Implementation ✅

## Summary

Face tracking has been implemented to detect when users look away from the screen during challenges. When a user looks away, their focus score is penalized and a warning is displayed.

## Components Created

### 1. useFaceTracking Hook ✅
**File**: [mobile/src/hooks/useFaceTracking.ts](mobile/src/hooks/useFaceTracking.ts)

**Features**:
- Initializes camera permission and face tracking
- Detects when user is looking at screen vs looking away
- Tracks look-away count and total look-away time
- Calculates focus penalty (5% per second looking away)
- Provides callbacks for look-away events
- Works on both iOS (ARKit/Vision) and Android (Mock)

**Usage**:
```typescript
const faceTracking = useFaceTracking({
  enabled: isActive,
  onLookAway: () => {
    // Handle look away
  },
  onLookBack: () => {
    // Handle look back
  },
  lookAwayThreshold: 0.5, // Trigger after 0.5 seconds
  minAttentionScore: 0.5, // Minimum score to consider "looking"
});

// Access state
faceTracking.isLookingAtScreen
faceTracking.lookAwayCount
faceTracking.getFocusPenalty() // Returns penalty percentage
```

### 2. LookAwayWarning Component ✅
**File**: [mobile/src/components/LookAwayWarning.tsx](mobile/src/components/LookAwayWarning.tsx)

**Features**:
- Displays prominent red warning when user looks away
- Shows attention score bar
- Displays look-away count
- Animated shake effect on appearance
- Fades in/out smoothly

**Usage**:
```typescript
<LookAwayWarning
  isLookingAway={!faceTracking.isLookingAtScreen && faceTracking.isFaceDetected}
  attentionScore={faceTracking.attentionScore}
  lookAwayCount={faceTracking.lookAwayCount}
/>
```

## Integration Example

### FocusHoldChallenge (Completed) ✅
**File**: [mobile/src/components/challenges/FocusHoldChallenge.tsx](mobile/src/components/challenges/FocusHoldChallenge.tsx)

**Changes made**:
1. Added imports:
```typescript
import { useFaceTracking } from '@/hooks/useFaceTracking';
import { LookAwayWarning } from '@/components/LookAwayWarning';
```

2. Initialize face tracking:
```typescript
const faceTracking = useFaceTracking({
  enabled: isActive,
  onLookAway: () => {
    if (isFocusing) {
      focusBreaksRef.current += 1;
      currentStreakRef.current = 0;
    }
  },
  lookAwayThreshold: 0.5,
});
```

3. Apply penalty to score:
```typescript
const focusPenalty = faceTracking.getFocusPenalty();
const score = Math.min(100, Math.max(0, accuracy - focusPenalty));
```

4. Add warning component:
```typescript
<LookAwayWarning
  isLookingAway={!faceTracking.isLookingAtScreen && faceTracking.isFaceDetected}
  attentionScore={faceTracking.attentionScore}
  lookAwayCount={faceTracking.lookAwayCount}
/>
```

## How It Works

### Detection Logic

1. **Face Tracking API**: Uses existing iOS ARKit/Vision framework or Android mock
2. **Attention Scoring**: Monitors face position, gaze direction, and presence
3. **Look Away Detection**: Triggers when:
   - Face not detected OR
   - Attention score < threshold (default 0.5) OR
   - Gaze direction not centered

4. **Penalties**:
   - **5% penalty per second** looking away
   - **Focus breaks counter** incremented
   - **Current streak** reset to 0

### User Experience

**When User Looks at Screen**:
- ✅ Normal challenge gameplay
- ✅ Score accumulates
- ✅ No warnings

**When User Looks Away**:
- ⚠️ Red warning appears after 0.5 seconds
- ⚠️ "Look at the screen!" message
- ⚠️ Haptic vibration warning
- ⚠️ Focus breaks counter increases
- ⚠️ Score penalty applied

**When User Looks Back**:
- ✅ Warning fades out
- ✅ Look-away time recorded
- ✅ Normal gameplay resumes

## Integration Steps for Other Challenges

To add face tracking to any challenge:

### Step 1: Add Imports
```typescript
import { useFaceTracking } from '@/hooks/useFaceTracking';
import { LookAwayWarning } from '@/components/LookAwayWarning';
```

### Step 2: Initialize Hook
```typescript
const faceTracking = useFaceTracking({
  enabled: isActive,
  onLookAway: () => {
    // Penalize score, increment breaks, etc.
  },
  lookAwayThreshold: 0.5,
});
```

### Step 3: Apply Penalty to Score
```typescript
const focusPenalty = faceTracking.getFocusPenalty();
const finalScore = baseScore - focusPenalty;
```

### Step 4: Add Warning Component
```typescript
<LookAwayWarning
  isLookingAway={!faceTracking.isLookingAtScreen && faceTracking.isFaceDetected}
  attentionScore={faceTracking.attentionScore}
  lookAwayCount={faceTracking.lookAwayCount}
/>
```

## Challenges to Integrate

### High Priority (Focus-Based) 🔴
- [ ] FingerHoldChallenge
- [ ] StillnessTestChallenge
- [ ] SlowTrackingChallenge
- [ ] BreathPacingChallenge
- [ ] ControlledBreathingChallenge

### Medium Priority (Attention-Based) 🟡
- [ ] TapOnlyCorrectChallenge
- [ ] MemoryFlashChallenge
- [ ] ReactionInhibitionChallenge
- [ ] MovingTargetChallenge
- [ ] RhythmTapChallenge

### Lower Priority (Already Complex) 🟢
- [ ] FakeNotificationsChallenge
- [ ] PopupIgnoreChallenge
- [ ] ImpulseSpikeTestChallenge
- [ ] MultiTaskTapChallenge
- [ ] DelayUnlockChallenge
- [ ] FingerTracingChallenge
- [ ] MultiObjectTrackingChallenge
- [ ] TapPatternChallenge

## Technical Details

### Face Tracking Data Structure
```typescript
interface FaceTrackingData {
  isFacePresent: boolean;        // Face detected
  faceCenterX: number;            // 0-1 horizontal position
  faceCenterY: number;            // 0-1 vertical position
  faceDistance: number;           // Distance from camera
  gazeDirection: 'centered' | 'left' | 'right' | 'up' | 'down' | 'unknown';
  attentionScore: number;         // 0-1 attention level
  isTracking: boolean;            // Tracking active
  trackingMode: 'arkit' | 'vision' | 'none';
}
```

### Platform Support
- **iOS with TrueDepth (iPhone X+)**: ARKit - Precise gaze tracking
- **iOS without TrueDepth**: Vision - Basic face detection
- **Android**: Mock tracking (simulated data for development)
- **Expo Go**: Mock tracking (native module not available)

### Permissions Required
- **Camera**: Required for face tracking
- **Fallback**: If permission denied or unavailable, challenges work without face tracking

## Benefits

1. **Increased Engagement**: Users stay more focused knowing they're being monitored
2. **Better Training**: Discourages distraction and multitasking
3. **Accurate Scoring**: Reflects actual attention level
4. **Real-time Feedback**: Immediate warning helps users correct behavior
5. **Gamification**: Look-away count becomes a metric to minimize

## Future Enhancements

- [ ] Add look-away statistics to challenge results
- [ ] Display average attention score in insights
- [ ] Create "Perfect Focus" achievement (no look-aways)
- [ ] Add difficulty modifier (stricter on higher levels)
- [ ] Implement graduated penalties (longer away = higher penalty rate)
- [ ] Add calibration screen for optimal tracking
- [ ] Support landscape mode face tracking

---

**Status**: ✅ Core Implementation Complete
**Date**: December 9, 2025
**Next Step**: Integrate into remaining 18 challenges
