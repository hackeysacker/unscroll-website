import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
  // Animation values
  const phoneScale = useRef(new Animated.Value(0.3)).current;
  const phoneOpacity = useRef(new Animated.Value(0)).current;
  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const xMarkScale = useRef(new Animated.Value(0)).current;
  const xMarkRotation = useRef(new Animated.Value(0)).current;
  const outerCircleScale = useRef(new Animated.Value(0.8)).current;
  const outerCircleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Step 1: Fade in outer circle (0-400ms)
      Animated.parallel([
        Animated.timing(outerCircleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(outerCircleScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // Step 2: Phone appears and scales up (400-800ms)
      Animated.parallel([
        Animated.timing(phoneOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(phoneScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // Step 3: Inner circle appears (800-1100ms)
      Animated.parallel([
        Animated.timing(circleOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(circleScale, {
          toValue: 1,
          friction: 6,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),

      // Step 4: X mark appears with rotation (1100-1500ms)
      Animated.parallel([
        Animated.spring(xMarkScale, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(xMarkRotation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // Step 5: Hold for a moment (1500-2200ms)
      Animated.delay(700),

      // Step 6: Fade out everything (2200-2600ms)
      Animated.parallel([
        Animated.timing(phoneOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(circleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(outerCircleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const rotateInterpolation = xMarkRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#030712', '#0f172a', '#1e293b']}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          {/* Outer Circle */}
          <Animated.View
            style={[
              styles.outerCircle,
              {
                opacity: outerCircleOpacity,
                transform: [{ scale: outerCircleScale }],
              },
            ]}
          />

          {/* Phone Container */}
          <Animated.View
            style={[
              styles.phoneContainer,
              {
                opacity: phoneOpacity,
                transform: [{ scale: phoneScale }],
              },
            ]}
          >
            {/* Phone Outline */}
            <View style={styles.phone}>
              {/* Phone Notch */}
              <View style={styles.notch} />

              {/* Phone Screen */}
              <View style={styles.screen}>
                {/* Inner Circle Background */}
                <Animated.View
                  style={[
                    styles.innerCircleContainer,
                    {
                      opacity: circleOpacity,
                      transform: [{ scale: circleScale }],
                    },
                  ]}
                >
                  <View style={styles.innerCircle} />
                </Animated.View>

                {/* X Mark */}
                <Animated.View
                  style={[
                    styles.xMarkContainer,
                    {
                      transform: [
                        { scale: xMarkScale },
                        { rotate: rotateInterpolation },
                      ],
                    },
                  ]}
                >
                  <View style={styles.xMark}>
                    <View style={[styles.xBar, styles.xBar1]} />
                    <View style={[styles.xBar, styles.xBar2]} />
                  </View>
                </Animated.View>
              </View>

              {/* Phone Home Indicator */}
              <View style={styles.homeIndicator} />
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 12,
    borderColor: '#e5e7eb',
  },
  phoneContainer: {
    width: 180,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phone: {
    width: 160,
    height: 220,
    borderRadius: 32,
    borderWidth: 6,
    borderColor: '#e5e7eb',
    backgroundColor: '#1e293b',
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notch: {
    width: 80,
    height: 24,
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 3,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
    marginTop: -3,
  },
  screen: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  homeIndicator: {
    width: 60,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 8,
  },
  innerCircleContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#374151',
    borderWidth: 4,
    borderColor: '#1f2937',
  },
  xMarkContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xMark: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xBar: {
    position: 'absolute',
    width: 50,
    height: 12,
    backgroundColor: '#ef4444',
    borderRadius: 6,
  },
  xBar1: {
    transform: [{ rotate: '45deg' }],
  },
  xBar2: {
    transform: [{ rotate: '-45deg' }],
  },
});
