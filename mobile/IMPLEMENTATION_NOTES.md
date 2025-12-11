# Vertical Progress Path - Implementation Notes

## Quick Start

### 1. Import the Component

```tsx
import { VerticalProgressPath } from '@/components/VerticalProgressPath';
```

### 2. Basic Usage

```tsx
<VerticalProgressPath
  onBack={() => {
    // Navigate back to dashboard
  }}
  onStartChallenge={(challengeType, level) => {
    // Start the challenge
    // challengeType: 'focus_hold' | 'memory_flash' | etc.
    // level: 1-100
  }}
/>
```

## Realm Theme Customization

### Modifying Realm Colors

Edit `mobile/src/lib/focus-realm-themes.ts`:

```typescript
{
  id: 1,
  name: 'Calm',
  theme: 'The Awakening',
  description: 'Begin your journey in stillness and peace',
  colors: {
    primary: '#E8F4F8',      // Main node color when available
    secondary: '#B8D8E8',    // Completed node color
    accent: '#7FB3D5',       // Highlights and text
    glow: 'rgba(127, 179, 213, 0.4)', // Glow effect
  },
  background: {
    top: '#F0F8FF',         // Gradient top color
    bottom: '#E0F0F8',      // Gradient bottom color
  },
  particles: {
    type: 'drift',          // Animation type
    color: '#B8D8E8',       // Particle color
    density: 'low',         // 'low' | 'medium' | 'high'
    speed: 0.3,             // 0.1 - 2.0
  },
  levels: { start: 1, end: 10 },
}
```

### Adding New Particle Types

In `VerticalProgressPath.tsx`, add to `FloatingParticle` component:

```typescript
// Example: Add 'spiral' type
else if (type === 'spiral') {
  Animated.loop(
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: Math.cos(Math.random()) * 50,
        duration: duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: duration,
        useNativeDriver: true,
      }),
    ])
  ).start();
}
```

## Avatar Evolution Customization

### Modify Evolution Stages

Edit `mobile/src/lib/focus-avatar-evolution.ts`:

```typescript
flow: {
  stage: 'flow',
  unitNumber: 4,
  name: 'Flowing Energy',
  description: 'Graceful trails of light follow your movement',
  shape: {
    type: 'orb',          // 'orb' | 'geometric' | 'complex'
    size: 1.3,            // Size multiplier
    edges: 3,             // Number of edges (for geometric)
    complexity: 4,        // 1-10 detail level
  },
  glow: {
    intensity: 0.5,       // 0-1
    radius: 35,           // Glow spread in pixels
    pulseSpeed: 1.2,      // Animation speed (seconds)
    layers: 3,            // Number of glow layers
  },
  trails: {
    enabled: true,
    count: 3,             // Number of trailing particles
    length: 40,           // Trail length in pixels
    fadeSpeed: 0.8,       // Fade animation speed
  },
  effects: {
    sparks: false,
    split: false,
    coreGlow: false,
    geometricPattern: false,
  },
  // ... rest of config
}
```

### Custom Avatar Rendering

To create custom avatar shapes, edit `FocusAvatarRenderer.tsx`:

```typescript
// In the avatar core rendering section
<Animated.View
  style={[
    styles.avatarCore,
    {
      // Add custom shape logic here
      borderRadius: evolution.shape.type === 'custom'
        ? 0  // Square
        : baseSize / 2,  // Circle
    },
  ]}
>
```

## Performance Optimization

### Reduce Particle Count for Low-End Devices

```typescript
// In RealmParticles component
const particleCount = useMemo(() => {
  const baseCount = realm.particles.density === 'high' ? 20
    : realm.particles.density === 'medium' ? 12 : 6;

  // Reduce for low-end devices
  const isLowEnd = /* your device detection logic */;
  return isLowEnd ? Math.floor(baseCount / 2) : baseCount;
}, [realm.particles.density]);
```

### Optimize Avatar Animations

```typescript
// Disable complex animations on older devices
const shouldAnimate = useMemo(() => {
  // Check device capability
  return Platform.OS === 'ios' || Platform.Version >= 28;
}, []);

<FocusAvatarRenderer
  stage={avatarStage}
  realm={currentRealm}
  animated={shouldAnimate}
/>
```

## Styling and Layout

### Adjust Node Spacing

In `VerticalProgressPath.tsx`:

```typescript
const NODE_SIZE = 48;           // Node circle size
const NODE_SPACING = 120;       // Vertical space between nodes
const REALM_HEADER_HEIGHT = 180; // Height reserved for realm header
```

### Modify Scroll Behavior

```typescript
// Auto-scroll offset (how far from top current level appears)
scrollViewRef.current?.scrollTo({
  y: Math.max(0, currentLevelY - SCREEN_HEIGHT / 3), // Change /3 to /2 for higher
  animated: true,
});
```

### Customize Modal Appearance

```typescript
// In the Modal section
<View style={[styles.modalContent, {
  backgroundColor: '#fff',  // Modal background
  borderRadius: 20,        // Corner radius
  padding: 24,             // Inner padding
  width: '85%',            // Width percentage
  maxWidth: 400,           // Max width
}]}>
```

## Animation Timing

### Pulse Animation Speed

```typescript
// Faster pulse
Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, {
      toValue: 1.2,
      duration: 800,  // Reduced from 1200
      useNativeDriver: true,
    }),
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }),
  ])
).start();
```

### Glow Pulse Timing

```typescript
// Slower glow for calmer effect
Animated.loop(
  Animated.sequence([
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: 2000,  // Increased from 1500
      useNativeDriver: true,
    }),
    Animated.timing(glowAnim, {
      toValue: 0.5,
      duration: 2000,
      useNativeDriver: true,
    }),
  ])
).start();
```

## Debugging Tips

### Log Realm Transitions

```typescript
// Add in useEffect or scroll handler
console.log('Current Realm:', currentRealm.name);
console.log('Level:', progress.level);
console.log('Y Position:', currentLevelY);
```

### Visualize Particle Positions

```typescript
// In RealmParticles component
{particles.map((p) => (
  <View
    key={p.id}
    style={{
      position: 'absolute',
      left: p.x - 2,
      top: p.y - 2,
      width: 4,
      height: 4,
      backgroundColor: 'red', // Debug color
    }}
  />
))}
```

### Check Avatar Evolution

```typescript
const avatarStage = getAvatarStageForLevel(progress.level);
const evolution = FOCUS_AVATAR_EVOLUTIONS[avatarStage];
console.log('Avatar Stage:', avatarStage);
console.log('Evolution:', evolution.name);
console.log('Effects Enabled:', evolution.effects);
```

## Common Issues and Solutions

### Issue: Particles Not Animating

**Solution**: Check that `animated` prop is true and `useNativeDriver: true` is set:

```typescript
<FloatingParticle
  // ... props
  animated={true}
/>
```

### Issue: Avatar Not Appearing

**Solution**: Verify context providers are wrapping the component:

```tsx
<GameContextProvider>
  <AttentionAvatarContextProvider>
    <VerticalProgressPath {...props} />
  </AttentionAvatarContextProvider>
</GameContextProvider>
```

### Issue: Scroll Performance Lag

**Solution**: Reduce particle count and use simpler animations:

```typescript
// Reduce particles
const particleCount = 6; // Instead of 20

// Disable complex effects on scroll
const [isScrolling, setIsScrolling] = useState(false);
```

### Issue: Colors Not Blending Smoothly

**Solution**: Adjust gradient locations:

```typescript
<LinearGradient
  colors={[color1, color2, color3]}
  locations={[0, 0.8, 1]}  // Try different values
  // ...
/>
```

## Testing Scenarios

### Test All Realms

```typescript
// Temporarily override level for testing
const testLevel = 45; // Test Realm 5 (Balance)
const currentRealm = getRealmForLevel(testLevel);
```

### Test Avatar Evolutions

```typescript
// Cycle through all stages
const stages = [
  'calm', 'clarity', 'discipline', 'flow', 'balance',
  'precision', 'reaction', 'multi_focus', 'mastery', 'full_focus'
];

// Render each stage
<FocusAvatarRenderer stage={stages[currentIndex]} realm={realm} />
```

### Test Edge Cases

- Level 1 (first level)
- Level 10 (realm transition)
- Level 50 (midpoint)
- Level 100 (final level)
- Locked vs Available vs Completed states

## Accessibility Improvements

### Add Screen Reader Labels

```tsx
<TouchableOpacity
  accessibilityLabel={`Level ${level}, ${status}`}
  accessibilityHint="Tap to view level details"
  // ...
>
```

### Increase Touch Target Size

```typescript
const TOUCH_TARGET_SIZE = 48; // Minimum recommended

<TouchableOpacity
  style={{
    minWidth: TOUCH_TARGET_SIZE,
    minHeight: TOUCH_TARGET_SIZE,
  }}
>
```

### Color Contrast

Ensure text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

Use online tools to verify: https://webaim.org/resources/contrastchecker/

## Advanced Customizations

### Add Realm Sound Effects

```typescript
import { Audio } from 'expo-av';

const playRealmSound = async (realmId: number) => {
  const sound = new Audio.Sound();
  await sound.loadAsync(require(`@/assets/sounds/realm-${realmId}.mp3`));
  await sound.playAsync();
};

// Call on realm entry
useEffect(() => {
  playRealmSound(currentRealm.id);
}, [currentRealm.id]);
```

### Add Haptic Feedback on Level Unlock

```typescript
import * as Haptics from 'expo-haptics';

useEffect(() => {
  if (/* level just unlocked */) {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  }
}, [progress.level]);
```

### Add Confetti on Realm Completion

```typescript
import ConfettiCannon from 'react-native-confetti-cannon';

{showConfetti && (
  <ConfettiCannon
    count={200}
    origin={{ x: SCREEN_WIDTH / 2, y: 0 }}
    fadeOut
  />
)}
```

## Deployment Checklist

- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Verify all 10 realms load
- [ ] Check avatar evolution at each unit
- [ ] Test scroll performance with all 100 levels
- [ ] Verify modal interactions
- [ ] Test with low battery mode
- [ ] Check memory usage
- [ ] Verify accessibility features
- [ ] Test with screen reader
- [ ] Validate color contrast
- [ ] Test offline functionality
- [ ] Check bundle size impact

## Resources

- **React Native Animations**: https://reactnative.dev/docs/animated
- **Expo Linear Gradient**: https://docs.expo.dev/versions/latest/sdk/linear-gradient/
- **Color Palette Generator**: https://coolors.co/
- **Accessibility Testing**: https://www.deque.com/axe/
- **Performance Monitoring**: React Native Performance Monitor

## Support and Feedback

For questions or issues:
1. Check this implementation guide
2. Review the main design guide (`VERTICAL_PROGRESS_PATH_GUIDE.md`)
3. Inspect component code with comments
4. Test with debugging tips above

Happy coding! 🚀
