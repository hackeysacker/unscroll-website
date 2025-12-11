// Core type definitions for the FocusFlow app

export type GoalType = 'reduce_doomscrolling' | 'improve_focus' | 'build_impulse_control' | 'calm_mind';

export type ChallengeType =
  | 'focus_hold'              // Exercise 1: Focus Hold
  | 'finger_hold'             // Exercise 2: Finger Hold
  | 'slow_tracking'           // Exercise 3: Slow Tracking
  | 'tap_only_correct'        // Exercise 4: Tap Only When Correct
  | 'breath_pacing'           // Exercise 5: Breath Pacing
  | 'fake_notifications'      // Exercise 6: Fake Notifications
  | 'look_away'               // Exercise 7: Look Away
  | 'delay_unlock'            // Exercise 8: Delay Unlock
  | 'anti_scroll_swipe'       // Exercise 9: Anti Scroll Swipe
  | 'memory_flash'            // Exercise 10: Memory Flash
  | 'reaction_inhibition'     // Exercise 11: Reaction Inhibition
  | 'multi_object_tracking'   // Exercise 12: Multi Object Tracking
  | 'rhythm_tap'              // Exercise 13: Rhythm Tap
  | 'stillness_test'          // Exercise 14: Stillness Test
  | 'impulse_spike_test'      // Exercise 15: Impulse Spike Test
  | 'finger_tracing'          // Exercise 16: Finger Tracing
  | 'multi_task_tap'          // Exercise 17: Multi Task Tap
  | 'popup_ignore'            // Exercise 18: Pop-Up Ignore
  | 'controlled_breathing'    // Exercise 19: Controlled Breathing
  | 'reset'                   // Exercise 20: Reset (Mini Test)

  // Legacy challenge types (kept for backwards compatibility)
  | 'gaze_hold'
  | 'moving_target'
  | 'distraction_resistance'
  | 'tap_pattern'
  | 'audio_focus'
  | 'impulse_delay'
  | 'stability_hold';

export type SkillPath = 'focus' | 'impulseControl' | 'distractionResistance';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

// Onboarding data types
export type DistractionApp = 'tiktok' | 'instagram' | 'youtube' | 'snapchat' | 'other';
export type WorstScrollTime = 'morning_bed' | 'work_breaks' | 'after_school' | 'evenings' | 'late_night';
export type ImprovementReason = 'more_focus' | 'better_sleep' | 'mental_clarity' | 'productivity' | 'discipline' | 'other';
export type UserPersonalityType = 'overthinker' | 'procrastinator' | 'night_scroller' | 'impulse_tapper' | 'work_distracter' | 'focus_beginner';
export type OnboardingGoalResult = 'better_sleep' | 'reduce_scrolling' | 'improve_focus' | 'build_discipline';

export interface OnboardingData {
  dailyScrollHours?: number; // 0-6
  primaryDistractionApp?: DistractionApp;
  worstScrollTime?: WorstScrollTime;
  improvementReason?: ImprovementReason;
  wantsAutoTracking?: boolean;
  attentionBaselineScore?: number; // 0-100 from 8-second test
  goalResult?: OnboardingGoalResult;
  dailyTrainingMinutes?: number; // 2, 5, 7, or custom
  userPersonalityType?: UserPersonalityType;
  hasAcceptedNotifications?: boolean;
  hasAcceptedScreenTime?: boolean;
  hasAcceptedDailyCheckIn?: boolean;
  completedOnboardingAt?: number;
}

export interface User {
  id: string;
  email?: string;
  createdAt: number;
  goal?: GoalType;
  isPremium: boolean;
  onboardingData?: OnboardingData;
}

export interface GameProgress {
  userId: string;
  level: number; // 1-30
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastSessionDate: number | null;
  streakFreezeUsed: boolean;
  totalSessionsCompleted: number;
  totalChallengesCompleted: number;
}

export interface ChallengeResult {
  id: string;
  userId: string;
  type: ChallengeType;
  timestamp: number;
  score: number; // 0-100
  duration: number; // milliseconds
  xpEarned: number;
  isPerfect: boolean;
}

export interface DailySession {
  id: string;
  userId: string;
  date: number;
  challenges: ChallengeResult[];
  totalXp: number;
  completed: boolean;
}

export interface SkillTreeProgress {
  userId: string;
  focus: number; // 0-100
  impulseControl: number; // 0-100
  distractionResistance: number; // 0-100
}

export interface UserStats {
  totalAttentionTime: number; // milliseconds
  longestGazeHold: number; // milliseconds
  focusAccuracy: number; // percentage
  impulseControlScore: number; // percentage
  stabilityRating: number; // 0-100
}

export interface AppSettings {
  userId: string;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  notificationsEnabled: boolean;
}

export interface BaselineTestResult {
  userId: string;
  score: number; // 0-100
  duration: number; // milliseconds
  timestamp: number;
  assignedLevel: number;
}

// Challenge configuration
export interface ChallengeConfig {
  type: ChallengeType;
  name: string;
  description: string;
  minLevel: number; // minimum level to unlock
  skillPath: SkillPath;
  difficulty: (level: number) => number; // function that returns difficulty based on user level
  duration: number; // milliseconds
}

// Notification types
export interface NotificationSchedule {
  userId: string;
  dailyReminderTime: string; // HH:mm format
  enabled: boolean;
}

// Progress Tree
export type ProgressNodeStatus = 'locked' | 'available' | 'completed' | 'perfect';
export type ProgressNodeType = 'exercise' | 'test';

export interface ProgressTreeNode {
  id: string;
  level: number; // Which level this node belongs to (1-30)
  position: number; // Position within the level (0-20: 0-19 are exercises, 20 is the test)
  nodeType: ProgressNodeType; // 'exercise' or 'test'
  challengeType: ChallengeType;
  testSequence?: ChallengeType[]; // For tests: sequence of challenges to complete
  status: ProgressNodeStatus;
  xpReward: number;
  starsEarned: number; // 0-3 stars based on performance
  completedAt?: number;
}

export interface ProgressTreeState {
  userId: string;
  nodes: ProgressTreeNode[];
  currentNodeId: string | null; // The next available challenge
  lastCompletedNodeId: string | null;
  version?: number; // Data structure version for migration
}

// Premium Features

// Personalized Training Plan
export interface TrainingPlanRecommendation {
  id: string;
  challengeType: ChallengeType;
  reason: string; // Why this challenge is recommended
  priority: 'high' | 'medium' | 'low';
}

export interface PersonalizedTrainingPlan {
  userId: string;
  generatedAt: number;
  recommendations: TrainingPlanRecommendation[];
  focusAreas: SkillPath[]; // Areas that need improvement
  streakBonus: boolean; // Whether user has good streak consistency
  lastUpdated: number;
}

// Deep Analytics
export interface AnalyticsDataPoint {
  timestamp: number;
  value: number;
}

export interface DeepAnalytics {
  userId: string;
  attentionScore: number; // 0-100
  impulseControlScore: number; // 0-100
  distractionResistanceScore: number; // 0-100
  weeklyProgress: AnalyticsDataPoint[];
  monthlyProgress: AnalyticsDataPoint[];
  lastCalculated: number;
}

// Wind-Down Mode
export interface WindDownSession {
  id: string;
  userId: string;
  startedAt: number;
  completedAt?: number;
  duration: number; // milliseconds
  breathingExercises: number; // count of exercises completed
  completed: boolean;
}

export interface WindDownSettings {
  userId: string;
  enabled: boolean;
  duration: number; // Default duration in minutes
  breathingPattern: 'box' | 'relaxing' | 'sleep'; // Different breathing patterns
}

// Theme System
export type ThemeType =
  | 'noir-cinema'             // Dramatic film noir with amber highlights
  | 'tokyo-neon'              // Cyberpunk electric pink & cyan
  | 'aura-glass'              // Ethereal frosted glass lavender
  | 'paper-craft'             // Artisanal warm off-white & terracotta
  | 'arctic-aurora'           // Deep arctic blues with aurora greens
  | 'rose-quartz'             // Luxurious dark with rose gold
  | 'matcha-zen'              // Japanese deep matcha & cream
  | 'cosmic-void'             // Ultra-deep space with nebula purples

export interface UserTheme {
  userId: string;
  selectedTheme: ThemeType;
  unlocked: ThemeType[]; // Premium users unlock all themes
}

// Heart System (Focus Health)
export type HeartRefillActionType = 'breathing_exercise' | 'micro_focus' | 'invite_friend' | 'watch_tip';

export interface HeartState {
  userId: string;
  currentHearts: number; // 0-5 (max)
  maxHearts: number; // Always 5 for free users
  lastHeartLost: number | null; // timestamp
  lastMidnightReset: number | null; // timestamp of last midnight reset
  heartRefillSlots: HeartRefillSlot[]; // Track when hearts will refill
  perfectStreakCount: number; // Count of consecutive perfect challenges (resets on error)
  totalHeartsLost: number; // Lifetime stat
  totalHeartsGained: number; // Lifetime stat
}

export interface HeartRefillSlot {
  id: string;
  scheduledRefillTime: number; // timestamp when this heart will refill
  isRefilled: boolean;
}

export interface HeartTransaction {
  id: string;
  userId: string;
  timestamp: number;
  type: 'loss' | 'gain' | 'refill';
  amount: number; // usually 1, but can be more for bonuses
  reason: HeartLossReason | HeartGainReason;
  challengeId?: string; // Link to specific challenge if applicable
}

export type HeartLossReason =
  | 'focus_break' // Lost focus during hold challenge
  | 'wrong_tap' // Tapped wrong object
  | 'distraction_fail' // Failed distraction test
  | 'early_quit' // Quit challenge before completion
  | 'test_fail'; // Failed a test

export type HeartGainReason =
  | 'daily_session_complete' // Completed full daily session
  | 'perfect_streak_3' // 3 challenges in a row without errors
  | 'focus_reset_animation' // Watched calming focus reset
  | 'breathing_exercise' // Completed breathing exercise
  | 'micro_focus' // Completed micro-focus challenge
  | 'invite_friend' // Invited a friend
  | 'watch_tip' // Watched a tip lesson
  | 'midnight_reset' // Daily reset at midnight
  | 'hourly_refill'; // 1 heart every 4 hours

// Badge System
export type BadgeType =
  | 'first_focus' // Complete first focus exercise
  | 'focus_master' // Complete all focus exercises perfectly
  | 'impulse_warrior' // Complete all impulse control exercises
  | 'distraction_shield' // Complete all distraction resistance exercises
  | 'perfect_streak_5' // 5 perfect scores in a row
  | 'perfect_streak_10' // 10 perfect scores in a row
  | 'level_1_complete' // Complete level 1
  | 'level_5_complete' // Complete level 5
  | 'level_10_complete' // Complete level 10 - Master
  | 'speed_demon' // Complete a challenge under time
  | 'zen_master' // Complete all breathing exercises perfectly
  | 'eagle_eye' // Complete all tracking exercises perfectly
  | 'iron_will' // Complete 7 day streak
  | 'dedication' // Complete 30 day streak
  | 'early_bird' // Complete a session before 8 AM
  | 'night_owl' // Complete a session after 10 PM
  | 'perfectionist' // 100 perfect scores
  | 'marathon_runner'; // 100 total challenges completed

export interface Badge {
  id: string;
  type: BadgeType;
  unlockedAt: number;
  name: string;
  description: string;
  icon: string;
}

export interface BadgeProgress {
  userId: string;
  unlockedBadges: Badge[];
  progress: Partial<Record<BadgeType, number>>; // Track progress toward each badge
}
