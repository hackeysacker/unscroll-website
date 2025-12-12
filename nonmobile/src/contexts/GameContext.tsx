import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type {
  GameProgress,
  ChallengeResult,
  DailySession,
  SkillTreeProgress,
  UserStats,
  ChallengeType,
  ProgressTreeState,
  HeartState,
  HeartTransaction,
  HeartLossReason,
  HeartGainReason,
  HeartRefillActionType,
  BadgeProgress,
  Badge,
} from '@/types';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '@/lib/storage';
import {
  XP_PER_SESSION,
  checkLevelUp,
  calculateXP,
  updateStreak,
  getChallengeSkillPath,
  calculateSkillProgress,
  generateProgressTree,
} from '@/lib/game-mechanics';
import {
  initializeHeartState,
  processMidnightReset,
  processScheduledRefills,
  loseHeart,
  gainHeart,
  incrementPerfectStreak,
  canStartChallenge,
} from '@/lib/heart-mechanics';
import {
  initializeBadgeProgress,
  checkAllBadges,
} from '@/lib/badge-mechanics';
import { useAuth } from './AuthContext';

interface GameContextType {
  progress: GameProgress | null;
  skillTree: SkillTreeProgress | null;
  stats: UserStats | null;
  todaySession: DailySession | null;
  progressTree: ProgressTreeState | null;
  heartState: HeartState | null;
  badgeProgress: BadgeProgress | null;
  newlyUnlockedBadges: Badge[];
  completeChallenge: (type: ChallengeType, score: number, duration: number) => void;
  completeSession: () => void;
  initializeProgress: (baselineLevel: number) => void;
  loseHeartForReason: (reason: HeartLossReason, challengeId?: string) => boolean;
  gainHeartForReason: (reason: HeartGainReason, challengeId?: string) => void;
  canStartChallenge: (isDifficult?: boolean) => { canStart: boolean; reason?: string };
  completeRefillAction: (action: HeartRefillActionType) => void;
  clearNewBadges: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [skillTree, setSkillTree] = useState<SkillTreeProgress | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [todaySession, setTodaySession] = useState<DailySession | null>(null);
  const [progressTree, setProgressTree] = useState<ProgressTreeState | null>(null);
  const [heartState, setHeartState] = useState<HeartState | null>(null);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgress | null>(null);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<Badge[]>([]);

  // Load game data from storage
  useEffect(() => {
    if (!user) {
      setProgress(null);
      setSkillTree(null);
      setStats(null);
      setTodaySession(null);
      setProgressTree(null);
      setHeartState(null);
      setBadgeProgress(null);
      return;
    }

    const savedProgress = loadFromStorage<GameProgress>(STORAGE_KEYS.GAME_PROGRESS);
    const savedSkillTree = loadFromStorage<SkillTreeProgress>(STORAGE_KEYS.SKILL_TREE);
    const savedStats = loadFromStorage<UserStats>(STORAGE_KEYS.USER_STATS);
    const savedSessions = loadFromStorage<DailySession[]>(STORAGE_KEYS.DAILY_SESSIONS) || [];
    const savedProgressTree = loadFromStorage<ProgressTreeState>(STORAGE_KEYS.PROGRESS_TREE);
    const savedHeartState = loadFromStorage<HeartState>(STORAGE_KEYS.HEART_STATE);

    if (savedProgress && savedProgress.userId === user.id) {
      setProgress(savedProgress);

      // Check if progress tree needs regeneration
      const needsRegeneration =
        !savedProgressTree ||
        savedProgressTree.userId !== user.id ||
        !savedProgressTree.version || // Old version without version field
        savedProgressTree.version < 3 || // Old version (updated to v3 for MVP 20-exercise system)
        !Array.isArray(savedProgressTree.nodes) || // Corrupted data
        savedProgressTree.nodes.length === 0; // Empty nodes

      if (needsRegeneration) {
        console.log('Regenerating progress tree...', {
          reason: !savedProgressTree
            ? 'no saved tree'
            : savedProgressTree.userId !== user.id
              ? 'different user'
              : !savedProgressTree.version
                ? 'no version'
                : savedProgressTree.version < 3
                  ? 'old version (upgrading to v3 for MVP)'
                  : !Array.isArray(savedProgressTree.nodes)
                    ? 'corrupted nodes'
                    : 'empty nodes',
        });
        const newProgressTree = generateProgressTree(user.id, savedProgress.level);
        setProgressTree(newProgressTree);
        saveToStorage(STORAGE_KEYS.PROGRESS_TREE, newProgressTree);
      } else {
        setProgressTree(savedProgressTree);
      }
    }

    if (savedSkillTree && savedSkillTree.userId === user.id) {
      setSkillTree(savedSkillTree);
    }

    if (savedStats) {
      setStats(savedStats);
    }

    // Find today's session
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const session = savedSessions.find(s => {
      const sessionDate = new Date(s.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime() && s.userId === user.id;
    });

    if (session) {
      setTodaySession(session);
    }

    // Load and process heart state
    if (savedHeartState && savedHeartState.userId === user.id) {
      let updatedHeartState = { ...savedHeartState };

      // Check for midnight reset
      const { updatedHeartState: afterMidnight, transaction: midnightTransaction } = processMidnightReset(
        updatedHeartState,
        user.isPremium
      );
      updatedHeartState = afterMidnight;

      if (midnightTransaction) {
        const allTransactions = loadFromStorage<HeartTransaction[]>(STORAGE_KEYS.HEART_TRANSACTIONS) || [];
        allTransactions.push(midnightTransaction);
        saveToStorage(STORAGE_KEYS.HEART_TRANSACTIONS, allTransactions);
      }

      // Check for scheduled refills
      const { updatedHeartState: afterRefills, transactions: refillTransactions } = processScheduledRefills(
        updatedHeartState,
        user.isPremium
      );
      updatedHeartState = afterRefills;

      if (refillTransactions.length > 0) {
        const allTransactions = loadFromStorage<HeartTransaction[]>(STORAGE_KEYS.HEART_TRANSACTIONS) || [];
        allTransactions.push(...refillTransactions);
        saveToStorage(STORAGE_KEYS.HEART_TRANSACTIONS, allTransactions);
      }

      setHeartState(updatedHeartState);
      saveToStorage(STORAGE_KEYS.HEART_STATE, updatedHeartState);
    } else if (user) {
      // Initialize heart state for new user
      const newHeartState = initializeHeartState(user.id);
      setHeartState(newHeartState);
      saveToStorage(STORAGE_KEYS.HEART_STATE, newHeartState);
    }

    // Load and process badge progress
    const savedBadgeProgress = loadFromStorage<BadgeProgress>(STORAGE_KEYS.BADGE_PROGRESS);
    if (savedBadgeProgress && savedBadgeProgress.userId === user.id) {
      setBadgeProgress(savedBadgeProgress);
    } else if (user) {
      // Initialize badge progress for new user
      const newBadgeProgress = initializeBadgeProgress(user.id);
      setBadgeProgress(newBadgeProgress);
      saveToStorage(STORAGE_KEYS.BADGE_PROGRESS, newBadgeProgress);
    }
  }, [user]);

  const initializeProgress = (baselineLevel: number) => {
    if (!user) return;

    const newProgress: GameProgress = {
      userId: user.id,
      level: baselineLevel,
      xp: 0,
      totalXp: 0,
      streak: 0,
      longestStreak: 0,
      lastSessionDate: null,
      streakFreezeUsed: false,
      totalSessionsCompleted: 0,
      totalChallengesCompleted: 0,
    };

    const newSkillTree: SkillTreeProgress = {
      userId: user.id,
      focus: 0,
      impulseControl: 0,
      distractionResistance: 0,
    };

    const newStats: UserStats = {
      totalAttentionTime: 0,
      longestGazeHold: 0,
      focusAccuracy: 0,
      impulseControlScore: 0,
      stabilityRating: 0,
    };

    const newProgressTree = generateProgressTree(user.id, baselineLevel);
    const newHeartState = initializeHeartState(user.id);
    const newBadgeProgress = initializeBadgeProgress(user.id);

    setProgress(newProgress);
    setSkillTree(newSkillTree);
    setStats(newStats);
    setProgressTree(newProgressTree);
    setHeartState(newHeartState);
    setBadgeProgress(newBadgeProgress);

    saveToStorage(STORAGE_KEYS.GAME_PROGRESS, newProgress);
    saveToStorage(STORAGE_KEYS.SKILL_TREE, newSkillTree);
    saveToStorage(STORAGE_KEYS.USER_STATS, newStats);
    saveToStorage(STORAGE_KEYS.PROGRESS_TREE, newProgressTree);
    saveToStorage(STORAGE_KEYS.HEART_STATE, newHeartState);
    saveToStorage(STORAGE_KEYS.BADGE_PROGRESS, newBadgeProgress);
  };

  const completeChallenge = (type: ChallengeType, score: number, duration: number) => {
    if (!user || !progress || !skillTree || !stats || !progressTree || !heartState) return;

    const isPerfect = score >= 95;
    const baseXP = calculateXP(10, isPerfect, progress.streak);

    // Handle perfect streak and heart rewards
    if (isPerfect && heartState) {
      const { updatedHeartState, shouldAwardHeart } = incrementPerfectStreak(heartState, user.isPremium);

      if (shouldAwardHeart) {
        // Award a heart for 3 perfect challenges in a row
        gainHeartForReason('perfect_streak_3');
      } else {
        // Just update the streak count
        setHeartState(updatedHeartState);
        saveToStorage(STORAGE_KEYS.HEART_STATE, updatedHeartState);
      }
    }

    const result: ChallengeResult = {
      id: crypto.randomUUID(),
      userId: user.id,
      type,
      timestamp: Date.now(),
      score,
      duration,
      xpEarned: baseXP,
      isPerfect,
    };

    // Update skill tree
    const skillPath = getChallengeSkillPath(type);
    const currentSkillProgress = skillTree[skillPath];
    const newSkillProgress = calculateSkillProgress(type, score, currentSkillProgress);
    const updatedSkillTree = { ...skillTree, [skillPath]: newSkillProgress };

    // Update stats
    const updatedStats = { ...stats };
    updatedStats.totalAttentionTime += duration;

    if (type === 'gaze_hold' && duration > updatedStats.longestGazeHold) {
      updatedStats.longestGazeHold = duration;
    }

    // Update progress tree
    const updatedProgressTree = { ...progressTree };
    const currentNodeIndex = updatedProgressTree.nodes.findIndex(n => n.id === progressTree.currentNodeId);

    if (currentNodeIndex >= 0) {
      const currentNode = updatedProgressTree.nodes[currentNodeIndex];

      // Calculate stars based on score
      let stars = 1;
      if (score >= 95) stars = 3;
      else if (score >= 80) stars = 2;

      // Update current node
      updatedProgressTree.nodes[currentNodeIndex] = {
        ...currentNode,
        status: score >= 95 ? 'perfect' : 'completed',
        starsEarned: stars,
        completedAt: Date.now(),
      };

      updatedProgressTree.lastCompletedNodeId = currentNode.id;

      // Check if this was a test
      if (currentNode.nodeType === 'test') {
        // Test completed - check if passed (need 80+ score to pass)
        if (score >= 80) {
          // Unlock first exercise of next level
          const nextLevelFirstExercise = updatedProgressTree.nodes.find(
            n => n.level === currentNode.level + 1 && n.position === 0 && n.nodeType === 'exercise'
          );

          if (nextLevelFirstExercise) {
            const nextLevelFirstIndex = updatedProgressTree.nodes.findIndex(n => n.id === nextLevelFirstExercise.id);
            updatedProgressTree.nodes[nextLevelFirstIndex] = {
              ...nextLevelFirstExercise,
              status: 'available',
            };
            updatedProgressTree.currentNodeId = nextLevelFirstExercise.id;
          } else {
            // No more levels
            updatedProgressTree.currentNodeId = null;
          }
        } else {
          // Failed test - stay on same test
          updatedProgressTree.nodes[currentNodeIndex] = {
            ...currentNode,
            status: 'available',
            starsEarned: 0,
            completedAt: undefined,
          };
          updatedProgressTree.currentNodeId = currentNode.id;
        }
      } else {
        // This was an exercise
        // Check if this was the last exercise (position 19)
        if (currentNode.position === 19) {
          // Unlock the test for this level
          const testNode = updatedProgressTree.nodes.find(
            n => n.level === currentNode.level && n.nodeType === 'test'
          );

          if (testNode) {
            const testIndex = updatedProgressTree.nodes.findIndex(n => n.id === testNode.id);
            updatedProgressTree.nodes[testIndex] = {
              ...testNode,
              status: 'available',
            };
            updatedProgressTree.currentNodeId = testNode.id;
          }
        } else {
          // Unlock next exercise
          const nextNode = updatedProgressTree.nodes[currentNodeIndex + 1];
          if (nextNode && nextNode.status === 'locked' && nextNode.nodeType === 'exercise') {
            updatedProgressTree.nodes[currentNodeIndex + 1] = {
              ...nextNode,
              status: 'available',
            };
            updatedProgressTree.currentNodeId = nextNode.id;
          } else {
            updatedProgressTree.currentNodeId = null;
          }
        }
      }
    }

    // Update today's session
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let session = todaySession;
    if (!session) {
      session = {
        id: crypto.randomUUID(),
        userId: user.id,
        date: today.getTime(),
        challenges: [],
        totalXp: 0,
        completed: false,
      };
    }

    session.challenges.push(result);
    session.totalXp += baseXP;

    // Update progress with XP immediately (not waiting for session completion)
    const newTotalXP = progress.xp + baseXP;
    const { newLevel, remainingXP } = checkLevelUp(newTotalXP, progress.level);

    const updatedProgress: GameProgress = {
      ...progress,
      level: newLevel,
      xp: remainingXP,
      totalXp: progress.totalXp + baseXP,
      totalChallengesCompleted: progress.totalChallengesCompleted + 1,
    };

    // Save challenge result
    const allResults = loadFromStorage<ChallengeResult[]>(STORAGE_KEYS.CHALLENGE_RESULTS) || [];
    allResults.push(result);
    saveToStorage(STORAGE_KEYS.CHALLENGE_RESULTS, allResults);

    // Save session
    const allSessions = loadFromStorage<DailySession[]>(STORAGE_KEYS.DAILY_SESSIONS) || [];
    const sessionIndex = allSessions.findIndex(s => s.id === session.id);
    if (sessionIndex >= 0) {
      allSessions[sessionIndex] = session;
    } else {
      allSessions.push(session);
    }
    saveToStorage(STORAGE_KEYS.DAILY_SESSIONS, allSessions);

    setProgress(updatedProgress);
    setTodaySession(session);
    setSkillTree(updatedSkillTree);
    setStats(updatedStats);
    setProgressTree(updatedProgressTree);

    saveToStorage(STORAGE_KEYS.GAME_PROGRESS, updatedProgress);
    saveToStorage(STORAGE_KEYS.SKILL_TREE, updatedSkillTree);
    saveToStorage(STORAGE_KEYS.USER_STATS, updatedStats);
    saveToStorage(STORAGE_KEYS.PROGRESS_TREE, updatedProgressTree);

    // Check for newly unlocked badges
    if (badgeProgress) {
      const newBadges = checkAllBadges(badgeProgress, updatedProgress, updatedSkillTree, allResults);
      if (newBadges.length > 0) {
        const updatedBadgeProgress = {
          ...badgeProgress,
          unlockedBadges: [...badgeProgress.unlockedBadges, ...newBadges],
        };
        setBadgeProgress(updatedBadgeProgress);
        saveToStorage(STORAGE_KEYS.BADGE_PROGRESS, updatedBadgeProgress);
        setNewlyUnlockedBadges(newBadges);
      }
    }
  };

  const completeSession = () => {
    if (!user || !progress || !todaySession || !heartState) return;

    if (todaySession.challenges.length < 3) {
      console.warn('Session requires 3 challenges to complete');
      return;
    }

    // Mark session as completed
    const completedSession = { ...todaySession, completed: true };

    // Award a heart for completing daily session
    gainHeartForReason('daily_session_complete');

    // Calculate session XP
    const sessionXP = calculateXP(XP_PER_SESSION, false, progress.streak);
    const totalXP = progress.xp + todaySession.totalXp + sessionXP;

    // Update streak
    const streakUpdate = updateStreak(progress.lastSessionDate, Date.now());
    let newStreak = progress.streak;
    let streakFreezeUsed = progress.streakFreezeUsed;

    if (streakUpdate.newStreak > 0) {
      newStreak += streakUpdate.newStreak;
    } else if (streakUpdate.shouldFreeze && !progress.streakFreezeUsed) {
      // Use freeze
      streakFreezeUsed = true;
    } else if (!streakUpdate.shouldFreeze && streakUpdate.newStreak === 0) {
      // Reset streak
      newStreak = 1;
      streakFreezeUsed = false;
    }

    // Check for level up
    const { newLevel, remainingXP } = checkLevelUp(totalXP, progress.level);

    const updatedProgress: GameProgress = {
      ...progress,
      level: newLevel,
      xp: remainingXP,
      totalXp: progress.totalXp + totalXP,
      streak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastSessionDate: Date.now(),
      streakFreezeUsed,
      totalSessionsCompleted: progress.totalSessionsCompleted + 1,
      totalChallengesCompleted: progress.totalChallengesCompleted + todaySession.challenges.length,
    };

    // Save everything
    const allSessions = loadFromStorage<DailySession[]>(STORAGE_KEYS.DAILY_SESSIONS) || [];
    const sessionIndex = allSessions.findIndex(s => s.id === completedSession.id);
    if (sessionIndex >= 0) {
      allSessions[sessionIndex] = completedSession;
    }
    saveToStorage(STORAGE_KEYS.DAILY_SESSIONS, allSessions);

    setProgress(updatedProgress);
    setTodaySession(completedSession);
    saveToStorage(STORAGE_KEYS.GAME_PROGRESS, updatedProgress);
  };

  // Heart System Methods
  const loseHeartForReason = (reason: HeartLossReason, challengeId?: string): boolean => {
    if (!user || !heartState) return false;

    const { updatedHeartState, transaction, canContinue } = loseHeart(
      heartState,
      reason,
      user.isPremium,
      challengeId
    );

    setHeartState(updatedHeartState);
    saveToStorage(STORAGE_KEYS.HEART_STATE, updatedHeartState);

    if (transaction) {
      const allTransactions = loadFromStorage<HeartTransaction[]>(STORAGE_KEYS.HEART_TRANSACTIONS) || [];
      allTransactions.push(transaction);
      saveToStorage(STORAGE_KEYS.HEART_TRANSACTIONS, allTransactions);
    }

    return canContinue;
  };

  const gainHeartForReason = (reason: HeartGainReason, challengeId?: string): void => {
    if (!user || !heartState) return;

    const { updatedHeartState, transaction } = gainHeart(heartState, reason, user.isPremium, challengeId);

    setHeartState(updatedHeartState);
    saveToStorage(STORAGE_KEYS.HEART_STATE, updatedHeartState);

    if (transaction) {
      const allTransactions = loadFromStorage<HeartTransaction[]>(STORAGE_KEYS.HEART_TRANSACTIONS) || [];
      allTransactions.push(transaction);
      saveToStorage(STORAGE_KEYS.HEART_TRANSACTIONS, allTransactions);
    }
  };

  const canStartChallengeCheck = (isDifficult = false): { canStart: boolean; reason?: string } => {
    if (!user || !heartState) {
      return { canStart: false, reason: 'Loading...' };
    }

    return canStartChallenge(heartState, user.isPremium, isDifficult);
  };

  const completeRefillAction = (action: HeartRefillActionType): void => {
    // For now, all refill actions give 1 heart
    // In the future, we could add different logic per action type
    const reasonMap: Record<HeartRefillActionType, HeartGainReason> = {
      breathing_exercise: 'breathing_exercise',
      micro_focus: 'micro_focus',
      invite_friend: 'invite_friend',
      watch_tip: 'watch_tip',
    };

    gainHeartForReason(reasonMap[action]);
  };

  const clearNewBadges = (): void => {
    setNewlyUnlockedBadges([]);
  };

  return (
    <GameContext.Provider
      value={{
        progress,
        skillTree,
        stats,
        todaySession,
        progressTree,
        heartState,
        badgeProgress,
        newlyUnlockedBadges,
        completeChallenge,
        completeSession,
        initializeProgress,
        loseHeartForReason,
        gainHeartForReason,
        canStartChallenge: canStartChallengeCheck,
        completeRefillAction,
        clearNewBadges,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
