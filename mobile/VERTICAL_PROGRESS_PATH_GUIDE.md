# Vertical Progress Path - Complete Design Guide

## Overview

The Vertical Progress Path is a full vertical world that users scroll downward through as they improve their focus and attention training. This system replaces the previous space-themed progress path with a calm, modern, and cohesive journey through 10 themed realms.

## Architecture

### Core Components

1. **VerticalProgressPath.tsx** - Main component
2. **focus-realm-themes.ts** - Realm definitions and theming
3. **focus-avatar-evolution.ts** - Avatar evolution system
4. **FocusAvatarRenderer.tsx** - Avatar rendering with effects

### File Locations

```
mobile/src/
├── components/
│   ├── VerticalProgressPath.tsx          # Main progress path component
│   └── FocusAvatarRenderer.tsx           # Avatar rendering
├── lib/
│   ├── focus-realm-themes.ts              # 10 realm themes
│   └── focus-avatar-evolution.ts          # Avatar evolution stages
```

## 10 Themed Realms

Each realm represents a unit with 10 levels (100 total levels).

### Unit 1: Calm (Levels 1-10)
- **Theme**: The Awakening
- **Colors**: Soft blues and whites
- **Particles**: Slow drifting particles
- **Description**: Begin your journey in stillness and peace
- **Avatar Stage**: Soft white light

### Unit 2: Clarity (Levels 11-20)
- **Theme**: The Illumination
- **Colors**: Golden yellows
- **Particles**: Sparkling lights
- **Description**: See through the fog with crystal vision
- **Avatar Stage**: Sharper edges

### Unit 3: Discipline (Levels 21-30)
- **Theme**: The Forging
- **Colors**: Earthy browns
- **Particles**: Geometric shapes
- **Description**: Build unbreakable mental fortitude
- **Avatar Stage**: Denser glow

### Unit 4: Flow (Levels 31-40)
- **Theme**: The Current
- **Colors**: Ocean blues
- **Particles**: Wave patterns
- **Description**: Move with effortless grace and rhythm
- **Avatar Stage**: Light energy trails

### Unit 5: Balance (Levels 41-50)
- **Theme**: The Equilibrium
- **Colors**: Purple tones
- **Particles**: Pulsing orbs
- **Description**: Find harmony between effort and ease
- **Avatar Stage**: Stable color core

### Unit 6: Precision (Levels 51-60)
- **Theme**: The Refinement
- **Colors**: Silver and grey
- **Particles**: Geometric patterns
- **Description**: Master perfect control and accuracy
- **Avatar Stage**: Defined geometric shape

### Unit 7: Reaction (Levels 61-70)
- **Theme**: The Lightning
- **Colors**: Bright oranges
- **Particles**: Fast sparkles
- **Description**: Achieve instantaneous response
- **Avatar Stage**: Small sparks

### Unit 8: Multi Focus (Levels 71-80)
- **Theme**: The Fractured
- **Colors**: Teal and cyan
- **Particles**: Flowing energy
- **Description**: Divide attention without losing strength
- **Avatar Stage**: Brief split animations

### Unit 9: Mastery (Levels 81-90)
- **Theme**: The Ascension
- **Colors**: Deep purple
- **Particles**: Pulsing energy
- **Description**: Transcend ordinary limitations
- **Avatar Stage**: Inner core illumination

### Unit 10: Full Focus (Levels 91-100)
- **Theme**: The Zenith
- **Colors**: Golden radiance
- **Particles**: Intense sparkles
- **Description**: Complete union of mind and attention
- **Avatar Stage**: Strong finished glowing form

## Avatar Evolution System

The avatar evolves once per unit (10 total evolutions), gaining new visual features:

### Evolution Properties

Each stage includes:
- **Shape complexity** (orb → geometric → complex)
- **Glow intensity** (0.3 → 1.0)
- **Glow layers** (1 → 7 layers)
- **Energy trails** (unlocked at Flow stage)
- **Special effects** (sparks, splits, core glow, patterns)

### Visual Effects by Stage

1. **Calm** - Simple soft white orb
2. **Clarity** - Defined edges appear
3. **Discipline** - Intensified glow
4. **Flow** - Energy trails begin
5. **Balance** - Inner core glows
6. **Precision** - Geometric shape with patterns
7. **Reaction** - Sparks appear
8. **Multi Focus** - Split animation effect
9. **Mastery** - Full illuminated core
10. **Full Focus** - Complete form with all effects

## Level Node System

### Node States

1. **Locked** 🔒
   - Grey/dim appearance
   - 40% opacity
   - No glow
   - Cannot be interacted with

2. **Available** ✨
   - Full color from realm theme
   - Pulsing glow animation
   - Animated border
   - Tap to see details

3. **Completed** ✅
   - Realm secondary color
   - Reduced glow
   - Check mark indicator

4. **Perfect** ⭐
   - Realm accent color
   - Gold border
   - Star badge

### Node Interactions

- Tap any node to see level details
- Modal shows:
  - Level number
  - Challenge name
  - Description
  - Difficulty (star rating)
  - Start button (if unlocked)

## Animations and Motion

### Background Transitions

- Smooth vertical gradients between realms
- 3-color blending (current, bottom, next top)
- Locations: [0, 0.7, 1] for smooth fade

### Floating Particles

Different particle types per realm:
- **Drift** - Gentle up/down floating
- **Wave** - Sine wave motion
- **Geometric** - Sharp shapes
- **Sparkle** - Twinkling stars
- **Flow** - Smooth flowing lines
- **Pulse** - Fade in/out

### Avatar Movement

- Floats gently at current level position
- Smooth up/down animation (-15px to +15px)
- Glow pulse (0.5 to 1.0 opacity)
- Gentle rotation for advanced stages
- Trail particles follow movement

## Layout Structure

### Vertical Spacing

```
[Top Padding: 200px]
├─ Realm 1 Header (180px)
├─ Level 1 (node + 120px spacing)
├─ Level 2 (node + 120px spacing)
├─ ...
├─ Level 10 (node + 120px spacing)
├─ Realm 2 Header (180px)
├─ Level 11 (node + 120px spacing)
├─ ...
└─ [Bottom Padding: 200px]
```

### Node Positioning

- Centered horizontally
- NODE_SIZE = 48px
- NODE_SPACING = 120px vertical
- REALM_HEADER_HEIGHT = 180px

## Color Design Philosophy

### Calm and Modern

- No harsh contrasts
- Soft, gradual transitions
- Minimal saturation in early realms
- Increasing vibrancy with progress
- Gold/bright colors reserved for end-game

### Accessibility

- All text meets WCAG AA standards
- Clear visual state indicators
- No reliance on color alone for status
- High contrast for important elements

## Performance Optimization

### Lazy Rendering

- Only visible particles are animated
- Static stars for non-twinkling elements
- Memoized calculations for positions

### Animation Efficiency

- Use `useNativeDriver: true` where possible
- Limit simultaneous animations
- Particle density varies by realm

### Memory Management

- Single ScrollView with absolute positioning
- Reusable node components
- Minimal state updates

## Integration Points

### Usage in Dashboard

Replace the current progress navigation with:

```tsx
import { VerticalProgressPath } from '@/components/VerticalProgressPath';

// In your navigation handler
case 'progress-tree':
  return (
    <VerticalProgressPath
      onBack={() => navigate('dashboard')}
      onStartChallenge={(type, level) => {
        // Handle challenge start
      }}
    />
  );
```

### Required Context

The component requires:
- `GameContext` (progress, progressTree)
- `AttentionAvatarContext` (avatarState)

### Challenge Integration

Connects to existing challenge progression system:
- Uses `getChallengeForLevel(level)` from `challenge-progression.ts`
- Displays challenge names and descriptions
- Passes challenge type to `onStartChallenge` handler

## User Experience Flow

1. **First Launch**
   - User starts at Level 1 in Calm realm
   - Avatar appears as gentle white light
   - Tutorial could highlight scroll interaction

2. **Daily Progress**
   - Scroll down to see current level
   - Auto-scrolls to current position
   - Tap level node to start challenge

3. **Realm Transitions**
   - Clear visual shift between realms
   - Realm header announces new theme
   - Background colors blend smoothly
   - Avatar evolution modal on transitions

4. **Completion**
   - Reach Level 100 in Full Focus realm
   - Avatar achieves complete form
   - Celebration animation

## Future Enhancements

### Potential Additions

1. **Parallax Scrolling**
   - Background layers move at different speeds
   - Creates depth illusion

2. **Milestone Markers**
   - Every 10th level could have special icon
   - Mini-celebration animations

3. **Path Connections**
   - Visual lines connecting nodes
   - Show progression path clearly

4. **Realm Music/Sound**
   - Ambient sounds unique to each realm
   - Subtle audio cues

5. **Unlock Animations**
   - Node unlock with particle burst
   - Ripple effect down the path

## Technical Notes

### Dependencies

- expo-linear-gradient
- react-native-reanimated (optional, currently using Animated)
- expo-haptics (for feedback)

### Browser/Platform Support

- iOS: Full support
- Android: Full support
- Web: Limited (no haptics)

### Known Limitations

- ScrollView performance with 100+ nodes
- Particle count affects older devices
- Complex avatar rendering may lag on low-end phones

## Testing Checklist

- [ ] All 10 realms display correctly
- [ ] Smooth scrolling performance
- [ ] Avatar positions correctly at each level
- [ ] Node states update properly
- [ ] Modal displays challenge info
- [ ] Particles animate smoothly
- [ ] Transitions between realms blend well
- [ ] Auto-scroll to current level works
- [ ] Avatar evolution updates on unit completion
- [ ] Color accessibility passes WCAG AA

## Summary

The Vertical Progress Path provides a calm, beautiful, and engaging way for users to experience their journey from basic attention to complete focus mastery. The 10 themed realms create distinct atmospheres, while the evolving avatar provides a personal companion that grows with the user's abilities.

The system is designed to be:
- **Visually cohesive** - Modern, calm aesthetic throughout
- **Performant** - Optimized animations and rendering
- **Accessible** - Clear states and good contrast
- **Engaging** - Smooth animations and visual feedback
- **Scalable** - Easy to extend or modify realms

This replaces the previous space/galaxy theme with a more focused (pun intended) design that better reflects the nature of attention training.
