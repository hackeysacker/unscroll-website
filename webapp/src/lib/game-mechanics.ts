// Game mechanics calculations and utilities

import type { ChallengeType, SkillPath, UserLevel, ProgressTreeState, ProgressTreeNode } from '@/types';

export const XP_PER_CHALLENGE = 10;
export const XP_PER_SESSION = 30;
export const XP_PER_LEVEL = 200;
export const PERFECT_FOCUS_BONUS = 10;
export const STREAK_MULTIPLIER_THRESHOLD = 4;
export const MAX_LEVEL = 10; // MVP has 10 levels

// Level brackets
export function getUserLevelBracket(level: number): UserLevel {
  if (level >= 1 && level <= 10) return 'beginner';
  if (level >= 11 && level <= 20) return 'intermediate';
  return 'advanced';
}

// Calculate streak multiplier
export function getStreakMultiplier(streak: number): number {
  if (streak < STREAK_MULTIPLIER_THRESHOLD) return 1;
  return 1 + (streak - STREAK_MULTIPLIER_THRESHOLD + 1) * 0.1;
}

// Calculate XP with bonuses
export function calculateXP(baseXP: number, isPerfect: boolean, streak: number): number {
  let xp = baseXP;
  if (isPerfect) xp += PERFECT_FOCUS_BONUS;
  xp *= getStreakMultiplier(streak);
  return Math.floor(xp);
}

// Check if user leveled up
export function checkLevelUp(currentXP: number, currentLevel: number): { newLevel: number; remainingXP: number } {
  let level = currentLevel;
  let xp = currentXP;

  while (xp >= XP_PER_LEVEL && level < MAX_LEVEL) {
    xp -= XP_PER_LEVEL;
    level++;
  }

  return { newLevel: level, remainingXP: xp };
}

// Get challenge difficulty based on level
export function getChallengeDifficulty(challengeType: ChallengeType, userLevel: number): number {
  const baseDifficulty: Record<ChallengeType, number> = {
    // New MVP exercises
    focus_hold: 1,
    finger_hold: 1,
    slow_tracking: 2,
    tap_only_correct: 2,
    breath_pacing: 1,
    fake_notifications: 3,
    look_away: 1,
    delay_unlock: 2,
    anti_scroll_swipe: 2,
    memory_flash: 3,
    reaction_inhibition: 3,
    multi_object_tracking: 3,
    rhythm_tap: 2,
    stillness_test: 2,
    impulse_spike_test: 3,
    finger_tracing: 2,
    multi_task_tap: 3,
    popup_ignore: 3,
    controlled_breathing: 1,
    reset: 1,
    // Legacy exercises
    gaze_hold: 1,
    moving_target: 2,
    distraction_resistance: 3,
    tap_pattern: 2,
    audio_focus: 3,
    impulse_delay: 2,
    stability_hold: 2,
  };

  const base = baseDifficulty[challengeType] || 2;
  const levelMultiplier = 1 + (userLevel - 1) * 0.1;
  return Math.min(10, base * levelMultiplier);
}

// Map challenge to skill path
export function getChallengeSkillPath(challengeType: ChallengeType): SkillPath {
  const mapping: Record<ChallengeType, SkillPath> = {
    // New MVP exercises
    focus_hold: 'focus',
    finger_hold: 'focus',
    slow_tracking: 'focus',
    tap_only_correct: 'impulseControl',
    breath_pacing: 'focus',
    fake_notifications: 'distractionResistance',
    look_away: 'impulseControl',
    delay_unlock: 'impulseControl',
    anti_scroll_swipe: 'impulseControl',
    memory_flash: 'focus',
    reaction_inhibition: 'impulseControl',
    multi_object_tracking: 'focus',
    rhythm_tap: 'focus',
    stillness_test: 'impulseControl',
    impulse_spike_test: 'distractionResistance',
    finger_tracing: 'focus',
    multi_task_tap: 'impulseControl',
    popup_ignore: 'distractionResistance',
    controlled_breathing: 'focus',
    reset: 'focus',
    // Legacy exercises
    gaze_hold: 'focus',
    moving_target: 'focus',
    impulse_delay: 'impulseControl',
    tap_pattern: 'impulseControl',
    distraction_resistance: 'distractionResistance',
    audio_focus: 'distractionResistance',
    stability_hold: 'focus',
  };
  return mapping[challengeType] || 'focus';
}

// Get minimum level to unlock challenge
export function getMinLevelForChallenge(challengeType: ChallengeType): number {
  const minLevels: Record<ChallengeType, number> = {
    // New MVP exercises - all available from level 1
    focus_hold: 1,
    finger_hold: 1,
    slow_tracking: 1,
    tap_only_correct: 1,
    breath_pacing: 1,
    fake_notifications: 1,
    look_away: 1,
    delay_unlock: 1,
    anti_scroll_swipe: 1,
    memory_flash: 1,
    reaction_inhibition: 1,
    multi_object_tracking: 1,
    rhythm_tap: 1,
    stillness_test: 1,
    impulse_spike_test: 1,
    finger_tracing: 1,
    multi_task_tap: 1,
    popup_ignore: 1,
    controlled_breathing: 1,
    reset: 1,
    // Legacy exercises
    gaze_hold: 1,
    moving_target: 1,
    tap_pattern: 1,
    impulse_delay: 1,
    distraction_resistance: 1,
    audio_focus: 1,
    stability_hold: 1,
  };
  return minLevels[challengeType] || 1;
}

// Check if challenge is unlocked
export function isChallengeUnlocked(challengeType: ChallengeType, userLevel: number): boolean {
  return userLevel >= getMinLevelForChallenge(challengeType);
}

// Get available challenges for user level
export function getAvailableChallenges(userLevel: number): ChallengeType[] {
  const allChallenges: ChallengeType[] = [
    'gaze_hold',
    'moving_target',
    'distraction_resistance',
    'tap_pattern',
    'breath_pacing',
    'audio_focus',
    'impulse_delay',
    'stability_hold',
  ];

  return allChallenges.filter(challenge => isChallengeUnlocked(challenge, userLevel));
}

// Calculate skill tree progress from challenge results
export function calculateSkillProgress(
  challengeType: ChallengeType,
  score: number,
  currentProgress: number
): number {
  const progressIncrement = score / 100 * 5; // max 5 points per perfect challenge
  return Math.min(100, currentProgress + progressIncrement);
}

// Check if streak should be maintained or broken
export function updateStreak(lastSessionDate: number | null, currentDate: number): {
  newStreak: number;
  shouldFreeze: boolean;
} {
  if (!lastSessionDate) {
    return { newStreak: 1, shouldFreeze: false };
  }

  const lastDate = new Date(lastSessionDate);
  const today = new Date(currentDate);

  // Reset time to midnight for comparison
  lastDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day, no change
    return { newStreak: 0, shouldFreeze: false };
  } else if (daysDiff === 1) {
    // Next day, increment streak
    return { newStreak: 1, shouldFreeze: false };
  } else if (daysDiff === 2) {
    // Missed one day, allow freeze
    return { newStreak: 0, shouldFreeze: true };
  } else {
    // Streak broken
    return { newStreak: 0, shouldFreeze: false };
  }
}

// Score challenge performance (0-100)
export function scoreChallenge(
  challengeType: ChallengeType,
  performance: {
    accuracy?: number;
    duration?: number;
    distractions?: number;
  }
): number {
  // Different scoring logic per challenge type
  switch (challengeType) {
    case 'gaze_hold':
    case 'stability_hold':
      return Math.min(100, (performance.accuracy || 0) * 100);

    case 'moving_target':
    case 'tap_pattern':
      return Math.min(100, (performance.accuracy || 0) * 100);

    case 'distraction_resistance':
    case 'audio_focus':
      const distractionPenalty = (performance.distractions || 0) * 10;
      return Math.max(0, 100 - distractionPenalty);

    case 'impulse_delay':
      const targetDuration = 10000; // 10 seconds
      const actualDuration = performance.duration || 0;
      const accuracy = 1 - Math.abs(actualDuration - targetDuration) / targetDuration;
      return Math.min(100, accuracy * 100);

    case 'breath_pacing':
      return Math.min(100, (performance.accuracy || 0) * 100);

    default:
      return 0;
  }
}

// Level-specific test sequences (from MVP - one for each level 1-10)
const LEVEL_TEST_SEQUENCES: Record<number, ChallengeType[]> = {
  // MVP LEVEL 1 TEST
  1: ['focus_hold', 'tap_only_correct', 'anti_scroll_swipe', 'finger_hold'],

  // MVP LEVEL 2 TEST
  2: ['finger_hold', 'memory_flash', 'tap_only_correct', 'anti_scroll_swipe'],

  // MVP LEVEL 3 TEST
  3: ['slow_tracking', 'memory_flash', 'reaction_inhibition', 'stillness_test'],

  // MVP LEVEL 4 TEST
  4: ['tap_only_correct', 'finger_hold', 'memory_flash', 'anti_scroll_swipe'],

  // MVP LEVEL 5 TEST
  5: ['tap_only_correct', 'slow_tracking', 'memory_flash', 'impulse_spike_test'],

  // MVP LEVEL 6 TEST
  6: ['slow_tracking', 'reaction_inhibition', 'memory_flash', 'anti_scroll_swipe'],

  // MVP LEVEL 7 TEST
  7: ['slow_tracking', 'memory_flash', 'stillness_test', 'delay_unlock'],

  // MVP LEVEL 8 TEST
  8: ['tap_only_correct', 'anti_scroll_swipe', 'memory_flash', 'popup_ignore'],

  // MVP LEVEL 9 TEST
  9: ['slow_tracking', 'reaction_inhibition', 'memory_flash', 'stillness_test', 'delay_unlock'],

  // MVP LEVEL 10 FINAL EXAM
  10: ['focus_hold', 'finger_hold', 'slow_tracking', 'tap_only_correct', 'memory_flash', 'anti_scroll_swipe', 'reaction_inhibition', 'stillness_test', 'breath_pacing', 'delay_unlock'],
};

// Level-specific challenge progressions (Levels 1-10 from MVP - STRICTLY FOLLOWING MVP GUIDE)
const LEVEL_PROGRESSIONS: Record<number, ChallengeType[]> = {
  // LEVEL 1 (Beginner) - Simple tasks, light distractions, very short timers
  1: [
    'focus_hold',              // 1: Focus Hold 7 seconds
    'finger_hold',             // 2: Finger Hold 7 seconds
    'slow_tracking',           // 3: Slow Tracking very slow
    'tap_only_correct',        // 4: Tap green shape only
    'breath_pacing',           // 5: Breath pacing 4 second cycle
    'fake_notifications',      // 6: Ignore 1 fake notification
    'look_away',               // 7: Look Away 7 seconds
    'delay_unlock',            // 8: Delay Unlock 3 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 2 blocks
    'memory_flash',            // 10: Memory flash 1 item
    'reaction_inhibition',     // 11: Reaction inhibition tap only blue
    'multi_object_tracking',   // 12: Multi object track 1 slow target
    'rhythm_tap',              // 13: Rhythm tap slow tempo
    'stillness_test',          // 14: Stillness test 10 seconds
    'impulse_spike_test',      // 15: Impulse spike tiny popup
    'finger_tracing',          // 16: Finger trace short line
    'multi_task_tap',          // 17: Multi task tap 1 hold 1 tap target
    'popup_ignore',            // 18: Ignore 1 color flash
    'controlled_breathing',    // 19: Controlled breathing simple inhale exhale
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 2 (Early Challenge) - More movement, more distractions
  2: [
    'focus_hold',              // 1: Focus Hold 10 seconds
    'finger_hold',             // 2: Finger Hold 12 seconds
    'slow_tracking',           // 3: Slow Tracking slow with tiny burst
    'tap_only_correct',        // 4: Tap green circle
    'breath_pacing',           // 5: Breath pacing 6 seconds
    'fake_notifications',      // 6: Ignore 2 notifications
    'look_away',               // 7: Look Away 10 seconds
    'delay_unlock',            // 8: Delay Unlock 5 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 3 blocks
    'memory_flash',            // 10: Memory flash 2 items
    'reaction_inhibition',     // 11: Reaction inhibition tap only triangle
    'multi_object_tracking',   // 12: Multi object track 1 medium target
    'rhythm_tap',              // 13: Rhythm tap slightly faster
    'stillness_test',          // 14: Stillness test 15 seconds
    'impulse_spike_test',      // 15: Impulse spike bright flash
    'finger_tracing',          // 16: Finger trace short curve
    'multi_task_tap',          // 17: Multi task tap 2 taps
    'popup_ignore',            // 18: Ignore 2 color flashes
    'controlled_breathing',    // 19: Controlled breathing inhale 4 exhale 6
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 3 (User starts feeling difficulty) - Speed increases, memory expands
  3: [
    'focus_hold',              // 1: Focus Hold 15 seconds
    'finger_hold',             // 2: Finger Hold 18 seconds
    'slow_tracking',           // 3: Slow Tracking with turns
    'tap_only_correct',        // 4: Tap shape only after delay
    'breath_pacing',           // 5: Breath pacing 8 seconds
    'fake_notifications',      // 6: Ignore 4 notifications
    'look_away',               // 7: Look Away 15 seconds
    'delay_unlock',            // 8: Delay Unlock 7 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 5 blocks
    'memory_flash',            // 10: Memory flash 3 items
    'reaction_inhibition',     // 11: Reaction inhibition avoid red
    'multi_object_tracking',   // 12: Multi object track 1 fast target
    'rhythm_tap',              // 13: Rhythm tap medium tempo
    'stillness_test',          // 14: Stillness test 20 seconds
    'impulse_spike_test',      // 15: Impulse spike animated bait
    'finger_tracing',          // 16: Finger trace square
    'multi_task_tap',          // 17: Multi task tap 3 shapes
    'popup_ignore',            // 18: Ignore pop ups twice
    'controlled_breathing',    // 19: Controlled breathing 4 in 2 hold 4 out
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 4 (Real attention training) - More complex rules
  4: [
    'focus_hold',              // 1: Focus Hold 18 seconds
    'finger_hold',             // 2: Finger Hold 22 seconds
    'slow_tracking',           // 3: Tracking medium speed
    'tap_only_correct',        // 4: Tap green AND small
    'breath_pacing',           // 5: Breath pacing 10 seconds
    'fake_notifications',      // 6: Ignore 5 rapid notifications
    'look_away',               // 7: Look Away 18 seconds
    'delay_unlock',            // 8: Delay Unlock 10 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 7 blocks
    'memory_flash',            // 10: Memory flash 4 items
    'reaction_inhibition',     // 11: Reaction inhibition reverse rule
    'multi_object_tracking',   // 12: Multi object track 2 slow targets
    'rhythm_tap',              // 13: Rhythm tap sync tone
    'stillness_test',          // 14: Stillness test 30 seconds
    'impulse_spike_test',      // 15: Impulse spike feed preview
    'finger_tracing',          // 16: Finger trace triangle
    'multi_task_tap',          // 17: Multi task tap with switching hands
    'popup_ignore',            // 18: Ignore flashing color chain
    'controlled_breathing',    // 19: Controlled breathing box pattern
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 5 (Intermediate) - Cognitive load goes up
  5: [
    'focus_hold',              // 1: Focus Hold 22 seconds
    'finger_hold',             // 2: Finger Hold 28 seconds
    'slow_tracking',           // 3: Tracking medium with jumps
    'tap_only_correct',        // 4: Tap green circle then blue square
    'breath_pacing',           // 5: Breath pacing 12 seconds
    'fake_notifications',      // 6: Ignore 8 notifications
    'look_away',               // 7: Look Away 22 seconds
    'delay_unlock',            // 8: Delay Unlock 12 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 10 blocks
    'memory_flash',            // 10: Memory flash 5 items
    'reaction_inhibition',     // 11: Reaction inhibition odd shapes
    'multi_object_tracking',   // 12: Multi object track 2 medium targets
    'rhythm_tap',              // 13: Rhythm tap changing tempo
    'stillness_test',          // 14: Stillness test 40 seconds
    'impulse_spike_test',      // 15: Impulse spike fast baits
    'finger_tracing',          // 16: Finger trace cross
    'multi_task_tap',          // 17: Multi task tap 4 shapes
    'popup_ignore',            // 18: Ignore color storm
    'controlled_breathing',    // 19: Controlled breathing 6 in 8 out
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 6 (Advanced) - Working memory turns up
  6: [
    'focus_hold',              // 1: Focus Hold 26 seconds
    'finger_hold',             // 2: Finger Hold 32 seconds
    'slow_tracking',           // 3: Tracking curve paths
    'tap_only_correct',        // 4: Tap after delay
    'breath_pacing',           // 5: Breath pacing triangle pattern
    'fake_notifications',      // 6: Ignore 10 notifications
    'look_away',               // 7: Look Away 26 seconds
    'delay_unlock',            // 8: Delay Unlock 15 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 12 blocks
    'memory_flash',            // 10: Memory flash 6 items
    'reaction_inhibition',     // 11: Reaction inhibition fast cues
    'multi_object_tracking',   // 12: Multi object track 3 shapes
    'rhythm_tap',              // 13: Rhythm tap double beat
    'stillness_test',          // 14: Stillness test 50 seconds
    'impulse_spike_test',      // 15: Impulse spike mixed baits
    'finger_tracing',          // 16: Finger trace long line
    'multi_task_tap',          // 17: Multi task tap 5 shapes
    'popup_ignore',            // 18: Ignore simulated feed
    'controlled_breathing',    // 19: Controlled breathing 4 in 4 hold 6 out
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 7 (Hard Mode) - Users feel real strain
  7: [
    'focus_hold',              // 1: Focus Hold 30 seconds
    'finger_hold',             // 2: Finger Hold 38 seconds
    'slow_tracking',           // 3: Tracking fast
    'tap_only_correct',        // 4: Tap only when size changes
    'breath_pacing',           // 5: Breath pacing 5 in 7 out
    'fake_notifications',      // 6: Ignore 12 notifications
    'look_away',               // 7: Look Away 30 seconds
    'delay_unlock',            // 8: Delay Unlock 18 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 15 blocks
    'memory_flash',            // 10: Memory flash 7 items
    'reaction_inhibition',     // 11: Reaction inhibition timed rule
    'multi_object_tracking',   // 12: Multi object track 4 shapes
    'rhythm_tap',              // 13: Rhythm tap sync to random
    'stillness_test',          // 14: Stillness test 60 seconds
    'impulse_spike_test',      // 15: Impulse spike intense
    'finger_tracing',          // 16: Finger trace big circle
    'multi_task_tap',          // 17: Multi task complex tap
    'popup_ignore',            // 18: Ignore rapid pop ups
    'controlled_breathing',    // 19: Controlled breathing custom
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 8 (Very Hard) - Full attention challenge
  8: [
    'focus_hold',              // 1: Focus Hold 35 seconds
    'finger_hold',             // 2: Finger Hold 45 seconds
    'slow_tracking',           // 3: Tracking very fast
    'tap_only_correct',        // 4: Tap only if color and size and shape match
    'breath_pacing',           // 5: Breath pacing box breathing
    'fake_notifications',      // 6: Ignore 15 notifications
    'look_away',               // 7: Look Away 40 seconds
    'delay_unlock',            // 8: Delay Unlock 22 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 18 blocks
    'memory_flash',            // 10: Memory flash 8 items
    'reaction_inhibition',     // 11: Reaction inhibition heavy bait
    'multi_object_tracking',   // 12: Multi object track 4 medium targets
    'rhythm_tap',              // 13: Rhythm tap complex
    'stillness_test',          // 14: Stillness test 75 seconds
    'impulse_spike_test',      // 15: Impulse spike viral hooks
    'finger_tracing',          // 16: Finger trace spiral
    'multi_task_tap',          // 17: Multi task tap 6 shapes
    'popup_ignore',            // 18: Ignore multi pop up combo
    'controlled_breathing',    // 19: Controlled breathing layered pattern
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 9 (Extreme Challenge) - Nearly max difficulty
  9: [
    'focus_hold',              // 1: Focus Hold 40 seconds
    'finger_hold',             // 2: Finger Hold 55 seconds
    'slow_tracking',           // 3: Tracking with speed bursts
    'tap_only_correct',        // 4: Tap pattern with delay
    'breath_pacing',           // 5: Breath pacing advanced
    'fake_notifications',      // 6: Ignore 20 notifications
    'look_away',               // 7: Look Away 50 seconds
    'delay_unlock',            // 8: Delay Unlock 28 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 22 blocks
    'memory_flash',            // 10: Memory flash 9 items
    'reaction_inhibition',     // 11: Reaction inhibition intense
    'multi_object_tracking',   // 12: Multi object track 4 fast targets
    'rhythm_tap',              // 13: Rhythm tap chain patterns
    'stillness_test',          // 14: Stillness test 90 seconds
    'impulse_spike_test',      // 15: Impulse spike full feed simulation
    'finger_tracing',          // 16: Finger trace long path
    'multi_task_tap',          // 17: Multi task rapid tap
    'popup_ignore',            // 18: Ignore bright flash storm
    'controlled_breathing',    // 19: Controlled breathing more complex
    'reset',                   // 20: Reset (Mini Test)
  ],

  // LEVEL 10 (Final Stage) - Maximum difficulty, designed to be extremely hard and shareable
  10: [
    'focus_hold',              // 1: Focus Hold 45 seconds
    'finger_hold',             // 2: Finger Hold 70 seconds
    'slow_tracking',           // 3: Tracking max speed
    'tap_only_correct',        // 4: Tap only when 3 conditions match
    'breath_pacing',           // 5: Breath pacing advanced multi cycle
    'fake_notifications',      // 6: Ignore nonstop notifications for 5 seconds
    'look_away',               // 7: Look Away 60 seconds
    'delay_unlock',            // 8: Delay Unlock 35 seconds
    'anti_scroll_swipe',       // 9: Anti scroll swipe 30 blocks
    'memory_flash',            // 10: Memory flash 10 items
    'reaction_inhibition',     // 11: Reaction inhibition fastest bait
    'multi_object_tracking',   // 12: Multi object track 5 targets
    'rhythm_tap',              // 13: Rhythm tap expert patterns
    'stillness_test',          // 14: Stillness test 120 seconds
    'impulse_spike_test',      // 15: Impulse spike extreme feed
    'finger_tracing',          // 16: Finger trace maze
    'multi_task_tap',          // 17: Multi task rapid hold and tap
    'popup_ignore',            // 18: Ignore continuous pop ups
    'controlled_breathing',    // 19: Controlled breathing heavy pattern
    'reset',                   // 20: Reset (FINAL EXAM preview)
  ],
};

// Generate progress tree with challenges for each level
export function generateProgressTree(userId: string, currentLevel: number): ProgressTreeState {
  // Ensure currentLevel is valid
  const safeCurrentLevel = Math.max(1, Math.min(MAX_LEVEL, currentLevel));

  const nodes: ProgressTreeNode[] = [];

  // Generate nodes for levels 1-30
  for (let level = 1; level <= MAX_LEVEL; level++) {
    // Each level has 20 exercises + 1 test = 21 total nodes
    const exercisesPerLevel = 20;
    const availableChallenges = getAvailableChallenges(level);

    // Get level-specific progression (if defined) or use cycling pattern
    const levelProgression = LEVEL_PROGRESSIONS[level];

    // Generate 20 exercises
    for (let position = 0; position < exercisesPerLevel; position++) {
      // Use level-specific progression if available, otherwise cycle through available challenges
      const challengeType = levelProgression
        ? levelProgression[position]
        : availableChallenges[position % availableChallenges.length];

      // ⚡ UNLOCK ALL LEVELS FOR DEMO VERSION ⚡
      // Determine node status - all levels unlocked
      let status: 'locked' | 'available' | 'completed' | 'perfect' = 'available';

      // First exercise of Level 1 is the starting point
      if (level === 1 && position === 0) {
        status = 'available';
      }

      const node: ProgressTreeNode = {
        id: `${level}-${position}`,
        level,
        position,
        nodeType: 'exercise',
        challengeType,
        status,
        xpReward: XP_PER_CHALLENGE + (level * 2), // Increase XP reward with level
        starsEarned: 0,
        completedAt: undefined,
      };

      nodes.push(node);
    }

    // Generate 1 test at the end (position 20)
    const testChallengeType = levelProgression ? levelProgression[0] : availableChallenges[0];
    const testSequence = LEVEL_TEST_SEQUENCES[level] || [
      testChallengeType,
      testChallengeType,
      testChallengeType,
    ];

    // ⚡ UNLOCK ALL TESTS FOR DEMO VERSION ⚡
    const testStatus: 'locked' | 'available' | 'completed' | 'perfect' = 'available';

    const testNode: ProgressTreeNode = {
      id: `${level}-test`,
      level,
      position: exercisesPerLevel,
      nodeType: 'test',
      challengeType: testChallengeType,
      testSequence, // Multi-challenge test sequence
      status: testStatus,
      xpReward: XP_PER_CHALLENGE * 5, // Tests give 5x XP
      starsEarned: 0,
      completedAt: undefined,
    };

    nodes.push(testNode);
  }

  // Find the first available node
  const currentNodeId = nodes.find(n => n.status === 'available')?.id || null;

  return {
    userId,
    nodes,
    currentNodeId,
    lastCompletedNodeId: null,
    version: 3, // Bumped version for MVP 20-exercise system
  };
}
