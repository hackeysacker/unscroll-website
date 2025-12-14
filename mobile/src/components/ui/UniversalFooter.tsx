/**
 * Universal Bottom Navigation Component
 *
 * Consistent bottom navigation bar with animated tab switching
 * Can be used across the entire app
 */

import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect, Line } from 'react-native-svg';

export type TabType = 'home' | 'practice' | 'leaderboard' | 'profile';

interface UniversalFooterProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabIconProps {
  isActive: boolean;
  size?: number;
}

/**
 * Home Icon - Path/Journey visualization
 */
function HomeIcon({ isActive, size = 24 }: TabIconProps) {
  const color = isActive ? '#6366F1' : '#9CA3AF';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Practice Icon - Target/Focus symbol
 */
function PracticeIcon({ isActive, size = 24 }: TabIconProps) {
  const color = isActive ? '#6366F1' : '#9CA3AF';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="2" />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Svg>
  );
}

/**
 * Leaderboard Icon - Trophy/Rankings
 */
function LeaderboardIcon({ isActive, size = 24 }: TabIconProps) {
  const color = isActive ? '#6366F1' : '#9CA3AF';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Profile Icon - User avatar
 */
function ProfileIcon({ isActive, size = 24 }: TabIconProps) {
  const color = isActive ? '#6366F1' : '#9CA3AF';
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Animated Tab Button
 */
function TabButton({
  tab,
  icon: Icon,
  label,
  isActive,
  onPress,
}: {
  tab: TabType;
  icon: React.ComponentType<TabIconProps>;
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.9)).current;
  const colorAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.9,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [isActive]);

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(99, 102, 241, 0)', 'rgba(99, 102, 241, 0.1)'],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabButton}
      activeOpacity={0.7}
    >
      {/* Outer view for scale (native driver) */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        {/* Inner view for backgroundColor (non-native driver) */}
        <Animated.View
          style={[
            styles.tabButtonInner,
            {
              backgroundColor,
            },
          ]}
        >
          <Icon isActive={isActive} size={24} />
          <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
            {label}
          </Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function UniversalFooter({ activeTab, onTabChange }: UniversalFooterProps) {
  const insets = useSafeAreaInsets();

  // Animated indicator for active tab
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const tabIndex = {
      home: 0,
      practice: 1,
      leaderboard: 2,
      profile: 3,
    }[activeTab];

    Animated.spring(indicatorAnim, {
      toValue: tabIndex,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const indicatorTranslateX = indicatorAnim.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [0, 25, 50, 75], // Percentage-based positions
  });

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      {/* Animated indicator bar */}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            transform: [
              {
                translateX: indicatorTranslateX.interpolate({
                  inputRange: [0, 75],
                  outputRange: [0, 300], // Adjust based on screen width
                }),
              },
            ],
          },
        ]}
      />

      {/* Tab buttons */}
      <TabButton
        tab="home"
        icon={HomeIcon}
        label="Home"
        isActive={activeTab === 'home'}
        onPress={() => onTabChange('home')}
      />
      <TabButton
        tab="practice"
        icon={PracticeIcon}
        label="Practice"
        isActive={activeTab === 'practice'}
        onPress={() => onTabChange('practice')}
      />
      <TabButton
        tab="leaderboard"
        icon={LeaderboardIcon}
        label="Ranks"
        isActive={activeTab === 'leaderboard'}
        onPress={() => onTabChange('leaderboard')}
      />
      <TabButton
        tab="profile"
        icon={ProfileIcon}
        label="Profile"
        isActive={activeTab === 'profile'}
        onPress={() => onTabChange('profile')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '25%',
    height: 3,
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabLabelActive: {
    color: '#6366F1',
  },
});
