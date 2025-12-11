# Settings Integration Guide

This guide explains how to properly integrate user settings into challenge components and other parts of the app.

## Overview

The app has the following user-configurable settings:
- **Haptic Feedback** - Vibrations during interactions
- **Sound Effects** - Audio cues and feedback
- **Notifications** - Daily training reminders
- **Auto-Progress** - Automatically move to next challenge
- **Reduced Motion** - Minimize or disable animations

## Using the Hooks

### 1. useHaptics Hook

**Import:**
```tsx
import { useHaptics } from '@/hooks/useHaptics';
```

**Usage:**
```tsx
function MyChallenge() {
  const haptics = useHaptics();

  const handleTap = () => {
    haptics.impactLight();  // Light tap feedback
    // Your tap logic
  };

  const handleSuccess = () => {
    haptics.notificationSuccess();  // Success vibration
    // Your success logic
  };

  const handleError = () => {
    haptics.notificationError();  // Error vibration
    // Your error logic
  };
}
```

**Available Methods:**
- `haptics.impactLight()` - Light impact (button taps, toggles)
- `haptics.impactMedium()` - Medium impact (important actions)
- `haptics.impactHeavy()` - Heavy impact (major events)
- `haptics.notificationSuccess()` - Success feedback
- `haptics.notificationWarning()` - Warning feedback
- `haptics.notificationError()` - Error feedback
- `haptics.selectionChanged()` - Selection/scroll feedback
- `haptics.isEnabled` - Boolean indicating if haptics are enabled

**DO NOT** use `Haptics.*` directly. Always use the hook to respect user settings.

### 2. useAnimations Hook

**Import:**
```tsx
import { useAnimations } from '@/hooks/useAnimations';
```

**Usage with Animated API:**
```tsx
function MyChallenge() {
  const animations = useAnimations();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animations.normal,  // Respects reducedMotion
      useNativeDriver: true,
    }).start();
  }, [animations]);

  // Or use spring animations
  const handlePress = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.2,
      ...animations.spring({ friction: 8, tension: 50 }),
      useNativeDriver: true,
    }).start();
  };
}
```

**Available Properties:**
- `animations.fast` - 200ms (or 0ms if reducedMotion)
- `animations.normal` - 400ms (or 0ms if reducedMotion)
- `animations.slow` - 600ms (or 0ms if reducedMotion)
- `animations.verySlow` - 1000ms (or 0ms if reducedMotion)
- `animations.duration(ms)` - Custom duration
- `animations.spring(config)` - Spring configuration
- `animations.enabled` - Boolean indicating if animations are enabled
- `animations.reducedMotion` - Boolean indicating if reduced motion is enabled

**Examples:**

```tsx
// Simple fade-in
Animated.timing(opacity, {
  toValue: 1,
  duration: animations.fast,
  useNativeDriver: true,
}).start();

// Custom duration
Animated.timing(translateY, {
  toValue: 0,
  duration: animations.duration(800),
  useNativeDriver: true,
}).start();

// Spring animation
Animated.spring(scale, {
  toValue: 1,
  ...animations.spring({ friction: 7, tension: 40 }),
  useNativeDriver: true,
}).start();

// Conditional animations
if (animations.enabled) {
  // Do fancy animation
} else {
  // Just set the value directly
  opacity.setValue(1);
}
```

### 3. useSettings Hook

**Import:**
```tsx
import { useSettings } from '@/contexts/SettingsContext';
```

**Usage:**
```tsx
function MyChallenge() {
  const { settings, updateSettings } = useSettings();

  // Check individual settings
  if (settings?.soundEnabled) {
    playSound();
  }

  if (settings?.autoProgress) {
    setTimeout(goToNextChallenge, 2000);
  }

  // Update settings
  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };
}
```

**Available Settings:**
- `settings.vibrationEnabled` - boolean
- `settings.soundEnabled` - boolean
- `settings.notificationsEnabled` - boolean
- `settings.darkMode` - boolean
- `settings.autoProgress` - boolean (default: true)
- `settings.reducedMotion` - boolean (default: false)

## Best Practices

### 1. Always Respect Settings

❌ **WRONG:**
```tsx
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
```

✅ **CORRECT:**
```tsx
const haptics = useHaptics();
haptics.impactLight();
```

### 2. Use Appropriate Feedback Intensity

- **Light** - Toggles, selections, minor interactions
- **Medium** - Button presses, important actions
- **Heavy** - Major events, achievements, errors

### 3. Animation Duration Guidelines

- **fast (200ms)** - Quick transitions, micro-interactions
- **normal (400ms)** - Standard animations, slides, fades
- **slow (600ms)** - Dramatic reveals, important transitions
- **verySlow (1000ms)** - Celebration animations, major events

### 4. Check Settings Before Playing Sounds

```tsx
const { settings } = useSettings();

const playSuccessSound = () => {
  if (settings?.soundEnabled) {
    Audio.Sound.createAsync(require('@/assets/sounds/success.mp3'));
  }
};
```

### 5. Implement Auto-Progress Properly

```tsx
const { settings } = useSettings();

const handleChallengeComplete = () => {
  haptics.notificationSuccess();

  if (settings?.autoProgress) {
    // Auto-advance after a short delay
    setTimeout(() => {
      onComplete();
    }, 2000);
  } else {
    // Show "Continue" button
    setShowContinueButton(true);
  }
};
```

## Example: Complete Challenge Component

```tsx
import { useHaptics } from '@/hooks/useHaptics';
import { useAnimations } from '@/hooks/useAnimations';
import { useSettings } from '@/contexts/SettingsContext';

export function MyChallenge({ onComplete }: Props) {
  const haptics = useHaptics();
  const animations = useAnimations();
  const { settings } = useSettings();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Entrance animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animations.normal,
      useNativeDriver: true,
    }).start();
  }, [animations]);

  const handleTap = () => {
    haptics.impactLight();

    if (settings?.soundEnabled) {
      playTapSound();
    }

    // Your tap logic
  };

  const handleSuccess = () => {
    haptics.notificationSuccess();

    if (settings?.soundEnabled) {
      playSuccessSound();
    }

    if (settings?.autoProgress) {
      setTimeout(onComplete, 2000);
    } else {
      setShowContinueButton(true);
    }
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {/* Your challenge UI */}
    </Animated.View>
  );
}
```

## Migration Checklist

When updating an existing challenge:

- [ ] Replace all `Haptics.*` calls with `useHaptics()` hook
- [ ] Replace hardcoded animation durations with `useAnimations()` values
- [ ] Check `settings.soundEnabled` before playing sounds
- [ ] Implement `settings.autoProgress` for challenge completion
- [ ] Add entrance/exit animations that respect `reducedMotion`
- [ ] Test with all settings enabled/disabled

## Testing

To test your implementation:

1. Go to Settings
2. Toggle each setting on/off
3. Go back to your challenge
4. Verify that:
   - Vibrations only happen when enabled
   - Sounds only play when enabled
   - Animations are instant when reducedMotion is enabled
   - Auto-progress works when enabled
   - Manual continue button shows when auto-progress is disabled
