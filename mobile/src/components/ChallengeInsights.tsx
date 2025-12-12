import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAttentionAvatar } from '@/contexts/AttentionAvatarContext';
import { getChallengeName } from '@/lib/challenge-progression';
import type { ChallengeType } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
 * Beautiful insights screen shown after each challenge
 * Shows performance breakdown, pass/fail status, and tips
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
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const [animatedScore, setAnimatedScore] = useState(0);

  const isPassed = score >= 80;

  useEffect(() => {
    // Trigger avatar reaction based on score
    if (isPerfect) {
      triggerReaction('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (score >= 80) {
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
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: score,
        duration: 1200,
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

  const getScoreEmoji = () => {
    if (isPerfect) return '🌟';
    if (score >= 90) return '🎉';
    if (score >= 80) return '⭐';
    if (score >= 70) return '👍';
    if (score >= 60) return '💪';
    return '🎯';
  };

  const getScoreMessage = () => {
    if (isPerfect) return 'Perfect!';
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Passed!';
    if (score >= 70) return 'Good Work!';
    if (score >= 60) return 'Almost There!';
    return 'Failed';
  };

  const getScoreColor = () => {
    if (isPerfect) return '#FFD700';
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getInsight = () => {
    if (isPerfect) {
      return 'Flawless execution! Your focus is razor-sharp.';
    }
    if (score >= 90) {
      return 'Outstanding performance! You\'re mastering this skill.';
    }
    if (score >= 80) {
      return 'Strong focus! A few more practice rounds will make it perfect.';
    }
    if (score >= 70) {
      return 'Solid effort! Focus on minimizing distractions.';
    }
    if (score >= 60) {
      return 'You\'re improving! Try to maintain focus throughout.';
    }
    return 'Don\'t give up! Every attempt builds your attention muscle.';
  };

  const getTip = () => {
    const tips: Record<string, string> = {
      focus_hold: 'Take a deep breath before starting. Soft focus works better than staring.',
      memory_flash: 'Create a mental story connecting the items. Visualization helps!',
      tap_only_correct: 'Trust your first instinct. Hesitation creates errors.',
      breath_pacing: 'Match the rhythm naturally. Don\'t force your breathing.',
      stillness_test: 'Find a comfortable position before starting. Relax your shoulders.',
      slow_tracking: 'Smooth pursuit, not jerky movements. Let your eyes glide.',
      reaction_inhibition: 'Focus on the rule, not the speed. Accuracy over speed.',
      finger_hold: 'Keep steady pressure. Breathe slowly and relax your hand.',
      anti_scroll_swipe: 'Resist the urge to swipe. Build that impulse control!',
      fake_notifications: 'Ignore distractions. Your attention is your superpower.',
      look_away: 'Give your eyes a break. Look at distant objects to reduce strain.',
      delay_unlock: 'Patience builds focus. Use the wait time to center yourself.',
      multi_object_tracking: 'Don\'t fixate on one. Keep your attention distributed.',
      rhythm_tap: 'Feel the beat internally. Let your body sync naturally.',
      impulse_spike_test: 'Stay calm under pressure. Deep breaths help.',
      gaze_hold: 'Soft focus on the center. Peripheral awareness is key.',
      moving_target: 'Anticipate movement patterns. Smooth tracking wins.',
      tap_pattern: 'Memorize the pattern first. Speed comes with accuracy.',
      finger_tracing: 'Slow and steady. Precision matters more than speed.',
      multi_task_tap: 'Switch focus deliberately. Don\'t rush between tasks.',
      reset: 'Take this moment to reset. Clear your mind for the next challenge.',
      default: 'Practice consistently. Small improvements add up to mastery.',
    };
    return tips[challengeType] || tips.default;
  };

  // Calculate performance metrics deterministically based on score
  const getPerformanceBreakdown = () => {
    const stability = Math.min(100, Math.round(score * 0.92 + 8));
    const accuracy = Math.min(100, Math.round(score * 0.88 + 10));
    
    return { stability, accuracy };
  };

  const breakdown = getPerformanceBreakdown();
  const scoreColor = getScoreColor();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* Background */}
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#334155']}
        style={StyleSheet.absoluteFill}
      />

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

      <Animated.View
        style={[
          styles.contentWrapper,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.contentContainer}>
          {/* Top Section - Score & Status */}
          <View style={styles.topSection}>
            {/* Emoji and Badge */}
            <View style={styles.emojiBadgeContainer}>
              <Text style={styles.emoji}>{getScoreEmoji()}</Text>
              <View style={[
                styles.passFailBadge,
                { 
                  backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  borderColor: isPassed ? '#10B981' : '#EF4444',
                }
              ]}>
                <Text style={[
                  styles.passFailText,
                  { color: isPassed ? '#10B981' : '#EF4444' }
                ]}>
                  {isPassed ? '✓ PASSED' : '✗ FAILED'}
                </Text>
              </View>
            </View>

            {/* Score Display */}
            <View style={styles.scoreDisplayContainer}>
              <LinearGradient
                colors={[scoreColor + '20', scoreColor + '05']}
                style={styles.scoreCircleGradient}
              >
                <View style={[
                  styles.scoreCircle,
                  { borderColor: scoreColor + '60' }
                ]}>
                  <Animated.Text style={[styles.scoreNumber, { color: scoreColor }]}>
                    {animatedScore}
                  </Animated.Text>
                  <Text style={styles.scoreLabel}>SCORE</Text>
                </View>
              </LinearGradient>
              
              <View style={styles.scoreInfoColumn}>
                <Text style={[styles.scoreMessage, { color: scoreColor }]}>
                  {getScoreMessage()}
                </Text>
                <Text style={styles.challengeName} numberOfLines={1}>
                  {getChallengeName(challengeType)}
                </Text>
                <View style={styles.challengeMeta}>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>Lv {level}</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaText}>{(duration / 1000).toFixed(1)}s</Text>
                  </View>
                </View>
                <View style={styles.xpBadge}>
                  <Text style={styles.xpIcon}>✨</Text>
                  <Text style={styles.xpValue}>+{xpEarned} XP</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.performanceCard}>
            <Text style={styles.performanceTitle}>Performance Breakdown</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <View style={styles.metricBarContainer}>
                  <View 
                    style={[
                      styles.metricBarFill, 
                      { 
                        width: `${Math.round(score)}%`, 
                        backgroundColor: scoreColor 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.metricLabel}>Focus</Text>
                <Text style={[styles.metricValue, { color: scoreColor }]}>{Math.round(score)}%</Text>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricBarContainer}>
                  <View 
                    style={[
                      styles.metricBarFill, 
                      { 
                        width: `${breakdown.stability}%`, 
                        backgroundColor: '#6366F1' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.metricLabel}>Stability</Text>
                <Text style={styles.metricValue}>{breakdown.stability}%</Text>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricBarContainer}>
                  <View 
                    style={[
                      styles.metricBarFill, 
                      { 
                        width: `${breakdown.accuracy}%`, 
                        backgroundColor: '#8B5CF6' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.metricLabel}>Accuracy</Text>
                <Text style={styles.metricValue}>{breakdown.accuracy}%</Text>
              </View>
            </View>
          </View>

          {/* Insight & Tip Cards */}
          <View style={styles.insightsRow}>
            <LinearGradient
              colors={['rgba(99, 102, 241, 0.15)', 'rgba(99, 102, 241, 0.05)']}
              style={styles.insightCard}
            >
              <Text style={styles.insightEmoji}>💡</Text>
              <Text style={styles.insightTitle}>Insight</Text>
              <Text style={styles.insightText} numberOfLines={3}>{getInsight()}</Text>
            </LinearGradient>

            <LinearGradient
              colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)']}
              style={styles.tipCard}
            >
              <Text style={styles.tipEmoji}>🎯</Text>
              <Text style={styles.tipTitle}>Pro Tip</Text>
              <Text style={styles.tipText} numberOfLines={3}>{getTip()}</Text>
            </LinearGradient>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {!isPassed && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onRetry();
                }}
                style={styles.retryButton}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>🔄 Try Again</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onContinue();
              }}
              style={styles.continueButtonContainer}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={isPassed ? ['#6366F1', '#8B5CF6'] : ['#6B7280', '#4B5563']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>
                  {isPassed ? '✓ Continue' : '← Go Back'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  topSection: {
    alignItems: 'center',
  },
  emojiBadgeContainer: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  emoji: {
    fontSize: 64,
  },
  passFailBadge: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 2.5,
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  passFailText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  scoreDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    paddingHorizontal: 8,
  },
  scoreCircleGradient: {
    borderRadius: 55,
    padding: 3,
  },
  scoreCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 3.5,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scoreNumber: {
    fontSize: 44,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
    letterSpacing: 1,
  },
  scoreInfoColumn: {
    flex: 1,
    gap: 8,
  },
  scoreMessage: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  challengeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  challengeMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  metaBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    alignSelf: 'flex-start',
    gap: 6,
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
    color: '#A5B4FC',
  },
  performanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    gap: 10,
  },
  metricBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 4,
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
    }),
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  insightsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  insightCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  insightEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A5B4FC',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  insightText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tipCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tipEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C4B5FD',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actions: {
    gap: 12,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButtonContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  continueButton: {
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
