import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { useAttentionAvatar } from '@/contexts/AttentionAvatarContext';
import { getChallengeName } from '@/lib/challenge-progression';
import type { ChallengeType } from '@/types';

interface ChallengeInsightsProps {
  challengeType: ChallengeType;
  level: number;
  score: number;
  duration: number;
  isPerfect: boolean;
  xpEarned: number;
  onContinue: () => void;
  onRetry: () => void;
  onBack: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Minimal Challenge Insights - Focus on what matters most
 */
export function ChallengeInsights({
  challengeType,
  level,
  score,
  duration,
  isPerfect,
  xpEarned,
  onContinue,
  onRetry,
  onBack,
}: ChallengeInsightsProps) {
  const insets = useSafeAreaInsets();
  const { triggerReaction } = useAttentionAvatar();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [animatedScore, setAnimatedScore] = useState(0);

  const isPassed = score >= 80;

  useEffect(() => {
    // Trigger avatar reaction
    if (isPerfect) {
      triggerReaction('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (isPassed) {
      triggerReaction('success');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      triggerReaction('failure');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: score,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(progressAnim, {
        toValue: score,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const listener = scoreAnim.addListener(({ value }) => {
      setAnimatedScore(Math.round(value));
    });

    return () => {
      scoreAnim.removeListener(listener);
    };
  }, []);

  const getScoreColor = () => {
    if (isPerfect) return '#FFD700';
    if (score >= 90) return '#10B981';
    if (score >= 80) return '#3B82F6';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreGrade = () => {
    if (isPerfect) return 'S';
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const getScoreMessage = () => {
    if (isPerfect) return 'Perfect!';
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great!';
    if (score >= 70) return 'Good!';
    return 'Try Again';
  };

  const getInsight = () => {
    const insights: Record<string, string> = {
      focus_hold: score >= 80
        ? 'Strong sustained focus. Try extending duration next time.'
        : 'Focus wavers mid-challenge. Deep breathing helps.',

      memory_flash: score >= 80
        ? 'Good visual memory. Group items into categories for better recall.'
        : 'Use visualization and chunking to improve retention.',

      tap_only_correct: score >= 80
        ? 'Strong pattern recognition. Work on faster decisions.'
        : 'Slow down slightly - accuracy beats speed here.',

      breath_pacing: score >= 80
        ? 'Good rhythm. Focus on smooth breath transitions.'
        : 'Practice natural breathing - don\'t force the pace.',

      stillness_test: score >= 80
        ? 'Minimal movement. Find a stable position before starting.'
        : 'Relax muscles and breathe naturally to reduce movement.',

      slow_tracking: score >= 80
        ? 'Good tracking. Work on maintaining peripheral awareness.'
        : 'Keep eyes relaxed, not strained. Predict target movement.',

      default: score >= 80
        ? 'Solid performance. Keep practicing consistently.'
        : 'Review the basics and try again. You\'ll improve!',
    };

    return insights[challengeType] || insights.default;
  };

  const scoreColor = getScoreColor();
  const radius = 70;
  const circumference = radius * 2 * Math.PI;

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 8) }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            paddingBottom: Math.max(insets.bottom + 24, 32),
          },
        ]}
      >
        {/* Hero Score Circle */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCircle}>
            {/* Glow effect */}
            <View style={[styles.scoreGlow, { backgroundColor: scoreColor + '20' }]} />

            {/* Circular progress */}
            <Svg width={160} height={160} style={{ position: 'absolute' }}>
              <Circle
                cx={80}
                cy={80}
                r={radius}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth={10}
                fill="none"
              />
              <AnimatedCircle
                cx={80}
                cy={80}
                r={radius}
                stroke={scoreColor}
                strokeWidth={10}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 80 80)`}
              />
            </Svg>

            {/* Score number */}
            <View style={styles.scoreContent}>
              <Text style={[styles.scoreNumber, { color: scoreColor }]}>
                {animatedScore}
              </Text>
              <Text style={styles.scoreGrade}>{getScoreGrade()}</Text>
            </View>
          </View>

          {/* Score message */}
          <Text style={[styles.scoreMessage, { color: scoreColor }]}>
            {getScoreMessage()}
          </Text>

          {/* Challenge info */}
          <Text style={styles.challengeName}>{getChallengeName(challengeType)}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>Level {level}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{(duration / 1000).toFixed(1)}s</Text>
            {isPerfect && (
              <>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.perfectText}>⭐ Perfect</Text>
              </>
            )}
          </View>
        </View>

        {/* Status + XP Card */}
        <LinearGradient
          colors={isPassed
            ? ['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)']
            : ['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)']
          }
          style={styles.statusCard}
        >
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: isPassed ? '#10B981' : '#EF4444' }]}>
                {isPassed ? '✓ PASSED' : '✗ FAILED'}
              </Text>
            </View>

            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.xpBadge}
            >
              <Text style={styles.xpIcon}>✨</Text>
              <Text style={styles.xpValue}>+{xpEarned} XP</Text>
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* Single Insight Card */}
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.12)', 'rgba(139, 92, 246, 0.06)']}
          style={styles.insightCard}
        >
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>💡</Text>
            <Text style={styles.insightLabel}>Insight</Text>
          </View>
          <Text style={styles.insightText}>{getInsight()}</Text>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {!isPassed && (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onRetry();
              }}
              style={styles.retryButton}
            >
              <Text style={styles.retryIcon}>🔄</Text>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onContinue();
            }}
            style={[styles.continueButton, !isPassed && styles.continueButtonFailed]}
          >
            <LinearGradient
              colors={isPassed ? ['#6366F1', '#8B5CF6'] : ['#4B5563', '#374151']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>
                {isPassed ? 'Continue' : 'Go Back'}
              </Text>
              <Text style={styles.continueIcon}>{isPassed ? '→' : '←'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  backIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },

  // Hero Score
  scoreSection: {
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  scoreGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.3,
  },
  scoreContent: {
    alignItems: 'center',
    gap: 4,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: -2,
  },
  scoreGrade: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1.5,
  },
  scoreMessage: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  metaDot: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  perfectText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFD700',
  },

  // Status + XP
  statusCard: {
    borderRadius: 20,
    padding: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  statusBadge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  xpBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  xpIcon: {
    fontSize: 18,
  },
  xpValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Insight
  insightCard: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  insightIcon: {
    fontSize: 24,
  },
  insightLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C4B5FD',
  },
  insightText: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Actions
  actions: {
    gap: 12,
    marginTop: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    gap: 8,
  },
  retryIcon: {
    fontSize: 16,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButton: {
    borderRadius: 18,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  continueButtonFailed: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
      },
    }),
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  continueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  continueIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
