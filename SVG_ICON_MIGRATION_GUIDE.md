# SVG Icon Migration Guide

## Overview

This guide documents the migration from emoji icons to professional SVG icons throughout the app. The new icon system provides pixel-perfect, scalable vector graphics that look consistent across all devices and platforms.

## ✅ Completed Components

### 1. Icon Library Created

**Files Created:**
- `mobile/src/components/icons/ChallengeIcons.tsx` - 50+ SVG icon components
- `mobile/src/components/icons/index.tsx` - Icon exports and renderer
- `mobile/src/components/ui/ActivityIcon.tsx` - Activity icon wrapper
- `mobile/src/components/ui/UIIcon.tsx` - UI icon wrapper

**Icon Components Available:**
- All 40+ challenge/exercise icons (Target, Eye, Lightning, etc.)
- All UI icons (Trophy, Crown, Diamond, Clock, Fire, etc.)
- Achievement icons (Party, Confetti, Star, etc.)

### 2. FocusJourneyPage (Partially Migrated)

**Status**: 🟡 In Progress

**Completed:**
- ✅ Added imports for ActivityIcon and UIIcon
- ✅ Replaced "Start Here" section title with SVG target icon
- ✅ Replaced suggested activity emoji with Activity Icon SVG
- ✅ Replaced duration/XP emojis with Clock and Diamond SVG icons

**Remaining:**
- ⏳ Activities list section title (📚 emoji)
- ⏳ Individual activity icons in list
- ⏳ Activity duration/XP icons in meta tags
- ⏳ Mastery test section (👑 emoji)
- ⏳ Test icon and endurance label (💪 emoji)

## 📋 Migration Steps for Remaining Components

### Step 1: Replace FocusJourneyPage Remaining Icons

**File**: `mobile/src/components/FocusJourneyPage.tsx`

**Section: Activities List Title** (Line ~174)
```tsx
// BEFORE:
<Text style={styles.sectionTitle}>
  📚 Exercises ({activities.length})
</Text>

// AFTER:
<View style={styles.sectionTitleRow}>
  <UIIcon name="book" size={20} color="#6366F1" />
  <Text style={styles.sectionTitleText}>Exercises ({activities.length})</Text>
</View>
```

**Section: Activity Card Icons** (Line ~181)
```tsx
// BEFORE:
<Text style={styles.activityIcon}>{activity.icon}</Text>

// AFTER:
<ActivityIcon
  activityType={activity.type}
  size={28}
  color="#FFFFFF"
  backgroundColor="rgba(99, 102, 241, 0.15)"
/>
```

**Section: Activity Meta Icons** (Line ~187-189)
```tsx
// BEFORE:
<Text style={styles.metaText}>⏰ {Math.round(activity.duration / 60)}m</Text>
<Text style={styles.metaText}>💎 {activity.xpReward} XP</Text>

// AFTER:
<View style={styles.metaRow}>
  <UIIcon name="clock" size={12} color="#A0AEC0" />
  <Text style={styles.metaText}>{Math.round(activity.duration / 60)}m</Text>
</View>
<View style={styles.metaRow}>
  <UIIcon name="diamond" size={12} color="#A0AEC0" />
  <Text style={styles.metaText}>{activity.xpReward} XP</Text>
</View>
```

**Section: Mastery Test** (Line ~204, 218, 223)
```tsx
// BEFORE:
<Text style={styles.sectionTitle}>👑 {test.realmName} Mastery Test</Text>
<Text style={styles.testIcon}>👑</Text>
<Text style={styles.testEnduranceLabel}>
  💪 ENDURANCE TEST • All {test.activities.length} skills in sequence
</Text>

// AFTER:
<View style={styles.sectionTitleRow}>
  <UIIcon name="crown" size={22} color="#F59E0B" />
  <Text style={styles.sectionTitleText}>{test.realmName} Mastery Test</Text>
</View>

<ActivityIcon
  activityType="mastery_test"
  size={36}
  color="#FFFFFF"
  backgroundColor="rgba(255, 255, 255, 0.2)"
  style={{icon component}}
/>

<View style={styles.enduranceRow}>
  <UIIcon name="muscle" size={16} color="#FFFFFF" />
  <Text style={styles.testEnduranceText}>
    ENDURANCE TEST • All {test.activities.length} skills in sequence
  </Text>
</View>
```

**Add these styles:**
```tsx
sectionTitleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 12,
},
sectionTitleText: {
  fontSize: 18,
  fontWeight: '700',
  color: '#E2E8F0',
},
metaRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
},
enduranceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},
```

### Step 2: Update AchievementAnimation Component

**File**: `mobile/src/components/AchievementAnimation.tsx`

**Add imports:**
```tsx
import { UIIcon } from '@/components/ui/UIIcon';
```

**Replace getAchievementContent function:**
```tsx
const getAchievementContent = () => {
  switch (type) {
    case 'level':
      return {
        IconComponent: () => <UIIcon name="party" size={56} color="#FFFFFF" />,
        title: `Level ${level}`,
        subtitle: 'Complete!',
        colors: [realm.colors.primary, realm.colors.secondary],
      };
    case 'milestone':
      return {
        IconComponent: () => <UIIcon name="trophy" size={56} color="#FFFFFF" />,
        title: 'Milestone',
        subtitle: message || 'Achievement Unlocked!',
        colors: [realm.colors.primary, realm.colors.accent],
      };
    case 'perfect':
      return {
        IconComponent: () => <UIIcon name="diamond" size={56} color="#FFFFFF" />,
        title: 'Perfect!',
        subtitle: 'Flawless Execution',
        colors: ['#FCD34D', '#FBBF24'],
      };
    case 'streak':
      return {
        IconComponent: () => <UIIcon name="fire" size={56} color="#FFFFFF" />,
        title: `${level} Day Streak`,
        subtitle: 'Keep it up!',
        colors: ['#F59E0B', '#EF4444'],
      };
    default:
      return {
        IconComponent: () => <UIIcon name="confetti" size={56} color="#FFFFFF" />,
        title: 'Achievement',
        subtitle: 'Unlocked',
        colors: [realm.colors.primary, realm.colors.secondary],
      };
  }
};
```

**Replace icon render:**
```tsx
// BEFORE:
<Text style={styles.icon}>{content.icon}</Text>

// AFTER:
<content.IconComponent />
```

**Remove icon style from StyleSheet** (no longer needed for emoji)

### Step 3: Update ProfileScreen Avatar System

**File**: `mobile/src/components/ProfileScreen.tsx`

**Option A: Keep Emoji Avatars** (Recommended for now)
- Emoji avatars provide good personalization
- No changes needed - emojis work well for profile pictures

**Option B: SVG Icon Avatars**
- Create custom SVG avatar system
- Would require significant work for 30+ avatar designs
- Not recommended unless specifically requested

### Step 4: Update Challenge Components

These components contain achievement badge emojis. Update on a per-need basis:

**Files to Update:**
- `mobile/src/components/challenges/ImpulseSpikeTestChallenge.tsx`
- `mobile/src/components/challenges/PopupIgnoreChallenge.tsx`
- `mobile/src/components/challenges/MultiTaskTapChallenge.tsx`
- `mobile/src/components/challenges/FakeNotificationsChallenge.tsx`
- `mobile/src/components/challenges/DelayUnlockChallenge.tsx`
- `mobile/src/components/challenges/GazeHoldChallenge.tsx`
- `mobile/src/components/challenges/MultiObjectTrackingChallenge.tsx`

**Pattern for Achievement Badges:**
```tsx
// BEFORE:
if (score === 100) achievements.push('👑 Impulse Master');
if (score >= 90) achievements.push('🎯 Self Control');

// AFTER: (Keep emojis in achievement text for now)
// OR create a proper achievement system with separate icons
```

### Step 5: Update ActivityDetailScreen (If Needed)

**File**: `mobile/src/components/ActivityDetailScreen.tsx`

Replace emoji icons with ActivityIcon components for each challenge type.

### Step 6: Update VerticalProgressPath / ImmersiveProgressPath

**Files:**
- `mobile/src/components/VerticalProgressPath.tsx`
- `mobile/src/components/ImmersiveProgressPath.tsx`

Replace node icons with ActivityIcon components.

## 🎨 Icon Component Usage Guide

### ActivityIcon Component

**Purpose**: Render SVG icons for challenge/exercise activities

**Usage:**
```tsx
import { ActivityIcon } from '@/components/ui/ActivityIcon';

<ActivityIcon
  activityType="focus_hold" // or any ActivityType
  size={40} // icon size in pixels
  color="#FFFFFF" // icon color
  backgroundColor="rgba(99, 102, 241, 0.2)" // background circle color
  style={{marginRight: 10}} // optional additional styles
/>
```

**Props:**
- `activityType`: string - The activity/challenge type
- `size`: number - Size of the icon (default: 40)
- `color`: string - Icon color (default: '#FFFFFF')
- `backgroundColor`: string - Background circle color (default: 'rgba(99, 102, 241, 0.2)')
- `style`: StyleProp - Additional styles for container

### UIIcon Component

**Purpose**: Render SVG icons for UI elements (trophy, clock, diamond, etc.)

**Usage:**
```tsx
import { UIIcon } from '@/components/ui/UIIcon';

// Without background
<UIIcon name="trophy" size={24} color="#6366F1" />

// With background circle
<UIIcon
  name="trophy"
  size={24}
  color="#6366F1"
  withBackground={true}
  backgroundColor="rgba(99, 102, 241, 0.1)"
/>
```

**Available Icon Names:**
- `trophy` - Trophy icon
- `crown` - Crown icon
- `diamond` - Diamond icon
- `clock` - Clock icon
- `muscle` - Muscle/strength icon
- `fire` - Fire/streak icon
- `shield` - Shield/defense icon
- `book` - Book icon
- `target` - Target/focus icon
- `party` - Party celebration icon
- `confetti` - Confetti celebration icon
- `star` - Star icon
- `lightning` - Lightning/speed icon
- `checkmark` - Checkmark icon

### IconRenderer Component

**Purpose**: Low-level icon renderer (used internally by ActivityIcon and UIIcon)

**Usage:**
```tsx
import { IconRenderer } from '@/components/icons';

// Render activity icon
<IconRenderer activityType="focus_hold" size={24} color="#6366F1" />

// Render UI icon
<IconRenderer uiIcon="trophy" size={24} color="#6366F1" />
```

## 📊 Migration Status by File

| File | Status | Priority | Notes |
|------|--------|----------|-------|
| **Icon Library** | ✅ Complete | High | 50+ SVG icons created |
| **FocusJourneyPage** | 🟡 Partial | High | Start Here section done |
| **AchievementAnimation** | ⏳ Todo | High | 5 icon types to replace |
| **ProfileScreen** | ⏸️ Skip | Low | Emoji avatars are fine |
| **Challenge Components** | ⏳ Todo | Medium | Achievement badges |
| **ActivityDetailScreen** | ⏳ Todo | Medium | Challenge intro icons |
| **VerticalProgressPath** | ⏳ Todo | Medium | Progress node icons |
| **LeaderboardScreen** | ⏸️ Skip | Low | Avatar emojis are fine |
| **PracticeScreen** | ✅ Complete | Low | Uses SVG icons already |

## 🔧 Testing Checklist

After completing migration:

- [ ] FocusJourneyPage displays SVG icons correctly
  - [ ] Start Here section shows target icon
  - [ ] Suggested activity shows correct SVG icon
  - [ ] Activities list shows book icon
  - [ ] Each activity shows correct SVG icon
  - [ ] Meta tags show clock and diamond icons
  - [ ] Mastery test shows crown icon

- [ ] Achievement animations show SVG icons
  - [ ] Level complete shows party icon
  - [ ] Milestone shows trophy icon
  - [ ] Perfect score shows diamond icon
  - [ ] Streak shows fire icon

- [ ] All SVG icons are:
  - [ ] Properly sized
  - [ ] Correctly colored
  - [ ] Aligned with text
  - [ ] Responsive to theme changes

- [ ] Performance:
  - [ ] No lag when rendering multiple icons
  - [ ] Smooth animations
  - [ ] Fast initial load

## 🎯 Benefits of SVG Icons

1. **Pixel Perfect** - Sharp at any size/resolution
2. **Customizable** - Easy to change colors and sizes
3. **Consistent** - Same appearance across all devices
4. **Professional** - Modern, polished look
5. **Themeable** - Can easily adapt to different color schemes
6. **Accessible** - Better for screen readers (can add labels)
7. **Performant** - Smaller file size than image assets
8. **Scalable** - Single source for all sizes

## 📝 Next Steps

1. ✅ Complete FocusJourneyPage migration
2. ✅ Complete AchievementAnimation migration
3. Consider challenge component migration
4. Test thoroughly on iOS and Android
5. Document any edge cases or issues
6. Create visual comparison screenshots

## 🚀 Future Enhancements

- **Animated Icons**: Add subtle animations to icons
- **Icon Themes**: Different icon styles (outlined, filled, etc.)
- **Custom Colors**: Per-realm color schemes
- **Icon Packs**: Allow users to choose icon style preferences
- **Accessibility**: Add proper labels for screen readers

---

**Migration Started**: December 9, 2025
**Icon Library**: 50+ professional SVG icons
**Components Created**: 4 (ChallengeIcons, IconRenderer, ActivityIcon, UIIcon)
**Status**: 30% Complete (Core library done, partially migrated FocusJourneyPage)
