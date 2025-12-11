import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/GameContext';
import { getAvailableChallenges } from '@/lib/game-mechanics';
import { TestMode } from './TestMode';
// Legacy challenges
import { GazeHoldChallenge } from './challenges/GazeHoldChallenge';
import { MovingTargetChallenge } from './challenges/MovingTargetChallenge';
import { BreathPacingChallenge } from './challenges/BreathPacingChallenge';
import { TapPatternChallenge } from './challenges/TapPatternChallenge';
import { DistractionResistanceChallenge } from './challenges/DistractionResistanceChallenge';
import { ImpulseDelayChallenge } from './challenges/ImpulseDelayChallenge';
import { StabilityHoldChallenge } from './challenges/StabilityHoldChallenge';
import { AudioFocusChallenge } from './challenges/AudioFocusChallenge';

// New MVP challenges
import { FocusHoldChallenge } from './challenges/FocusHoldChallenge';
import { FingerHoldChallenge } from './challenges/FingerHoldChallenge';
import { SlowTrackingChallenge } from './challenges/SlowTrackingChallenge';
import { TapOnlyCorrectChallenge } from './challenges/TapOnlyCorrectChallenge';
import { FakeNotificationsChallenge } from './challenges/FakeNotificationsChallenge';
import { LookAwayChallenge } from './challenges/LookAwayChallenge';
import { DelayUnlockChallenge } from './challenges/DelayUnlockChallenge';
import { AntiScrollSwipeChallenge } from './challenges/AntiScrollSwipeChallenge';
import { MemoryFlashChallenge } from './challenges/MemoryFlashChallenge';
import { ReactionInhibitionChallenge } from './challenges/ReactionInhibitionChallenge';
import { MultiObjectTrackingChallenge } from './challenges/MultiObjectTrackingChallenge';
import { RhythmTapChallenge } from './challenges/RhythmTapChallenge';
import { StillnessTestChallenge } from './challenges/StillnessTestChallenge';
import { ImpulseSpikeTestChallenge } from './challenges/ImpulseSpikeTestChallenge';
import { FingerTracingChallenge } from './challenges/FingerTracingChallenge';
import { MultiTaskTapChallenge } from './challenges/MultiTaskTapChallenge';
import { PopupIgnoreChallenge } from './challenges/PopupIgnoreChallenge';
import { ControlledBreathingChallenge } from './challenges/ControlledBreathingChallenge';
import { ResetChallenge } from './challenges/ResetChallenge';
import type { ChallengeType } from '@/types';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface ChallengePlayerProps {
  onBack: () => void;
  preSelectedChallenge?: ChallengeType | null;
  isTest?: boolean;
  testSequence?: ChallengeType[];
  testLevel?: number;
  onNextLesson?: () => void; // Callback to go to next lesson
  hasNextLesson?: boolean; // Whether there is a next lesson
}

export function ChallengePlayer({ onBack, preSelectedChallenge, isTest, testSequence, testLevel, onNextLesson, hasNextLesson }: ChallengePlayerProps) {
  const { progress, todaySession, completeChallenge, completeSession } = useGame();
  const [currentChallenge, setCurrentChallenge] = useState<ChallengeType | null>(preSelectedChallenge || null);
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [showTestMode, setShowTestMode] = useState(isTest || false);

  useEffect(() => {
    if (todaySession) {
      setChallengesCompleted(todaySession.challenges.length);
    }
  }, [todaySession]);

  if (!progress) return null;

  // Handle test mode
  if (showTestMode && testSequence && testLevel) {
    return (
      <TestMode
        testSequence={testSequence}
        level={testLevel}
        onComplete={(score, duration) => {
          completeChallenge(testSequence[0], score, duration);
          setShowTestMode(false);
          onBack();
        }}
        onCancel={() => {
          setShowTestMode(false);
          onBack();
        }}
      />
    );
  }

  const availableChallenges = getAvailableChallenges(progress.level);

  const handleChallengeComplete = (score: number, duration: number) => {
    if (!currentChallenge) return;

    completeChallenge(currentChallenge, score, duration);
    setChallengesCompleted((prev) => prev + 1);

    // In linear progression mode, go back to level page after completing a challenge
    // The challenge itself handles showing the ExerciseOverview screen before this is called
    onBack();

    // Check if session is complete
    if (challengesCompleted + 1 >= 3) {
      completeSession();
    }
  };

  // If no challenge is selected, go back (shouldn't happen in linear progression)
  if (currentChallenge === null) {
    onBack();
    return null;
  }

  // Render current challenge
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        {/* New MVP Challenges */}
        {currentChallenge === 'focus_hold' && (
          <FocusHoldChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'finger_hold' && (
          <FingerHoldChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'slow_tracking' && (
          <SlowTrackingChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'tap_only_correct' && (
          <TapOnlyCorrectChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'breath_pacing' && (
          <BreathPacingChallenge duration={60} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'fake_notifications' && (
          <FakeNotificationsChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'look_away' && (
          <LookAwayChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'delay_unlock' && (
          <DelayUnlockChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'anti_scroll_swipe' && (
          <AntiScrollSwipeChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'memory_flash' && (
          <MemoryFlashChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'reaction_inhibition' && (
          <ReactionInhibitionChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'multi_object_tracking' && (
          <MultiObjectTrackingChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'rhythm_tap' && (
          <RhythmTapChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'stillness_test' && (
          <StillnessTestChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'impulse_spike_test' && (
          <ImpulseSpikeTestChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'finger_tracing' && (
          <FingerTracingChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'multi_task_tap' && (
          <MultiTaskTapChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'popup_ignore' && (
          <PopupIgnoreChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'controlled_breathing' && (
          <ControlledBreathingChallenge duration={60} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'reset' && (
          <ResetChallenge duration={10} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}

        {/* Legacy Challenges */}
        {currentChallenge === 'gaze_hold' && (
          <GazeHoldChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'moving_target' && (
          <MovingTargetChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'tap_pattern' && (
          <TapPatternChallenge duration={45} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'distraction_resistance' && (
          <DistractionResistanceChallenge duration={40} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'impulse_delay' && (
          <ImpulseDelayChallenge duration={45} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'stability_hold' && (
          <StabilityHoldChallenge duration={30} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
        {currentChallenge === 'audio_focus' && (
          <AudioFocusChallenge duration={40} onComplete={handleChallengeComplete} onNextLesson={onNextLesson} hasNextLesson={hasNextLesson} />
        )}
      </div>
    </div>
  );
}
