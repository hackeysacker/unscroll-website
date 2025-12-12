// Badge System mechanics and utilities

import type { Badge, BadgeType, BadgeProgress, GameProgress, SkillTreeProgress, ChallengeResult } from '@/types';

// Badge definitions with metadata
export const BADGE_DEFINITIONS: Record<BadgeType, { name: string; description: string; icon: string }> = {
  first_focus: {
    name: 'First Steps',
    description: 'Complete your first focus exercise',
    icon: '🌟',
  },
  focus_master: {
    name: 'Focus Master',
    description: 'Complete all focus exercises with perfect scores',
    icon: '🎯',
  },
  impulse_warrior: {
    name: 'Impulse Warrior',
    description: 'Complete all impulse control exercises',
    icon: '🛡️',
  },
  distraction_shield: {
    name: 'Distraction Shield',
    description: 'Complete all distraction resistance exercises',
    icon: '🔰',
  },
  perfect_streak_5: {
    name: 'Hot Streak',
    description: '5 perfect scores in a row',
    icon: '🔥',
  },
  perfect_streak_10: {
    name: 'Unstoppable',
    description: '10 perfect scores in a row',
    icon: '⚡',
  },
  level_1_complete: {
    name: 'Foundation Built',
    description: 'Complete all exercises in Level 1',
    icon: '🏆',
  },
  level_5_complete: {
    name: 'Rising Star',
    description: 'Complete all exercises in Level 5',
    icon: '⭐',
  },
  level_10_complete: {
    name: 'True Master',
    description: 'Complete all exercises in Level 10',
    icon: '👑',
  },
  speed_demon: {
    name: 'Speed Demon',
    description: 'Complete a challenge in record time',
    icon: '💨',
  },
  zen_master: {
    name: 'Zen Master',
    description: 'Complete all breathing exercises perfectly',
    icon: '🧘',
  },
  eagle_eye: {
    name: 'Eagle Eye',
    description: 'Complete all tracking exercises perfectly',
    icon: '🦅',
  },
  iron_will: {
    name: 'Iron Will',
    description: 'Maintain a 7 day streak',
    icon: '💪',
  },
  dedication: {
    name: 'Dedication',
    description: 'Maintain a 30 day streak',
    icon: '🏅',
  },
  early_bird: {
    name: 'Early Bird',
    description: 'Complete a session before 8 AM',
    icon: '🌅',
  },
  night_owl: {
    name: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: '🦉',
  },
  perfectionist: {
    name: 'Perfectionist',
    description: 'Achieve 100 perfect scores',
    icon: '💎',
  },
  marathon_runner: {
    name: 'Marathon Runner',
    description: 'Complete 100 total challenges',
    icon: '🏃',
  },
};

// Initialize badge progress for a new user
export function initializeBadgeProgress(userId: string): BadgeProgress {
  return {
    userId,
    unlockedBadges: [],
    progress: {},
  };
}

// Check if a badge should be unlocked based on progress
export function checkBadgeUnlock(
  badgeType: BadgeType,
  badgeProgress: BadgeProgress,
  gameProgress: GameProgress,
  skillTree: SkillTreeProgress,
  challengeResults: ChallengeResult[]
): Badge | null {
  // Skip if already unlocked
  if (badgeProgress.unlockedBadges.some(b => b.type === badgeType)) {
    return null;
  }

  const badgeDef = BADGE_DEFINITIONS[badgeType];
  let shouldUnlock = false;

  switch (badgeType) {
    case 'first_focus': {
      const focusChallenges = challengeResults.filter(
        r => ['focus_hold', 'gaze_hold', 'moving_target'].includes(r.type)
      );
      shouldUnlock = focusChallenges.length >= 1;
      break;
    }

    case 'focus_master': {
      const focusChallenges = challengeResults.filter(
        r => ['focus_hold', 'finger_hold', 'slow_tracking', 'gaze_hold', 'moving_target', 'stability_hold'].includes(r.type)
      );
      const perfectFocusChallenges = focusChallenges.filter(r => r.isPerfect);
      shouldUnlock = perfectFocusChallenges.length >= 20;
      break;
    }

    case 'impulse_warrior': {
      const impulseChallenges = challengeResults.filter(
        r => ['tap_only_correct', 'look_away', 'delay_unlock', 'reaction_inhibition', 'multi_task_tap', 'impulse_delay', 'tap_pattern'].includes(r.type)
      );
      shouldUnlock = impulseChallenges.length >= 20;
      break;
    }

    case 'distraction_shield': {
      const distractionChallenges = challengeResults.filter(
        r => ['fake_notifications', 'popup_ignore', 'impulse_spike_test', 'distraction_resistance', 'audio_focus'].includes(r.type)
      );
      shouldUnlock = distractionChallenges.length >= 15;
      break;
    }

    case 'perfect_streak_5': {
      // Check for 5 consecutive perfect scores
      const recentChallenges = challengeResults.slice(-5);
      shouldUnlock = recentChallenges.length === 5 && recentChallenges.every(r => r.isPerfect);
      break;
    }

    case 'perfect_streak_10': {
      // Check for 10 consecutive perfect scores
      const recentChallenges = challengeResults.slice(-10);
      shouldUnlock = recentChallenges.length === 10 && recentChallenges.every(r => r.isPerfect);
      break;
    }

    case 'level_1_complete': {
      shouldUnlock = gameProgress.level >= 2;
      break;
    }

    case 'level_5_complete': {
      shouldUnlock = gameProgress.level >= 6;
      break;
    }

    case 'level_10_complete': {
      shouldUnlock = gameProgress.level >= 11;
      break;
    }

    case 'speed_demon': {
      // Check if any challenge was completed in under 15 seconds
      const fastChallenges = challengeResults.filter(r => r.duration < 15000 && r.score >= 90);
      shouldUnlock = fastChallenges.length > 0;
      break;
    }

    case 'zen_master': {
      const breathingChallenges = challengeResults.filter(
        r => ['breath_pacing', 'controlled_breathing'].includes(r.type)
      );
      const perfectBreathing = breathingChallenges.filter(r => r.isPerfect);
      shouldUnlock = perfectBreathing.length >= 10;
      break;
    }

    case 'eagle_eye': {
      const trackingChallenges = challengeResults.filter(
        r => ['slow_tracking', 'multi_object_tracking', 'finger_tracing', 'moving_target'].includes(r.type)
      );
      const perfectTracking = trackingChallenges.filter(r => r.isPerfect);
      shouldUnlock = perfectTracking.length >= 10;
      break;
    }

    case 'iron_will': {
      shouldUnlock = gameProgress.streak >= 7;
      break;
    }

    case 'dedication': {
      shouldUnlock = gameProgress.streak >= 30;
      break;
    }

    case 'early_bird': {
      // Check if any challenge was completed before 8 AM
      const earlyChallenge = challengeResults.some(r => {
        const date = new Date(r.timestamp);
        return date.getHours() < 8;
      });
      shouldUnlock = earlyChallenge;
      break;
    }

    case 'night_owl': {
      // Check if any challenge was completed after 10 PM
      const lateChallenge = challengeResults.some(r => {
        const date = new Date(r.timestamp);
        return date.getHours() >= 22;
      });
      shouldUnlock = lateChallenge;
      break;
    }

    case 'perfectionist': {
      const perfectChallenges = challengeResults.filter(r => r.isPerfect);
      shouldUnlock = perfectChallenges.length >= 100;
      break;
    }

    case 'marathon_runner': {
      shouldUnlock = gameProgress.totalChallengesCompleted >= 100;
      break;
    }

    default:
      break;
  }

  if (shouldUnlock) {
    const newBadge: Badge = {
      id: crypto.randomUUID(),
      type: badgeType,
      unlockedAt: Date.now(),
      name: badgeDef.name,
      description: badgeDef.description,
      icon: badgeDef.icon,
    };
    return newBadge;
  }

  return null;
}

// Check all badges and return newly unlocked ones
export function checkAllBadges(
  badgeProgress: BadgeProgress,
  gameProgress: GameProgress,
  skillTree: SkillTreeProgress,
  challengeResults: ChallengeResult[]
): Badge[] {
  const newlyUnlockedBadges: Badge[] = [];

  const allBadgeTypes = Object.keys(BADGE_DEFINITIONS) as BadgeType[];

  for (const badgeType of allBadgeTypes) {
    const badge = checkBadgeUnlock(badgeType, badgeProgress, gameProgress, skillTree, challengeResults);
    if (badge) {
      newlyUnlockedBadges.push(badge);
    }
  }

  return newlyUnlockedBadges;
}

// Get badge progress percentage for display
export function getBadgeProgressPercentage(
  badgeType: BadgeType,
  badgeProgress: BadgeProgress,
  gameProgress: GameProgress,
  challengeResults: ChallengeResult[]
): number {
  // Return 100 if already unlocked
  if (badgeProgress.unlockedBadges.some(b => b.type === badgeType)) {
    return 100;
  }

  switch (badgeType) {
    case 'perfect_streak_5': {
      const recentChallenges = challengeResults.slice(-5);
      const consecutivePerfect = recentChallenges.filter(r => r.isPerfect).length;
      return Math.min(100, (consecutivePerfect / 5) * 100);
    }

    case 'perfect_streak_10': {
      const recentChallenges = challengeResults.slice(-10);
      const consecutivePerfect = recentChallenges.filter(r => r.isPerfect).length;
      return Math.min(100, (consecutivePerfect / 10) * 100);
    }

    case 'iron_will': {
      return Math.min(100, (gameProgress.streak / 7) * 100);
    }

    case 'dedication': {
      return Math.min(100, (gameProgress.streak / 30) * 100);
    }

    case 'perfectionist': {
      const perfectChallenges = challengeResults.filter(r => r.isPerfect).length;
      return Math.min(100, (perfectChallenges / 100) * 100);
    }

    case 'marathon_runner': {
      return Math.min(100, (gameProgress.totalChallengesCompleted / 100) * 100);
    }

    default:
      return 0;
  }
}
