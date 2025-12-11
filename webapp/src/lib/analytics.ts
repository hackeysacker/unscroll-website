import type { DeepAnalytics, ChallengeResult, SkillTreeProgress, AnalyticsDataPoint } from '@/types';

export function calculateDeepAnalytics(
  userId: string,
  challengeResults: ChallengeResult[],
  skillTree: SkillTreeProgress
): DeepAnalytics {
  // Filter results for this user
  const userResults = challengeResults.filter(r => r.userId === userId);

  // Calculate attention score (based on focus-related challenges)
  const focusChallenges = userResults.filter(
    r => r.type === 'gaze_hold' || r.type === 'moving_target' || r.type === 'audio_focus'
  );
  const attentionScore = focusChallenges.length > 0
    ? focusChallenges.reduce((sum, r) => sum + r.score, 0) / focusChallenges.length
    : skillTree.focus;

  // Calculate impulse control score
  const impulseChallenges = userResults.filter(
    r => r.type === 'impulse_delay' || r.type === 'tap_pattern'
  );
  const impulseControlScore = impulseChallenges.length > 0
    ? impulseChallenges.reduce((sum, r) => sum + r.score, 0) / impulseChallenges.length
    : skillTree.impulseControl;

  // Calculate distraction resistance score
  const distractionChallenges = userResults.filter(
    r => r.type === 'distraction_resistance' || r.type === 'stability_hold'
  );
  const distractionResistanceScore = distractionChallenges.length > 0
    ? distractionChallenges.reduce((sum, r) => sum + r.score, 0) / distractionChallenges.length
    : skillTree.distractionResistance;

  // Calculate weekly progress (last 7 days)
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weeklyResults = userResults.filter(r => r.timestamp >= weekAgo);

  const weeklyProgress: AnalyticsDataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = now - i * 24 * 60 * 60 * 1000;
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const dayResults = weeklyResults.filter(r => r.timestamp >= dayStart && r.timestamp < dayEnd);

    const avgScore = dayResults.length > 0
      ? dayResults.reduce((sum, r) => sum + r.score, 0) / dayResults.length
      : 0;

    weeklyProgress.push({
      timestamp: dayStart,
      value: avgScore,
    });
  }

  // Calculate monthly progress (last 30 days, grouped by week)
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;
  const monthlyResults = userResults.filter(r => r.timestamp >= monthAgo);

  const monthlyProgress: AnalyticsDataPoint[] = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = now - (i + 1) * 7 * 24 * 60 * 60 * 1000;
    const weekEnd = now - i * 7 * 24 * 60 * 60 * 1000;
    const weekResults = monthlyResults.filter(r => r.timestamp >= weekStart && r.timestamp < weekEnd);

    const avgScore = weekResults.length > 0
      ? weekResults.reduce((sum, r) => sum + r.score, 0) / weekResults.length
      : 0;

    monthlyProgress.push({
      timestamp: weekStart,
      value: avgScore,
    });
  }

  return {
    userId,
    attentionScore: Math.round(attentionScore),
    impulseControlScore: Math.round(impulseControlScore),
    distractionResistanceScore: Math.round(distractionResistanceScore),
    weeklyProgress,
    monthlyProgress,
    lastCalculated: Date.now(),
  };
}
