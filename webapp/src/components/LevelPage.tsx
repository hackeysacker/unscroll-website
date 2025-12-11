import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { HeartRefillDialog } from '@/components/HeartRefillDialog';
import {
  Lock,
  Star,
  CheckCircle2,
  Circle,
  Trophy,
  ArrowLeft,
  Zap,
  Sparkles,
  PartyPopper,
  Heart,
  Gem,
  Flame,
} from 'lucide-react';
import type { ProgressTreeNode, ChallengeType, HeartRefillActionType } from '@/types';

interface LevelPageProps {
  level: number;
  onBack: () => void;
  onSelectChallenge: (challengeType: ChallengeType, isTest?: boolean, testSequence?: ChallengeType[]) => void;
}

const CHALLENGE_DESCRIPTIONS: Record<ChallengeType, { name: string; emoji: string; description: string; skill: string }> = {
  // New MVP exercises
  focus_hold: { name: 'Focus Hold', emoji: '👁️', description: 'Hold your gaze on the center dot', skill: 'Focus' },
  finger_hold: { name: 'Finger Hold', emoji: '👆', description: 'Keep your finger still on the spot', skill: 'Focus' },
  slow_tracking: { name: 'Slow Tracking', emoji: '🎯', description: 'Track the moving shape smoothly', skill: 'Focus' },
  tap_only_correct: { name: 'Tap Only Correct', emoji: '✅', description: 'Tap only the correct shapes', skill: 'Impulse Control' },
  breath_pacing: { name: 'Breath Pacing', emoji: '🌬️', description: 'Follow the breathing rhythm', skill: 'Focus' },
  fake_notifications: { name: 'Fake Notifications', emoji: '🔔', description: 'Ignore the fake pop-ups', skill: 'Distraction Resistance' },
  look_away: { name: 'Look Away', emoji: '🙈', description: 'Do not touch, just breathe', skill: 'Impulse Control' },
  delay_unlock: { name: 'Delay Unlock', emoji: '🔓', description: 'Hold the unlock button', skill: 'Impulse Control' },
  anti_scroll_swipe: { name: 'Anti-Scroll', emoji: '📱', description: 'Swipe up to break the scroll loop', skill: 'Impulse Control' },
  memory_flash: { name: 'Memory Flash', emoji: '💡', description: 'Remember the sequence shown', skill: 'Focus' },
  reaction_inhibition: { name: 'Reaction Inhibition', emoji: '🚫', description: 'Tap only the specific target', skill: 'Impulse Control' },
  multi_object_tracking: { name: 'Multi-Object Track', emoji: '👀', description: 'Track multiple moving targets', skill: 'Focus' },
  rhythm_tap: { name: 'Rhythm Tap', emoji: '🎵', description: 'Tap in rhythm with the pulse', skill: 'Focus' },
  stillness_test: { name: 'Stillness Test', emoji: '🧘', description: 'Hold perfectly still', skill: 'Impulse Control' },
  impulse_spike_test: { name: 'Impulse Spike', emoji: '⚡', description: 'Resist bright hooks and bait', skill: 'Distraction Resistance' },
  finger_tracing: { name: 'Finger Tracing', emoji: '✏️', description: 'Trace the path accurately', skill: 'Focus' },
  multi_task_tap: { name: 'Multi-Task Tap', emoji: '🤹', description: 'Hold and tap simultaneously', skill: 'Impulse Control' },
  popup_ignore: { name: 'Pop-Up Ignore', emoji: '🚨', description: 'Stay focused, ignore flashes', skill: 'Distraction Resistance' },
  controlled_breathing: { name: 'Controlled Breathing', emoji: '🫁', description: 'Follow complex breath patterns', skill: 'Focus' },
  reset: { name: 'Level Reset', emoji: '🔄', description: 'Cooldown and mini test', skill: 'Focus' },
  // Legacy exercises
  gaze_hold: { name: 'Gaze Hold', emoji: '👁️', description: 'Hold your focus on the target', skill: 'Focus' },
  moving_target: { name: 'Moving Target', emoji: '🎯', description: 'Track and click moving targets', skill: 'Focus' },
  tap_pattern: { name: 'Pattern Memory', emoji: '🧠', description: 'Remember and repeat patterns', skill: 'Impulse Control' },
  stability_hold: { name: 'Stability Hold', emoji: '🎚️', description: 'Keep your cursor steady', skill: 'Focus' },
  impulse_delay: { name: 'Impulse Delay', emoji: '⏱️', description: 'Wait for the perfect moment', skill: 'Impulse Control' },
  distraction_resistance: { name: 'Distraction Resist', emoji: '🛡️', description: 'Ignore the distractions', skill: 'Distraction Resistance' },
  audio_focus: { name: 'Audio Focus', emoji: '🔊', description: 'Count the target sounds', skill: 'Distraction Resistance' },
};

export function LevelPage({ level, onBack, onSelectChallenge }: LevelPageProps) {
  const { progress, progressTree, heartState, canStartChallenge, completeRefillAction } = useGame();
  const { user } = useAuth();
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCompletedNode, setLastCompletedNode] = useState<ProgressTreeNode | null>(null);
  const [showHeartDialog, setShowHeartDialog] = useState(false);

  // Detect when a node is completed
  useEffect(() => {
    if (progressTree?.lastCompletedNodeId) {
      const completed = progressTree.nodes.find(n => n.id === progressTree.lastCompletedNodeId);
      if (completed && completed.id !== lastCompletedNode?.id) {
        setLastCompletedNode(completed);
        setShowCelebration(true);
        const isMilestone = [5, 10, 15, 20].includes(completed.position + 1);
        setTimeout(() => setShowCelebration(false), isMilestone ? 5000 : 3000);
      }
    }
  }, [progressTree?.lastCompletedNodeId, lastCompletedNode?.id, progressTree?.nodes]);

  if (!progress || !progressTree) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  const currentNode = progressTree.nodes.find((n: ProgressTreeNode) => n.id === progressTree.currentNodeId);

  // Get nodes for this specific level
  const levelNodes = progressTree.nodes.filter((node: ProgressTreeNode) => node.level === level);

  if (levelNodes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Level {level} not available yet</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Separate exercises and test
  const exercises = levelNodes.filter(n => n.nodeType === 'exercise').sort((a, b) => a.position - b.position);
  const test = levelNodes.find(n => n.nodeType === 'test');

  // Calculate completion stats
  const completedExercises = exercises.filter(n => n.status === 'completed' || n.status === 'perfect').length;
  const totalExercises = exercises.length;
  const perfectExercises = exercises.filter(n => n.status === 'perfect').length;
  const progressPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const isCurrentLevel = levelNodes.some(n => n.id === progressTree.currentNodeId);

  // Motivational messages and phase info based on progress
  let motivationalMsg = '';
  let phaseInfo = '';
  if (isCurrentLevel) {
    if (completedExercises === 0) {
      motivationalMsg = `Welcome to Level ${level}!`;
      phaseInfo = 'Phase 1: Foundation (Exercises 1-5)';
    } else if (completedExercises < 5) {
      motivationalMsg = 'Building your foundation!';
      phaseInfo = 'Phase 1: Foundation';
    } else if (completedExercises === 5) {
      motivationalMsg = 'Phase 1 complete! 🎉';
      phaseInfo = 'Starting Phase 2: Steadiness (6-10)';
    } else if (completedExercises < 10) {
      motivationalMsg = 'Developing motor control!';
      phaseInfo = 'Phase 2: Steadiness';
    } else if (completedExercises === 10) {
      motivationalMsg = 'Halfway there! 🌟';
      phaseInfo = 'Starting Phase 3: Tracking (11-15)';
    } else if (completedExercises < 15) {
      motivationalMsg = 'Sharpening your tracking!';
      phaseInfo = 'Phase 3: Tracking';
    } else if (completedExercises === 15) {
      motivationalMsg = 'Outstanding progress! ⭐';
      phaseInfo = 'Starting Phase 4: Control (16-20)';
    } else if (completedExercises < 20) {
      motivationalMsg = 'Almost at the test!';
      phaseInfo = 'Phase 4: Control';
    } else {
      motivationalMsg = 'All exercises complete! 🏆';
      phaseInfo = `Ready for Level ${level} Test!`;
    }
  }

  const renderNode = (node: ProgressTreeNode, isCurrentNode: boolean) => {
    const challenge = CHALLENGE_DESCRIPTIONS[node.challengeType];
    const isLocked = node.status === 'locked';
    const isCompleted = node.status === 'completed' || node.status === 'perfect';
    const isAvailable = node.status === 'available';
    const isTest = node.nodeType === 'test';

    let bgColor = 'bg-gray-300 dark:bg-gray-700';
    let borderColor = 'border-gray-400 dark:border-gray-600';
    let nodeSize = 'w-12 h-12';
    let emojiSize = 'text-xl';

    if (isTest) {
      nodeSize = 'w-20 h-20';
      emojiSize = 'text-3xl';
    }

    if (isLocked) {
      bgColor = 'bg-gray-200 dark:bg-gray-800';
      borderColor = 'border-gray-300 dark:border-gray-700';
    } else if (node.status === 'perfect') {
      bgColor = isTest
        ? 'bg-gradient-to-br from-purple-400 to-pink-500'
        : 'bg-gradient-to-br from-yellow-400 to-orange-500';
      borderColor = isTest ? 'border-purple-500' : 'border-yellow-500';
    } else if (isCompleted) {
      bgColor = 'bg-gradient-to-br from-green-400 to-emerald-500';
      borderColor = 'border-green-500';
    } else if (isAvailable) {
      bgColor = isCurrentNode
        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse'
        : 'bg-gradient-to-br from-blue-400 to-indigo-500';
      borderColor = 'border-blue-500';
    }

    const handleNodeClick = () => {
      if (!isAvailable || isLocked || isCompleted) return;

      // Check if user has hearts
      const { canStart, reason } = canStartChallenge(isTest);

      if (!canStart) {
        setShowHeartDialog(true);
        return;
      }

      onSelectChallenge(node.challengeType, isTest, node.testSequence);
    };

    return (
      <button
        key={node.id}
        onClick={handleNodeClick}
        disabled={isLocked || isCompleted}
        className={`relative group transition-all ${
          isAvailable && !isLocked ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
        }`}
      >
        <div
          className={`${nodeSize} rounded-full ${bgColor} border-4 ${borderColor} flex items-center justify-center shadow-lg transition-all ${
            isCurrentNode ? 'ring-4 ring-blue-300 dark:ring-blue-700' : ''
          }`}
        >
          <div className="text-center">
            {isLocked ? (
              <Lock className={`${isTest ? 'w-8 h-8' : 'w-4 h-4'} text-gray-500 dark:text-gray-400`} />
            ) : (
              <span className={emojiSize}>{challenge.emoji}</span>
            )}
          </div>
        </div>

        {isTest && (
          <div className="absolute -top-2 -left-2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
            TEST
          </div>
        )}

        {isCompleted && (
          <div className="absolute -top-2 -right-2 flex gap-0.5">
            {Array.from({ length: node.starsEarned }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        )}

        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <p className="font-semibold">{isTest ? `${challenge.name} TEST` : `Exercise ${node.position + 1}: ${challenge.name}`}</p>
            <p className="text-gray-300 dark:text-gray-600">{challenge.description}</p>
            <p className="text-blue-400 dark:text-blue-600 text-[10px] mt-0.5">Trains: {challenge.skill}</p>
            {!isLocked && (
              <p className="text-yellow-400 dark:text-yellow-600 mt-1">+{node.xpReward} XP</p>
            )}
            {isTest && node.testSequence && (
              <>
                <p className="text-purple-400 dark:text-purple-600 mt-1">{node.testSequence.length} challenges • 80+ to pass</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Shorter durations, harder difficulty!</p>
              </>
            )}
          </div>
        </div>

        {isTest && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-center w-24">
            <p className="text-xs font-bold text-purple-700 dark:text-purple-300">
              Level {node.level} Test
            </p>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        {/* Celebration Banner */}
        {showCelebration && lastCompletedNode && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-500">
            {(() => {
              const isMilestone = [5, 10, 15, 20].includes(lastCompletedNode.position + 1);
              const milestoneMessages: Record<number, string> = {
                5: '🎉 Phase 1 Complete! Foundation Built!',
                10: '🌟 Halfway There! You\'re Crushing It!',
                15: '⭐ Phase 3 Complete! Tracking Mastered!',
                20: '🏆 All Exercises Complete! Ready for the Test!',
              };
              const milestoneMsg = isMilestone ? milestoneMessages[lastCompletedNode.position + 1] : null;

              return (
                <Card className={`border-green-500 ${isMilestone ? 'bg-gradient-to-r from-yellow-50 via-green-50 to-blue-50 dark:from-yellow-900/30 dark:via-green-900/30 dark:to-blue-900/30' : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30'} shadow-2xl`}>
                  <CardContent className="pt-4 pb-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`${isMilestone ? 'w-14 h-14' : 'w-12 h-12'} rounded-full bg-gradient-to-br ${isMilestone ? 'from-yellow-400 via-green-400 to-blue-500' : 'from-green-400 to-emerald-500'} flex items-center justify-center ${isMilestone ? 'animate-bounce' : ''}`}>
                        {lastCompletedNode.status === 'perfect' ? (
                          <Trophy className={`${isMilestone ? 'w-8 h-8' : 'w-6 h-6'} text-white`} />
                        ) : (
                          <CheckCircle2 className={`${isMilestone ? 'w-8 h-8' : 'w-6 h-6'} text-white`} />
                        )}
                      </div>
                      <div>
                        <p className={`font-bold text-green-900 dark:text-green-100 flex items-center gap-2 ${isMilestone ? 'text-lg' : ''}`}>
                          {milestoneMsg || (lastCompletedNode.status === 'perfect' ? 'Perfect Score!' : 'Exercise Complete!')}
                          <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {lastCompletedNode.nodeType === 'exercise'
                            ? `Exercise ${lastCompletedNode.position + 1}/20 completed`
                            : `Level ${lastCompletedNode.level} Test completed`}
                          {' • +'}
                          {lastCompletedNode.xpReward} XP
                        </p>
                      </div>
                      <PartyPopper className={`${isMilestone ? 'w-8 h-8' : 'w-6 h-6'} text-purple-500 animate-bounce ml-2`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Level {level}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Complete all exercises to unlock the test
            </p>
          </div>

          <div className="w-24" />
        </div>

        {/* Level Stats Card */}
        <Card className={`${
          isCurrentLevel
            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
            : 'border-gray-300'
        }`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Badge
                variant="outline"
                className={`text-lg px-4 py-2 ${
                  isCurrentLevel
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-900 dark:text-blue-100'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                {completedExercises}/{totalExercises} Exercises Complete
              </Badge>
              {isCurrentLevel && motivationalMsg && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                    {motivationalMsg}
                  </p>
                  {phaseInfo && (
                    <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold">
                      {phaseInfo}
                    </p>
                  )}
                </div>
              )}
              {isCurrentLevel && perfectExercises > 0 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">
                    {perfectExercises} perfect {perfectExercises === 1 ? 'score' : 'scores'}!
                  </p>
                </div>
              )}
              {isCurrentLevel && (
                <div className="w-64 mx-auto mt-2">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {progressPercent}% complete
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current challenge card (if on this level) */}
        {currentNode && currentNode.level === level && (
          <Card className={`${
            currentNode.nodeType === 'test'
              ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'
              : 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${
                    currentNode.nodeType === 'test'
                      ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  } flex items-center justify-center text-3xl relative`}>
                    {CHALLENGE_DESCRIPTIONS[currentNode.challengeType].emoji}
                    {currentNode.nodeType === 'test' && (
                      <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                        TEST
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentNode.nodeType === 'test' ? `Level ${currentNode.level} Test` : `Exercise ${currentNode.position + 1}/20`}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {CHALLENGE_DESCRIPTIONS[currentNode.challengeType].name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {CHALLENGE_DESCRIPTIONS[currentNode.challengeType].description}
                    </p>
                    {currentNode.nodeType === 'test' && (
                      <>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 font-semibold">
                          {currentNode.testSequence?.length || 3} challenges • Score 80+ to unlock Level {currentNode.level + 1}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Comprehensive test of all Level {currentNode.level} skills
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => onSelectChallenge(
                    currentNode.challengeType,
                    currentNode.nodeType === 'test',
                    currentNode.testSequence
                  )}
                  className={`${
                    currentNode.nodeType === 'test'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                  }`}
                >
                  {currentNode.nodeType === 'test' ? 'Take Test' : 'Start Exercise'}
                  <Zap className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress tree - Duolingo-style vertical path for Levels 1 and 2 */}
        <Card>
          <CardContent className="pt-8 pb-12">
            <div className="flex flex-col items-center space-y-3">
              {exercises.map((node, index) => {
                const isCurrentNode = node.id === progressTree.currentNodeId;
                const showPhaseSeparator = index === 5 || index === 10 || index === 15;
                const phaseLabels: Record<number, string> = {
                  5: 'Phase 2: Steadiness',
                  10: 'Phase 3: Tracking',
                  15: 'Phase 4: Control',
                };
                const phaseColors: Record<number, string> = {
                  5: 'from-blue-400 to-green-400',
                  10: 'from-green-400 to-purple-400',
                  15: 'from-purple-400 to-orange-400',
                };

                return (
                  <div key={node.id} className="flex flex-col items-center">
                    {showPhaseSeparator && (
                      <div className="w-full max-w-md mb-6 mt-2">
                        <div className={`h-1 rounded-full bg-gradient-to-r ${phaseColors[index]} animate-pulse`} />
                        <p className="text-center text-sm font-bold text-gray-700 dark:text-gray-300 mt-2">
                          {phaseLabels[index]}
                        </p>
                      </div>
                    )}

                    <div className="relative z-10">
                      {renderNode(node, isCurrentNode)}
                    </div>

                    {index < exercises.length - 1 && (
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-300 via-indigo-400 to-blue-300 dark:from-blue-600 dark:via-indigo-700 dark:to-blue-600 rounded-full" />
                    )}
                  </div>
                );
              })}

              <div className="w-1 h-12 bg-gradient-to-b from-blue-400 via-purple-500 to-purple-600 rounded-full animate-pulse" />

              {test && (
                <div className="relative z-10 mt-4">
                  {renderNode(test, test.id === progressTree.currentNodeId)}
                </div>
              )}
            </div>

            {/* Info footer */}
            <div className="mt-12 text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete all exercises to unlock the Level {level} Test
              </p>
              <div className="flex justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />
                  <span>Perfect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span>Locked</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heart Refill Dialog */}
      {heartState && user && (
        <HeartRefillDialog
          open={showHeartDialog}
          onClose={() => setShowHeartDialog(false)}
          onSelectAction={(action: HeartRefillActionType) => {
            completeRefillAction(action);
          }}
          onUpgradeToPremium={() => {
            setShowHeartDialog(false);
            onBack(); // Go back to navigate to premium
          }}
          currentHearts={heartState.currentHearts}
        />
      )}
    </div>
  );
}
