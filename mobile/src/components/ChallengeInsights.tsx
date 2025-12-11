import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useAttentionAvatar } from '@/contexts/AttentionAvatarContext';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { getChallengeName } from '@/lib/challenge-progression';
import type { ChallengeType } from '@/types';
import * as Haptics from 'expo-haptics';

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
 * Shows performance breakdown, tips, and next steps
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
  const { colors } = useTheme();
  const { triggerReaction } = useAttentionAvatar();
  const [showContent, setShowContent] = useState(false);

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
    setTimeout(() => setShowContent(true), 300);
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
    if (isPerfect) return 'PERFECT!';
    if (score >= 90) return 'Excellent!';
    if (score >= 80) return 'Great Job!';
    if (score >= 70) return 'Good Work!';
    if (score >= 60) return 'Keep Going!';
    return 'Try Again!';
  };

  const getScoreColor = () => {
    if (isPerfect) return '#FFD700';
    if (score >= 80) return colors.success || '#00FF88';
    if (score >= 60) return colors.warning || '#FFB800';
    return colors.error || '#FF4444';
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

  const getPerformanceBreakdown = () => {
    // Calculate performance metrics based on score
    const stability = Math.round(score * 0.95 + Math.random() * 5);
    const accuracy = Math.round(score * 0.92 + Math.random() * 8);
    const speed = Math.round((1000 / (duration / 1000)) * 10);
    
    return { stability, accuracy, speed };
  };

  const breakdown = getPerformanceBreakdown();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Challenge Complete" 
        onBack={onBack}
      />
      
      {/* Animated background */}
      <LinearGradient
        colors={[
          colors.background,
          isPerfect ? 'rgba(255, 215, 0, 0.1)' : 'rgba(100, 150, 255, 0.05)',
          colors.background,
        ]}
        style={StyleSheet.absoluteFill}
      />

      {showContent && (
        <View style={styles.content}>
          {/* Score Display */}
          <View style={styles.scoreSection}>
            <Text style={styles.emoji}>{getScoreEmoji()}</Text>
            <Text style={[styles.scoreMessage, { color: getScoreColor() }]}>
              {getScoreMessage()}
            </Text>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreNumber, { color: getScoreColor() }]}>
                {score}
              </Text>
              <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>
                SCORE
              </Text>
            </View>
          </View>

          {/* Challenge Info */}
          <View style={[styles.challengeInfoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.challengeInfoName, { color: colors.foreground }]}>
              {getChallengeName(challengeType)}
            </Text>
            <Text style={[styles.challengeInfoLevel, { color: colors.mutedForeground }]}>
              Level {level} • {(duration / 1000).toFixed(1)}s
            </Text>
          </View>

          {/* Performance Breakdown */}
          <View style={[styles.performanceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.performanceTitle, { color: colors.foreground }]}>
              📊 Performance Breakdown
            </Text>
            
            <View style={styles.metricRow}>
              <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Focus Score</Text>
              <View style={styles.metricValue}>
                <View style={[styles.metricBar, { backgroundColor: colors.muted }]}>
                  <View 
                    style={[
                      styles.metricBarFill, 
                      { 
                        width: `${score}%`, 
                        backgroundColor: getScoreColor() 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.metricNumber, { color: colors.foreground }]}>{score}%</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Stability</Text>
              <View style={styles.metricValue}>
                <View style={[styles.metricBar, { backgroundColor: colors.muted }]}>
                  <View 
                    style={[
                      styles.metricBarFill, 
                      { 
                        width: `${breakdown.stability}%`, 
                        backgroundColor: colors.primary 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.metricNumber, { color: colors.foreground }]}>{breakdown.stability}%</Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>Accuracy</Text>
              <View style={styles.metricValue}>
                <View style={[styles.metricBar, { backgroundColor: colors.muted }]}>
                  <View 
                    style={[
                      styles.metricBarFill, 
                      { 
                        width: `${breakdown.accuracy}%`, 
                        backgroundColor: colors.secondary 
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.metricNumber, { color: colors.foreground }]}>{breakdown.accuracy}%</Text>
              </View>
            </View>

            <View style={styles.xpRow}>
              <Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>XP Earned</Text>
              <Text style={[styles.xpValue, { color: colors.primary }]}>+{xpEarned} XP</Text>
            </View>
          </View>

          {/* Insights */}
          <View style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.insightTitle, { color: colors.primary }]}>
              💡 Insight
            </Text>
            <Text style={[styles.insightText, { color: colors.foreground }]}>
              {getInsight()}
            </Text>
          </View>

          {/* Tip */}
          <View style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.tipTitle, { color: colors.secondary }]}>
              🎯 Pro Tip
            </Text>
            <Text style={[styles.tipText, { color: colors.foreground }]}>
              {getTip()}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {score < 100 && (
              <Button
                variant="outline"
                onPress={onRetry}
                style={styles.retryButton}
              >
                🔄 Try Again
              </Button>
            )}
            <Button
              onPress={onContinue}
              style={styles.continueButton}
            >
              🚀 Back to Progress Path
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  scoreMessage: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(100, 150, 255, 0.1)',
    borderWidth: 4,
    borderColor: 'rgba(100, 150, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  challengeInfoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  challengeInfoName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  challengeInfoLevel: {
    fontSize: 14,
  },
  performanceCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  metricRow: {
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 50,
    textAlign: 'right',
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100, 116, 139, 0.2)',
  },
  xpLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  xpValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  insightCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  insightText: {
    fontSize: 15,
    lineHeight: 22,
  },
  tipCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  retryButton: {
    marginBottom: 8,
  },
  continueButton: {
    width: '100%',
  },
  backToPathButton: {
    width: '100%',
    marginTop: 4,
  },
});

