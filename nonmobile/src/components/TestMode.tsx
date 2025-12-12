import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { ArrowLeft, Trophy, AlertCircle, Zap, Star } from 'lucide-react';

interface TestModeProps {
  testSequence: ChallengeType[];
  level: number;
  onComplete: (averageScore: number, totalDuration: number) => void;
  onCancel: () => void;
}

interface ChallengeScore {
  type: ChallengeType;
  score: number;
  duration: number;
}

const CHALLENGE_NAMES: Record<ChallengeType, string> = {
  // New MVP exercises
  focus_hold: 'Focus Hold',
  finger_hold: 'Finger Hold',
  slow_tracking: 'Slow Tracking',
  tap_only_correct: 'Tap Only Correct',
  breath_pacing: 'Breath Pacing',
  fake_notifications: 'Fake Notifications',
  look_away: 'Look Away',
  delay_unlock: 'Delay Unlock',
  anti_scroll_swipe: 'Anti-Scroll Swipe',
  memory_flash: 'Memory Flash',
  reaction_inhibition: 'Reaction Inhibition',
  multi_object_tracking: 'Multi-Object Tracking',
  rhythm_tap: 'Rhythm Tap',
  stillness_test: 'Stillness Test',
  impulse_spike_test: 'Impulse Spike Test',
  finger_tracing: 'Finger Tracing',
  multi_task_tap: 'Multi-Task Tap',
  popup_ignore: 'Pop-Up Ignore',
  controlled_breathing: 'Controlled Breathing',
  reset: 'Level Reset',
  // Legacy exercises
  gaze_hold: 'Gaze Hold',
  moving_target: 'Moving Target',
  tap_pattern: 'Pattern Memory',
  stability_hold: 'Stability Hold',
  impulse_delay: 'Impulse Delay',
  distraction_resistance: 'Distraction Resistance',
  audio_focus: 'Audio Focus',
};

const CHALLENGE_EMOJIS: Record<ChallengeType, string> = {
  // New MVP exercises
  focus_hold: '👁️',
  finger_hold: '👆',
  slow_tracking: '🎯',
  tap_only_correct: '✅',
  breath_pacing: '🌬️',
  fake_notifications: '🔔',
  look_away: '🙈',
  delay_unlock: '🔓',
  anti_scroll_swipe: '📱',
  memory_flash: '💡',
  reaction_inhibition: '🚫',
  multi_object_tracking: '👀',
  rhythm_tap: '🎵',
  stillness_test: '🧘',
  impulse_spike_test: '⚡',
  finger_tracing: '✏️',
  multi_task_tap: '🤹',
  popup_ignore: '🚨',
  controlled_breathing: '🫁',
  reset: '🔄',
  // Legacy exercises
  gaze_hold: '👁️',
  moving_target: '🎯',
  tap_pattern: '🧠',
  stability_hold: '🎚️',
  impulse_delay: '⏱️',
  distraction_resistance: '🛡️',
  audio_focus: '🔊',
};

export function TestMode({ testSequence, level, onComplete, onCancel }: TestModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<ChallengeScore[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [totalTime, setTotalTime] = useState(0);

  const currentChallenge = testSequence[currentIndex];
  const isLastChallenge = currentIndex === testSequence.length - 1;
  const progressPercent = ((currentIndex) / testSequence.length) * 100;

  useEffect(() => {
    // Start timer when intro is dismissed
    if (!showIntro) {
      const interval = setInterval(() => {
        setTotalTime((prev) => prev + 100);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [showIntro]);

  const handleChallengeComplete = (score: number, duration: number) => {
    const newScore: ChallengeScore = {
      type: currentChallenge,
      score,
      duration,
    };

    const updatedScores = [...scores, newScore];
    setScores(updatedScores);

    if (isLastChallenge) {
      // Calculate average score
      const averageScore = updatedScores.reduce((sum, s) => sum + s.score, 0) / updatedScores.length;
      const totalDuration = updatedScores.reduce((sum, s) => sum + s.duration, 0);

      // Complete test
      onComplete(Math.round(averageScore), totalDuration);
    } else {
      // Move to next challenge
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900/20 p-4">
        <Card className="max-w-2xl w-full border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              Level {level} Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="font-bold text-red-900 dark:text-red-100 mb-2 text-lg">
                    ⚠️ CHALLENGING TEST AHEAD!
                  </p>
                  <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                    You'll complete <strong>{testSequence.length} different challenges</strong> back-to-back with <strong>shorter durations</strong> and <strong>no breaks</strong>!
                  </p>
                  <p className="text-sm text-red-900 dark:text-red-100 font-semibold">
                    Average score 80+ required to pass. This is hard - you can fail!
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-3">
                Test Sequence ({testSequence.length} challenges):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {testSequence.map((challenge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
                  >
                    <span className="text-2xl">{CHALLENGE_EMOJIS[challenge]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-600 dark:text-gray-400">#{idx + 1}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {CHALLENGE_NAMES[challenge]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700 rounded-lg p-4">
              <p className="text-sm text-purple-900 dark:text-purple-100 mb-2">
                <strong>🎯 Test Rules:</strong>
              </p>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 ml-4 list-disc">
                <li><strong>Shorter time limits</strong> - challenges are 25-40% faster than practice</li>
                <li><strong>No breaks</strong> - continuous challenge sequence</li>
                <li>Each challenge scored independently (0-100)</li>
                <li><strong>Pass requirement:</strong> 80+ average across all challenges</li>
                <li>You CAN fail - retake the test to try again</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={() => setShowIntro(false)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                Start Test
                <Zap className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-gray-900 dark:to-purple-900/20 p-4">
      <div className="max-w-2xl mx-auto space-y-4 py-4">
        {/* Progress Header */}
        <Card className="border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Level {level} Test</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    Challenge {currentIndex + 1} of {testSequence.length}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-purple-100 dark:bg-purple-900 border-purple-500 text-purple-900 dark:text-purple-100"
                >
                  {Math.round(progressPercent)}% Complete
                </Badge>
              </div>

              <Progress value={progressPercent} className="h-2" />

              <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex -space-x-1">
                  {testSequence.map((challenge, idx) => {
                    const isCompleted = idx < currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div
                        key={idx}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs ${
                          isCompleted
                            ? 'bg-green-500 border-green-600 text-white'
                            : isCurrent
                              ? 'bg-purple-500 border-purple-600 text-white animate-pulse'
                              : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                        }`}
                        title={CHALLENGE_NAMES[challenge]}
                      >
                        {isCompleted ? (
                          <Star className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {scores.length > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <p className="text-gray-600 dark:text-gray-400">
                    Average Score: <strong>{Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)}/100</strong>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Time: {Math.floor(totalTime / 1000)}s
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Challenge */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{CHALLENGE_EMOJIS[currentChallenge]}</span>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Now Playing:</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {CHALLENGE_NAMES[currentChallenge]}
              </p>
            </div>
          </div>

          {/* New MVP Challenges */}
          {currentChallenge === 'focus_hold' && (
            <FocusHoldChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'finger_hold' && (
            <FingerHoldChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'slow_tracking' && (
            <SlowTrackingChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'tap_only_correct' && (
            <TapOnlyCorrectChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'fake_notifications' && (
            <FakeNotificationsChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'look_away' && (
            <LookAwayChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'delay_unlock' && (
            <DelayUnlockChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'anti_scroll_swipe' && (
            <AntiScrollSwipeChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'memory_flash' && (
            <MemoryFlashChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'reaction_inhibition' && (
            <ReactionInhibitionChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'multi_object_tracking' && (
            <MultiObjectTrackingChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'rhythm_tap' && (
            <RhythmTapChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'stillness_test' && (
            <StillnessTestChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'impulse_spike_test' && (
            <ImpulseSpikeTestChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'finger_tracing' && (
            <FingerTracingChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'multi_task_tap' && (
            <MultiTaskTapChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'popup_ignore' && (
            <PopupIgnoreChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'controlled_breathing' && (
            <ControlledBreathingChallenge duration={40} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'reset' && (
            <ResetChallenge duration={10} onComplete={handleChallengeComplete} />
          )}

          {/* Legacy Challenges */}
          {currentChallenge === 'gaze_hold' && (
            <GazeHoldChallenge duration={20} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'moving_target' && (
            <MovingTargetChallenge duration={25} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'breath_pacing' && (
            <BreathPacingChallenge duration={40} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'tap_pattern' && (
            <TapPatternChallenge duration={35} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'distraction_resistance' && (
            <DistractionResistanceChallenge duration={30} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'impulse_delay' && (
            <ImpulseDelayChallenge duration={35} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'stability_hold' && (
            <StabilityHoldChallenge duration={25} onComplete={handleChallengeComplete} />
          )}
          {currentChallenge === 'audio_focus' && (
            <AudioFocusChallenge duration={30} onComplete={handleChallengeComplete} />
          )}
        </div>

        {/* Scores Summary */}
        {scores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Completed Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scores.map((score, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{CHALLENGE_EMOJIS[score.type]}</span>
                      <p className="text-sm font-medium">{CHALLENGE_NAMES[score.type]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={score.score >= 80 ? 'default' : 'secondary'}
                        className={
                          score.score >= 95
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : score.score >= 80
                              ? 'bg-green-500 hover:bg-green-600'
                              : ''
                        }
                      >
                        {score.score}/100
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
