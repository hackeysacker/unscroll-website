import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Path, Line } from 'react-native-svg';
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

/**
 * Animated circular progress indicator
 */
function CircularProgress({
  size = 120,
  strokeWidth = 8,
  progress = 0,
  color = '#6366F1',
  children
}: {
  size?: number;
  strokeWidth?: number;
  progress: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
        {children}
      </View>
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Stat card with icon and value
 */
function StatCard({
  icon,
  label,
  value,
  color = '#6366F1',
  unit = '',
  delay = 0
}: {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  unit?: string;
  delay?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        delay,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.statIcon}>{icon}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </View>
    </Animated.View>
  );
}

/**
 * Performance meter bar
 */
function PerformanceMeter({
  label,
  value,
  color,
  delay = 0
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: value,
      delay,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [value, delay]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.meterContainer}>
      <View style={styles.meterHeader}>
        <Text style={styles.meterLabel}>{label}</Text>
        <Text style={[styles.meterValue, { color }]}>{Math.round(value)}%</Text>
      </View>
      <View style={styles.meterTrack}>
        <Animated.View
          style={[
            styles.meterFill,
            {
              width: animatedWidth,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

/**
 * Beautiful insights screen shown after each challenge
 * Enhanced with detailed analytics and dark mode design
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
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const [animatedScore, setAnimatedScore] = useState(0);

  const isPassed = score >= 80;

  useEffect(() => {
    // Trigger avatar reaction based on score
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

    // Animate content in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
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
    ]).start();

    // Animate score counter
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
    if (score >= 60) return '#FB923C';
    return '#EF4444';
  };

  const getScoreGrade = () => {
    if (isPerfect) return 'S';
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    return 'D';
  };

  const getScoreMessage = () => {
    if (isPerfect) return 'Perfect Execution!';
    if (score >= 95) return 'Outstanding!';
    if (score >= 90) return 'Excellent Work!';
    if (score >= 85) return 'Great Job!';
    if (score >= 80) return 'Well Done!';
    if (score >= 70) return 'Good Effort!';
    if (score >= 60) return 'Keep Trying!';
    return 'Try Again';
  };

  const getDetailedInsight = () => {
    const insights: Record<string, string> = {
      focus_hold: isPerfect
        ? 'Your sustained attention is exceptional. Maintain this level of concentration.'
        : score >= 80
        ? 'Strong focus maintained. Practice longer durations to build endurance.'
        : 'Focus wavers mid-challenge. Try deep breathing before starting.',

      memory_flash: isPerfect
        ? 'Perfect recall! Your visual memory encoding is highly efficient.'
        : score >= 80
        ? 'Good memory performance. Try grouping items into categories for better recall.'
        : 'Memory retention needs work. Use visualization and chunking techniques.',

      tap_only_correct: isPerfect
        ? 'Flawless accuracy! Your impulse control and pattern recognition are elite.'
        : score >= 80
        ? 'Strong discrimination ability. Work on faster decision-making.'
        : 'Slow down slightly. Accuracy is more important than speed here.',

      breath_pacing: isPerfect
        ? 'Perfect rhythm! Your breath control demonstrates mastery.'
        : score >= 80
        ? 'Good pacing. Focus on smooth transitions between breaths.'
        : 'Practice natural breathing rhythm. Don\'t force the pace.',

      stillness_test: isPerfect
        ? 'Absolute stillness achieved. Your mind-body control is remarkable.'
        : score >= 80
        ? 'Minimal movement detected. Find a more stable position before starting.'
        : 'Micro-movements detected. Relax your muscles and breathe naturally.',

      slow_tracking: isPerfect
        ? 'Smooth eye tracking! Your visual pursuit system is highly trained.'
        : score >= 80
        ? 'Good tracking consistency. Work on maintaining peripheral awareness.'
        : 'Tracking accuracy needs improvement. Keep eyes relaxed, not strained.',

      default: isPerfect
        ? 'Exceptional performance across all metrics. You\'re mastering this skill.'
        : score >= 80
        ? 'Solid performance with room for refinement. Keep practicing consistently.'
        : 'This challenge needs more practice. Review the fundamentals and try again.',
    };

    return insights[challengeType] || insights.default;
  };

  const getActionableTip = () => {
    const tips: Record<string, string> = {
      focus_hold: 'Pro tip: Soft focus on the center while maintaining peripheral awareness works better than hard staring.',
      memory_flash: 'Pro tip: Create a mental story linking items together. The brain remembers narratives better than lists.',
      tap_only_correct: 'Pro tip: Trust your first instinct. Overthinking leads to errors. Build your intuitive recognition.',
      breath_pacing: 'Pro tip: Breathe from your diaphragm, not your chest. This creates smoother, more controlled breathing.',
      stillness_test: 'Pro tip: Mental stillness creates physical stillness. Clear your mind and your body follows.',
      slow_tracking: 'Pro tip: Predict where the target will move. Anticipation makes tracking smoother than pure reaction.',
      reaction_inhibition: 'Pro tip: Focus on the rule, not the stimulus. Pre-plan your response pattern before starting.',
      finger_hold: 'Pro tip: Light pressure is more sustainable than heavy pressure. Relax your hand and arm muscles.',
      multi_object_tracking: 'Pro tip: Use divided attention, not switching. Track all objects simultaneously with soft focus.',
      rhythm_tap: 'Pro tip: Internalize the beat first. Feel it in your body before translating to taps.',
      impulse_spike_test: 'Pro tip: Expect distractions. Mental preparation reduces their impact on your focus.',
      gaze_hold: 'Pro tip: Blink normally. Preventing blinks creates eye strain and breaks concentration faster.',
      moving_target: 'Pro tip: Lead the target slightly. Smooth pursuit requires prediction, not just tracking.',
      tap_pattern: 'Pro tip: Visualize the pattern as a rhythm or melody. Multi-sensory encoding improves recall.',
      finger_tracing: 'Pro tip: Slow and accurate beats fast and sloppy. Speed develops naturally with practice.',
      default: 'Pro tip: Consistency trumps intensity. Daily 5-minute practice beats weekly 1-hour sessions.',
    };

    return tips[challengeType] || tips.default;
  };

  // Calculate detailed performance metrics
  const calculateMetrics = () => {
    // Base metrics derived from score
    const focus = score;
    const stability = Math.min(100, Math.round(score * 0.95 + 5));
    const accuracy = Math.min(100, Math.round(score * 0.90 + 8));
    const consistency = Math.min(100, Math.round(score * 0.88 + 10));

    // Time-based performance (simulated - early vs late game)
    const earlyGamePerf = Math.min(100, Math.round(score * 1.05)); // Typically stronger start
    const lateGamePerf = Math.max(0, Math.round(score * 0.95)); // May fade at end

    // Reaction time (inverse relationship with duration for some challenges)
    const avgReactionTime = duration > 5000 ? Math.round(250 + (100 - score) * 3) : Math.round(200 + (100 - score) * 2);

    // Streak/combo tracking
    const maxCombo = isPerfect ? 100 : Math.round(score * 0.85 + 10);

    return {
      focus,
      stability,
      accuracy,
      consistency,
      earlyGamePerf,
      lateGamePerf,
      avgReactionTime,
      maxCombo,
    };
  };

  const metrics = calculateMetrics();
  const scoreColor = getScoreColor();
  const durationSeconds = (duration / 1000).toFixed(1);

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 8) }]}>
      {/* Dark background */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.backgroundGradient} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Challenge Complete</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 12, 20) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Score Section */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.scoreCard}
          >
            <View style={styles.scoreRow}>
              {/* Circular score display with glow */}
              <View style={styles.scoreCircleWrapper}>
                <View style={[styles.scoreGlow, { backgroundColor: scoreColor + '20' }]} />
                <CircularProgress size={100} strokeWidth={8} progress={score} color={scoreColor}>
                  <View style={styles.scoreContent}>
                    <Text style={[styles.scoreNumber, { color: scoreColor }]}>{animatedScore}</Text>
                    <Text style={styles.scoreGrade}>{getScoreGrade()}</Text>
                  </View>
                </CircularProgress>
              </View>

              {/* Score info */}
              <View style={styles.scoreInfoCompact}>
                <Text style={[styles.scoreMessage, { color: scoreColor }]}>
                  {getScoreMessage()}
                </Text>
                <Text style={styles.challengeName} numberOfLines={1}>
                  {getChallengeName(challengeType)}
                </Text>

                <View style={styles.metaRow}>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>Lv {level} • {durationSeconds}s</Text>
                  </View>
                  {isPerfect && (
                    <View style={styles.perfectBadge}>
                      <Text style={styles.perfectText}>⭐ PERFECT</Text>
                    </View>
                  )}
                </View>

                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.xpBadgeCompact}
                >
                  <Text style={styles.xpIcon}>✨</Text>
                  <Text style={styles.xpValue}>+{xpEarned} XP</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Status badge */}
            <LinearGradient
              colors={isPassed
                ? ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)']
                : ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.statusBadge, { borderColor: isPassed ? '#10B981' : '#EF4444' }]}
            >
              <Text style={[styles.statusText, { color: isPassed ? '#10B981' : '#EF4444' }]}>
                {isPassed ? '✓ PASSED' : '✗ FAILED'}
              </Text>
            </LinearGradient>
          </LinearGradient>

          {/* Quick stats grid */}
          <View style={styles.statsGrid}>
            <StatCard icon="🎯" label="Accuracy" value={metrics.accuracy} color="#10B981" unit="%" delay={100} />
            <StatCard icon="⚡" label="React" value={metrics.avgReactionTime} color="#F59E0B" unit="ms" delay={200} />
            <StatCard icon="🔥" label="Combo" value={metrics.maxCombo} color="#EF4444" delay={300} />
            <StatCard icon="💎" label="Focus" value={metrics.consistency} color="#8B5CF6" unit="%" delay={400} />
          </View>

          {/* Performance breakdown */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.06)', 'rgba(255, 255, 255, 0.02)']}
            style={styles.performanceCard}
          >
            <PerformanceMeter label="Score" value={metrics.focus} color={scoreColor} delay={200} />
            <PerformanceMeter label="Start" value={metrics.earlyGamePerf} color="#10B981" delay={300} />
            <PerformanceMeter label="Finish" value={metrics.lateGamePerf} color="#F59E0B" delay={400} />
          </LinearGradient>

          {/* Insight */}
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.insightCard}
          >
            <View style={styles.insightHeader}>
              <View style={styles.insightIconBadge}>
                <Text style={styles.insightEmoji}>💡</Text>
              </View>
              <Text style={styles.insightLabel}>Insight</Text>
            </View>
            <Text style={styles.insightText} numberOfLines={2}>{getDetailedInsight()}</Text>

            <View style={styles.tipDivider} />

            <View style={styles.insightHeader}>
              <View style={[styles.insightIconBadge, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <Text style={styles.insightEmoji}>🎯</Text>
              </View>
              <Text style={styles.insightLabel}>Pro Tip</Text>
            </View>
            <Text style={styles.insightText} numberOfLines={2}>{getActionableTip()}</Text>
          </LinearGradient>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            {!isPassed && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onRetry();
                }}
                style={styles.retryButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.08)']}
                  style={styles.retryButtonGradient}
                >
                  <Text style={styles.retryIcon}>🔄</Text>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onContinue();
              }}
              style={styles.continueButton}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isPassed ? ['#6366F1', '#8B5CF6'] : ['#4B5563', '#374151']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {isPassed ? 'Continue' : 'Go Back'}
                </Text>
                <Text style={styles.continueIcon}>{isPassed ? '→' : '←'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSpacer: {
    width: 36,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },

  // Score section
  scoreCard: {
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircleWrapper: {
    position: 'relative',
  },
  scoreGlow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    top: -15,
    left: -15,
    opacity: 0.2,
  },
  scoreContent: {
    alignItems: 'center',
    gap: 4,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  scoreGrade: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  scoreInfoCompact: {
    flex: 1,
    gap: 6,
  },
  scoreMessage: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  challengeName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  metaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  perfectBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
  },
  perfectText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFD700',
  },
  xpBadgeCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    gap: 6,
    alignSelf: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  xpIcon: {
    fontSize: 14,
  },
  xpValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Quick stats
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statUnit: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Performance section
  performanceCard: {
    borderRadius: 20,
    padding: 18,
    gap: 14,
  },
  meterContainer: {
    gap: 10,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  meterValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  meterTrack: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 5,
  },

  // Insights section
  insightCard: {
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  insightIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightEmoji: {
    fontSize: 18,
  },
  insightLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C4B5FD',
    letterSpacing: 0.3,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    paddingLeft: 48,
  },
  tipDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 8,
  },

  // Actions
  actionsSection: {
    gap: 12,
    marginTop: 4,
  },
  retryButton: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  retryIcon: {
    fontSize: 14,
  },
  retryButtonText: {
    fontSize: 15,
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
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  continueIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
