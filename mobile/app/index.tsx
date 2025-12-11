import { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { AnimatedSplashScreen } from '@/components/AnimatedSplashScreen';
import { createPersonalizedProgram } from '@/lib/onboarding-personalization';
import { Settings } from '@/components/Settings';
import { LevelPage } from '@/components/LevelPage';
import { ChallengePlayer } from '@/components/ChallengePlayer';
import { ActivityPlayer } from '@/components/ActivityPlayer';
import { ChallengeInsights } from '@/components/ChallengeInsights';
import { Insights } from '@/components/Insights';
import { Premium } from '@/components/Premium';
import { WindDownMode } from '@/components/WindDownMode';
import { AvatarScreen } from '@/components/AvatarScreen';
import { VerticalProgressPath } from '@/components/VerticalProgressPath';
import { SkillTree } from '@/components/SkillTree';
import { PersonalizedTrainingPlanComponent } from '@/components/PersonalizedTrainingPlan';
import { DevTestingMode } from '@/components/DevTestingMode';
import { FocusJourneyPage } from '@/components/FocusJourneyPage';
import { ActivityDetailScreen } from '@/components/ActivityDetailScreen';
import { PracticeScreen } from '@/components/PracticeScreen';
import { LeaderboardScreen } from '@/components/LeaderboardScreen';
import { ProfileScreen } from '@/components/ProfileScreen';

type ViewMode = 'progress-tree' | 'settings' | 'level' | 'challenge' | 'insights-screen' | 'insights' | 'premium' | 'winddown' | 'skill-tree' | 'training-plan' | 'dev-testing' | 'avatar' | 'focus-journey' | 'activity-detail' | 'practice' | 'leaderboard' | 'profile-screen';

function AppContent() {
  const { user, isOnboarded, completeOnboarding, updateOnboardingData } = useAuth();
  const { progress, initializeProgress } = useGame();
  const { colors } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('progress-tree');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedChallenge, setSelectedChallenge] = useState<{
    type: string;
    isTest?: boolean;
    sequence?: string[];
    duration?: number;
    xpReward?: number;
    difficultyLevel?: number;
  } | null>(null);
  const [challengeResult, setChallengeResult] = useState<{
    challengeType: string;
    level: number;
    score: number;
    duration: number;
    isPerfect: boolean;
    xpEarned: number;
  } | null>(null);

  // Show splash screen first
  if (showSplash) {
    return <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Loading state
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading FocusFlow...</Text>
      </View>
    );
  }

  // Onboarding
  if (!isOnboarded) {
    return (
      <OnboardingFlow
        onComplete={async (data) => {
          // Create personalized program from onboarding data
          const program = createPersonalizedProgram(data);

          // Save onboarding data
          await updateOnboardingData({
            dailyScrollHours: data.screenTime,
            attentionBaselineScore: data.baselineScore,
            dailyTrainingMinutes: data.commitmentLevel >= 7 ? 7 : data.commitmentLevel >= 5 ? 5 : 2,
          });

          // Initialize game progress based on baseline
          const startingLevel = program.startingLevel;
          await initializeProgress(startingLevel);

          // Complete onboarding
          await completeOnboarding('improve_focus');
        }}
      />
    );
  }

  // Initialize progress if needed
  if (user && !progress) {
    initializeProgress(1);
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Setting up your dashboard...</Text>
      </View>
    );
  }

  // Settings view
  if (viewMode === 'settings') {
    return (
      <Settings
        onBack={() => setViewMode('progress-tree')}
        onNavigate={(route) => setViewMode(route as ViewMode)}
      />
    );
  }

  // Insights view
  if (viewMode === 'insights') {
    return <Insights onBack={() => setViewMode('progress-tree')} />;
  }

  // Premium view
  if (viewMode === 'premium') {
    return <Premium onBack={() => setViewMode('progress-tree')} />;
  }

  // WindDown view
  if (viewMode === 'winddown') {
    return <WindDownMode onBack={() => setViewMode('progress-tree')} />;
  }

  // Practice view
  if (viewMode === 'practice') {
    return (
      <PracticeScreen
        onBack={() => setViewMode('progress-tree')}
        onSelectPractice={(type) => {
          // Map practice types to actual activity types with appropriate settings
          const practiceConfigs: { [key: string]: { activity: string; duration: number; xp: number } } = {
            'quick-practice': { activity: 'gaze_hold', duration: 30, xp: 15 },
            'focus-training': { activity: 'stillness_test', duration: 60, xp: 20 },
            'breathing': { activity: 'breath_pacing', duration: 45, xp: 10 },
            'weak-skills': { activity: 'reaction_inhibition', duration: 60, xp: 20 },
            'timed-challenge': { activity: 'multi_task_tap', duration: 180, xp: 25 },
            'perfect-run': { activity: 'impulse_spike_test', duration: 60, xp: 30 },
            'memory-boost': { activity: 'memory_flash', duration: 45, xp: 20 },
            'endurance': { activity: 'stillness_test', duration: 120, xp: 50 },
          };

          const config = practiceConfigs[type] || { activity: 'gaze_hold', duration: 60, xp: 15 };
          setSelectedChallenge({
            type: config.activity,
            isTest: false,
            sequence: undefined,
            duration: config.duration,
            xpReward: config.xp,
            difficultyLevel: progress?.level || 1,
          });
          setViewMode('challenge'); // Skip ActivityDetailScreen, go straight to challenge
        }}
      />
    );
  }

  // Leaderboard view
  if (viewMode === 'leaderboard') {
    return <LeaderboardScreen onBack={() => setViewMode('progress-tree')} />;
  }

  // Profile screen view
  if (viewMode === 'profile-screen') {
    return (
      <ProfileScreen
        onBack={() => setViewMode('progress-tree')}
        onNavigate={(route) => {
          if (route === 'settings') {
            setViewMode('settings');
          } else if (route === 'insights') {
            setViewMode('insights');
          } else if (route === 'premium') {
            setViewMode('premium');
          }
        }}
      />
    );
  }

  // ProgressTree view - Vertical Focus Journey with Duolingo elements (Home Screen)
  if (viewMode === 'progress-tree') {
    return (
      <VerticalProgressPath
        onBack={() => {}} // This is now the home screen, no back needed
        onLevelSelect={(level) => {
          setSelectedLevel(level);
          setViewMode('focus-journey');
        }}
        onNavigate={(route) => {
          if (route === 'practice') {
            setViewMode('practice');
          } else if (route === 'leaderboard') {
            setViewMode('leaderboard');
          } else if (route === 'profile-screen') {
            setViewMode('profile-screen');
          }
        }}
      />
    );
  }

  // Focus Journey view - Shows activities for a specific level
  if (viewMode === 'focus-journey') {
    return (
      <FocusJourneyPage
        level={selectedLevel}
        onBack={() => setViewMode('progress-tree')}
        onSelectActivity={(activityType, isTest, testSequence) => {
          // Get activity details from NEW journey-levels system
          const { getJourneyLevel } = require('@/lib/journey-levels');
          const journeyLevel = getJourneyLevel(selectedLevel, progress?.level || 1);
          const activity = journeyLevel.activities.find((a: any) => a.type === activityType);

          setSelectedChallenge({
            type: activityType,
            isTest,
            sequence: testSequence as any,
            duration: activity?.scaledDuration || 60,
            xpReward: activity?.scaledXP || 10,
            difficultyLevel: activity?.difficultyLevel || 1,
          });
          setViewMode('challenge'); // Skip ActivityDetailScreen, go straight to challenge
        }}
      />
    );
  }

  // SkillTree view
  if (viewMode === 'skill-tree') {
    return (
      <SkillTree
        onBack={() => setViewMode('progress-tree')}
      />
    );
  }

  // PersonalizedTrainingPlan view
  if (viewMode === 'training-plan') {
    return (
      <PersonalizedTrainingPlanComponent
        onBack={() => setViewMode('progress-tree')}
        onStartChallenge={(challengeType) => {
          setSelectedChallenge({
            type: challengeType,
            isTest: false,
            sequence: undefined,
          });
          setViewMode('challenge');
        }}
      />
    );
  }

  // DevTestingMode view
  if (viewMode === 'dev-testing') {
    return <DevTestingMode onBack={() => setViewMode('progress-tree')} />;
  }

  // Avatar view
  if (viewMode === 'avatar') {
    return <AvatarScreen onBack={() => setViewMode('progress-tree')} />;
  }

  // Activity Detail view - Shows detailed info before starting challenge
  if (viewMode === 'activity-detail' && selectedChallenge) {
    return (
      <ActivityDetailScreen
        activityType={selectedChallenge.type as any}
        duration={selectedChallenge.duration || 60}
        xpReward={selectedChallenge.xpReward || 10}
        difficultyLevel={selectedChallenge.difficultyLevel || 1}
        onStart={() => {
          setViewMode('challenge');
        }}
        onBack={() => {
          setViewMode('focus-journey');
        }}
      />
    );
  }

  // Challenge insights view
  if (viewMode === 'insights-screen' && challengeResult) {
    return (
      <ChallengeInsights
        challengeType={challengeResult.challengeType as any}
        level={challengeResult.level}
        score={challengeResult.score}
        duration={challengeResult.duration}
        isPerfect={challengeResult.isPerfect}
        xpEarned={challengeResult.xpEarned}
        onContinue={() => {
          setChallengeResult(null);
          setViewMode('progress-tree');
        }}
        onRetry={() => {
          setChallengeResult(null);
          setViewMode('challenge');
        }}
        onBack={() => {
          setChallengeResult(null);
          setViewMode('progress-tree');
        }}
      />
    );
  }

  // Challenge view
  if (viewMode === 'challenge' && selectedChallenge) {
    return (
      <ActivityPlayer
        onBack={() => {
          setViewMode('progress-tree');
          setSelectedChallenge(null);
        }}
        activityType={selectedChallenge.type as any}
        isTest={selectedChallenge.isTest}
        testSequence={selectedChallenge.sequence as any}
        testLevel={selectedLevel}
        onActivityComplete={(score: number, duration: number) => {
          // Go back to progress tree after completing activity
          setSelectedChallenge(null);
          setViewMode('progress-tree');
        }}
      />
    );
  }

  // Level view
  if (viewMode === 'level') {
    return (
      <LevelPage
        level={selectedLevel}
        onBack={() => setViewMode('progress-tree')}
        onSelectChallenge={(challengeType, isTest, sequence) => {
          setSelectedChallenge({
            type: challengeType,
            isTest,
            sequence,
          });
          setViewMode('challenge');
        }}
      />
    );
  }

  // Fallback - return to progress tree (should not reach here normally)
  return (
    <VerticalProgressPath
      onBack={() => {}}
      onLevelSelect={(level) => {
        setSelectedLevel(level);
        setViewMode('focus-journey');
      }}
      onNavigate={(route) => {
        if (route === 'practice') {
          setViewMode('practice');
        } else if (route === 'leaderboard') {
          setViewMode('leaderboard');
        } else if (route === 'profile-screen') {
          setViewMode('profile-screen');
        }
      }}
    />
  );
}

export default function Index() {
  return <AppContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

