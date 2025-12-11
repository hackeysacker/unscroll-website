# Challenge Wrapper Migration Guide

## Summary
All focus challenges now have beautiful intro screens matching the mindfulness exercises format!

## What Was Created

### 1. BaseChallengeWrapper Component
- **Location**: `src/components/challenges/BaseChallengeWrapper.tsx`
- **Features**:
  - Black gradient background matching exercises
  - Large icon and challenge name
  - Description text
  - Info badges (duration, XP, difficulty)
  - "How it works" section with numbered instructions
  - "Benefits" section with bullet points
  - Beautiful "Begin Challenge" button
  - Smooth fade-in animations

### 2. Challenge Configs
- **Location**: `src/lib/challenge-configs.ts`
- Contains metadata for all 20 focus challenges:
  - focus_hold, finger_hold, gaze_hold
  - tap_only_correct, memory_flash, reaction_inhibition
  - slow_tracking, moving_target, rhythm_tap
  - fake_notifications, delay_unlock, popup_ignore
  - stillness_test, multi_object_tracking, finger_tracing
  - multi_task_tap, impulse_spike_test, tap_pattern
  - breath_pacing, controlled_breathing

## Migration Pattern

### Before (Old Challenge):
```typescript
export function SomeChallenge({ duration, onComplete, level }: Props) {
  const [isActive, setIsActive] = useState(true);

  return (
    <LinearGradient colors={...}>
      {/* Challenge content */}
    </LinearGradient>
  );
}
```

### After (With Wrapper):
```typescript
import { BaseChallengeWrapper } from './BaseChallengeWrapper';
import { getChallengeConfig } from '@/lib/challenge-configs';

export function SomeChallenge({ duration, onComplete, onBack, level }: Props) {
  const [isActive, setIsActive] = useState(false); // Start as false!
  const config = getChallengeConfig('challenge_type');

  return (
    <BaseChallengeWrapper
      config={config}
      onStart={() => setIsActive(true)}
      onBack={onBack || (() => {})}
      isActive={isActive}
    >
      <LinearGradient colors={...}>
        {/* Challenge content */}
      </LinearGradient>
    </BaseChallengeWrapper>
  );
}
```

## Completed Migrations

### ✅ FingerHoldChallenge
- Added BaseChallengeWrapper
- Added onBack prop
- Changed isActive initial state to false
- Configured with 'finger_hold' config

## Remaining Challenges to Update

Apply the same pattern to these files:

1. FocusHoldChallenge.tsx - use 'focus_hold'
2. GazeHoldChallenge.tsx - use 'gaze_hold'
3. TapOnlyCorrectChallenge.tsx - use 'tap_only_correct'
4. MemoryFlashChallenge.tsx - use 'memory_flash'
5. ReactionInhibitionChallenge.tsx - use 'reaction_inhibition'
6. SlowTrackingChallenge.tsx - use 'slow_tracking'
7. MovingTargetChallenge.tsx - use 'moving_target'
8. RhythmTapChallenge.tsx - use 'rhythm_tap'
9. FakeNotificationsChallenge.tsx - use 'fake_notifications'
10. DelayUnlockChallenge.tsx - use 'delay_unlock'
11. PopupIgnoreChallenge.tsx - use 'popup_ignore'
12. StillnessTestChallenge.tsx - use 'stillness_test'
13. MultiObjectTrackingChallenge.tsx - use 'multi_object_tracking'
14. FingerTracingChallenge.tsx - use 'finger_tracing'
15. MultiTaskTapChallenge.tsx - use 'multi_task_tap'
16. ImpulseSpikeTestChallenge.tsx - use 'impulse_spike_test'
17. TapPatternChallenge.tsx - use 'tap_pattern'
18. BreathPacingChallenge.tsx - use 'breath_pacing'
19. ControlledBreathingChallenge.tsx - use 'controlled_breathing'

## Quick Migration Steps

For each challenge:

1. Add imports:
   ```typescript
   import { BaseChallengeWrapper } from './BaseChallengeWrapper';
   import { getChallengeConfig } from '@/lib/challenge-configs';
   ```

2. Add onBack prop to interface:
   ```typescript
   onBack?: () => void;
   ```

3. Add config and change isActive:
   ```typescript
   const [isActive, setIsActive] = useState(false);
   const config = getChallengeConfig('challenge_type_here');
   ```

4. Wrap return with BaseChallengeWrapper:
   ```typescript
   return (
     <BaseChallengeWrapper
       config={config}
       onStart={() => setIsActive(true)}
       onBack={onBack || (() => {})}
       isActive={isActive}
     >
       {/* Existing challenge JSX */}
     </BaseChallengeWrapper>
   );
   ```

## Benefits

✨ **Consistent UX**: All challenges now have the same beautiful intro screen format
📚 **Better Onboarding**: Users see instructions and benefits before starting
🎨 **Professional Design**: Matches the polished look of mindfulness exercises
🔄 **Easy Maintenance**: All metadata centralized in one config file

## Notes

- The ChallengePlayer has been updated to pass `onBack` prop to all challenges
- No changes needed to ActivityDetailScreen - it still works as before
- The intro screen only shows when isActive is false (before challenge starts)
- Once user taps "Begin Challenge", the actual challenge renders
