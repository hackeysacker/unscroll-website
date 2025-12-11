# Mobile App Migration Guide

This document outlines what has been completed and what needs to be done to finish porting the FocusFlow web app to React Native.

## ✅ Completed

### 1. Project Structure
- ✅ Created `webapp/` folder with all original web app files
- ✅ Created `mobile/` folder with React Native/Expo setup
- ✅ Basic Expo configuration (package.json, app.json, tsconfig.json, babel.config.js)

### 2. Core Utilities (100% Complete)
- ✅ **Types** (`mobile/src/types/index.ts`) - All type definitions ported
- ✅ **Storage** (`mobile/src/lib/storage.ts`) - Adapted for AsyncStorage (async/await)
- ✅ **Utils** (`mobile/src/lib/utils.ts`) - UUID generation, class name utility
- ✅ **Game Mechanics** (`mobile/src/lib/game-mechanics.ts`) - All game logic ported
- ✅ **Heart Mechanics** (`mobile/src/lib/heart-mechanics.ts`) - Heart system ported (UUID replaced)
- ✅ **Badge Mechanics** (`mobile/src/lib/badge-mechanics.ts`) - Badge system ported (UUID replaced)

### 3. Contexts (Example Provided)
- ✅ **AuthContext** (`mobile/src/contexts/AuthContext.tsx`) - Fully ported as example
- ⏳ **GameContext** - Needs porting (async storage operations)
- ⏳ **SettingsContext** - Needs porting
- ⏳ **ThemeContext** - Needs porting

## ⏳ In Progress / Needs Completion

### 1. Contexts (3 remaining)
All contexts need to be adapted for React Native:
- Convert `localStorage` calls to async `AsyncStorage` calls
- Handle async operations with `useEffect` and state
- Example pattern shown in `AuthContext.tsx`

**Files to port:**
- `webapp/src/contexts/GameContext.tsx` → `mobile/src/contexts/GameContext.tsx`
- `webapp/src/contexts/SettingsContext.tsx` → `mobile/src/contexts/SettingsContext.tsx`
- `webapp/src/contexts/ThemeContext.tsx` → `mobile/src/contexts/ThemeContext.tsx`

### 2. Components (All need porting)

#### Onboarding Components (15 files)
- `Welcome.tsx`
- `PatternInterrupt.tsx`
- `HabitIntake.tsx`
- `AttentionBaselineTest.tsx`
- `HabitGraph.tsx`
- `PersonalGoalBuilder.tsx`
- `DynamicPlanCreation.tsx`
- `EmotionalMomentum.tsx`
- `FirstUpsell.tsx`
- `UserTypeTag.tsx`
- `PermissionRequests.tsx`
- `FirstWin.tsx`
- `FinalConfirmation.tsx`
- `GoalSelection.tsx`
- `BaselineTest.tsx`

**Conversion needed:**
- Replace HTML elements (`div`, `button`, `input`) with React Native (`View`, `TouchableOpacity`, `TextInput`)
- Replace Tailwind classes with `StyleSheet.create()`
- Replace `onClick` with `onPress`
- Handle form inputs differently (React Native TextInput)

#### Challenge Components (20+ files)
All challenge components in `webapp/src/components/challenges/` need porting:
- `FocusHoldChallenge.tsx`
- `FingerHoldChallenge.tsx`
- `SlowTrackingChallenge.tsx`
- `TapOnlyCorrectChallenge.tsx`
- `BreathPacingChallenge.tsx`
- `FakeNotificationsChallenge.tsx`
- `LookAwayChallenge.tsx`
- `DelayUnlockChallenge.tsx`
- `AntiScrollSwipeChallenge.tsx`
- `MemoryFlashChallenge.tsx`
- `ReactionInhibitionChallenge.tsx`
- `MultiObjectTrackingChallenge.tsx`
- `RhythmTapChallenge.tsx`
- `StillnessTestChallenge.tsx`
- `ImpulseSpikeTestChallenge.tsx`
- `FingerTracingChallenge.tsx`
- `MultiTaskTapChallenge.tsx`
- `PopupIgnoreChallenge.tsx`
- `ControlledBreathingChallenge.tsx`
- `ResetChallenge.tsx`

**Key adaptations:**
- Touch events: `onMouseDown` → `onPressIn`, `onMouseUp` → `onPressOut`
- Animations: Use `react-native-reanimated` instead of CSS animations
- Canvas/SVG: Use `react-native-svg` for graphics
- Gestures: Use `react-native-gesture-handler` for complex gestures

#### Main Components
- `Dashboard.tsx` - Main home screen
- `ChallengePlayer.tsx` - Challenge selection and player
- `LevelPage.tsx` - Level selection page
- `ProgressTree.tsx` - Progress visualization
- `SkillTree.tsx` - Skill tree visualization
- `Insights.tsx` - Analytics and stats
- `Settings.tsx` - App settings
- `Premium.tsx` - Premium upsell
- `PersonalizedTrainingPlan.tsx` - Training recommendations
- `WindDownMode.tsx` - Wind-down mode
- `CornerHeartDisplay.tsx` - Heart display component
- `HeartRefillDialog.tsx` - Heart refill dialog
- `ErrorBoundary.tsx` - Error handling

### 3. Navigation
- ⏳ Set up Expo Router structure
- ⏳ Create navigation between screens
- ⏳ Handle deep linking if needed

**Files to create:**
- `mobile/app/(tabs)/` - Tab navigation structure
- `mobile/app/dashboard.tsx`
- `mobile/app/challenge/[id].tsx`
- `mobile/app/level/[id].tsx`
- etc.

### 4. UI Components
All Radix UI components need React Native equivalents:
- Use `react-native` primitives (View, Text, TouchableOpacity, etc.)
- Create custom components for complex UI (modals, dropdowns, etc.)
- Consider using libraries like `react-native-paper` or `react-native-elements` for common components

### 5. Styling
- Replace all Tailwind classes with `StyleSheet.create()`
- Create a theme system for colors, spacing, typography
- Handle dark mode with React Native's `useColorScheme`

### 6. Platform-Specific Features
- **Haptics**: Use `expo-haptics` for tactile feedback
- **Notifications**: Use `expo-notifications` for push notifications
- **Audio**: Use `expo-av` for sound effects
- **Vibration**: Use `expo-haptics` or `react-native` Vibration API

## Migration Patterns

### Storage Pattern
```typescript
// Web (synchronous)
saveToStorage(key, data);
const data = loadFromStorage<Type>(key);

// Mobile (async)
await saveToStorage(key, data);
const data = await loadFromStorage<Type>(key);
```

### Component Pattern
```typescript
// Web
<div className="flex items-center">
  <button onClick={handleClick}>Click</button>
</div>

// Mobile
<View style={styles.container}>
  <TouchableOpacity onPress={handleClick}>
    <Text>Click</Text>
  </TouchableOpacity>
</View>
```

### Styling Pattern
```typescript
// Web (Tailwind)
<div className="bg-blue-500 p-4 rounded-lg">

// Mobile (StyleSheet)
<View style={styles.card}>
// ...
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
  },
});
```

## Testing Checklist

- [ ] All contexts load and save data correctly
- [ ] Onboarding flow works end-to-end
- [ ] All challenge types function correctly
- [ ] Navigation between screens works
- [ ] Heart system updates correctly
- [ ] Badge system unlocks correctly
- [ ] Settings persist correctly
- [ ] Dark mode works
- [ ] Notifications work (if implemented)
- [ ] Haptics work for interactions
- [ ] App works on both iOS and Android

## Estimated Time

- Contexts: 2-3 hours
- Components: 20-30 hours (depending on complexity)
- Navigation: 2-3 hours
- Styling: 5-8 hours
- Testing & Bug Fixes: 5-10 hours

**Total: ~40-55 hours of development time**

## Next Steps

1. Port remaining contexts (GameContext, SettingsContext, ThemeContext)
2. Port onboarding components (start with Welcome, then work through flow)
3. Port Dashboard component
4. Port ChallengePlayer and one challenge type as example
5. Port remaining challenges
6. Port other main components
7. Set up navigation
8. Test on devices
9. Polish UI/UX for mobile

