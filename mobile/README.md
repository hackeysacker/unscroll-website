# FocusFlow Mobile App

This is the React Native mobile version of FocusFlow, a gamified attention training application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. For iOS:
```bash
cd ios && pod install && cd ..
npm run ios
```

3. For Android:
```bash
npm run android
```

## Project Structure

- `src/types/` - TypeScript type definitions (ported from webapp)
- `src/lib/` - Core utilities and game mechanics (ported from webapp)
- `src/contexts/` - React contexts for state management (needs porting)
- `src/components/` - React Native components (needs porting)
- `app/` - Expo Router navigation structure (needs creation)

## Porting Status

✅ **Completed:**
- Types definitions
- Storage utilities (adapted for AsyncStorage)
- Game mechanics
- Heart mechanics
- Badge mechanics
- Utils (UUID generation, etc.)

⏳ **In Progress:**
- Contexts (Auth, Game, Settings, Theme)
- Components (Dashboard, Challenges, Onboarding, etc.)
- Navigation structure
- UI components adapted for React Native

## Key Differences from Web App

1. **Storage**: Uses `@react-native-async-storage/async-storage` instead of `localStorage`
2. **Styling**: Uses React Native StyleSheet instead of Tailwind CSS
3. **Navigation**: Uses Expo Router instead of TanStack Router
4. **UI Components**: Needs React Native equivalents (TouchableOpacity, View, Text, etc.)
5. **Haptics**: Can use `expo-haptics` for tactile feedback
6. **Notifications**: Uses `expo-notifications` for push notifications

## Next Steps

1. Port all contexts to use async storage operations
2. Create React Native versions of all components
3. Set up Expo Router navigation
4. Adapt all UI components for mobile
5. Test on iOS and Android devices

