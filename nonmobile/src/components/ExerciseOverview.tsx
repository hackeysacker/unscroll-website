import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Heart, TrendingUp, TrendingDown, Clock, Target } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { useEffect } from 'react';
import type { ChallengeType } from '@/types';

// Pass/fail thresholds
export const PASS_THRESHOLD = 80; // 80% or higher = pass
export const GOOD_THRESHOLD = 90; // 90% or higher = good performance
export const PERFECT_THRESHOLD = 95; // 95% or higher = perfect

export interface ExerciseStats {
  score: number; // 0-100
  duration: number; // milliseconds
  accuracy?: number; // 0-100 (optional, for specific challenges)
  focusBreaks?: number; // Number of times focus was lost
  correctActions?: number; // Number of correct actions
  totalActions?: number; // Total actions taken
  additionalData?: Record<string, number | string>; // Challenge-specific data
}

interface ExerciseOverviewProps {
  challengeType: ChallengeType;
  stats: ExerciseStats;
  onContinue: () => void;
  showHeartLoss?: boolean; // Whether to show heart loss indicator
  onNextLesson?: () => void; // Callback for going to next lesson in linear path
  hasNextLesson?: boolean; // Whether there is a next lesson available
  onTryAgain?: () => void; // Callback to retry the same exercise
}

export function ExerciseOverview({
  challengeType,
  stats,
  onContinue,
  showHeartLoss = false,
  onNextLesson,
  hasNextLesson = false,
  onTryAgain
}: ExerciseOverviewProps) {
  const { loseHeartForReason } = useGame();
  const isPassed = stats.score >= PASS_THRESHOLD;
  const isPerfect = stats.score >= PERFECT_THRESHOLD;
  const isGood = stats.score >= GOOD_THRESHOLD;

  // Format challenge name
  const challengeName = challengeType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Format duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${seconds}s`;
  };

  // Get performance level
  const getPerformanceLevel = () => {
    if (isPerfect) return { label: 'Perfect!', color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' };
    if (isGood) return { label: 'Excellent', color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' };
    if (isPassed) return { label: 'Good', color: 'text-indigo-600', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' };
    return { label: 'Failed - Try Again', color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' };
  };

  const performanceLevel = getPerformanceLevel();

  // Lose heart immediately when overview loads if failed
  useEffect(() => {
    if (!isPassed && showHeartLoss) {
      // Lose a heart for failing (only once when component mounts)
      loseHeartForReason('test_fail');
    }
  }, []); // Empty dependency array means this runs once on mount

  // Handle continue - no longer needs to lose heart here
  const handleContinue = () => {
    onContinue();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isPassed ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              {challengeName}
            </CardTitle>
            <Badge
              variant={isPassed ? "default" : "destructive"}
              className="text-lg px-4 py-1"
            >
              {isPassed ? 'PASS' : 'FAIL'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className={`text-center p-6 rounded-lg ${performanceLevel.bgColor}`}>
            <div className={`text-6xl font-bold ${performanceLevel.color} mb-2`}>
              {Math.round(stats.score)}%
            </div>
            <div className={`text-lg font-semibold ${performanceLevel.color}`}>
              {performanceLevel.label}
            </div>
          </div>

          {/* Heart Loss Warning */}
          {!isPassed && showHeartLoss && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-900 dark:text-red-100">
                <Heart className="w-5 h-5 fill-red-600 stroke-red-600" />
                <span className="font-semibold">You lost a heart</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                Score at least {PASS_THRESHOLD}% to avoid losing hearts
              </p>
            </div>
          )}

          {/* Performance Stats */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Performance Summary</h4>

            <div className="grid grid-cols-2 gap-3">
              {/* Duration */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Duration</span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(stats.duration)}
                </div>
              </div>

              {/* Score */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
                  <Target className="w-4 h-4" />
                  <span>Score</span>
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.round(stats.score)}%
                </div>
              </div>

              {/* Accuracy (if provided) */}
              {stats.accuracy !== undefined && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
                    {stats.accuracy >= 75 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>Accuracy</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {Math.round(stats.accuracy)}%
                  </div>
                </div>
              )}

              {/* Correct/Total Actions */}
              {stats.correctActions !== undefined && stats.totalActions !== undefined && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Correct</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.correctActions} / {stats.totalActions}
                  </div>
                </div>
              )}

              {/* Focus Breaks */}
              {stats.focusBreaks !== undefined && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg col-span-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-1">
                    <XCircle className="w-4 h-4" />
                    <span>Focus Breaks</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.focusBreaks}
                    {stats.focusBreaks === 0 && (
                      <span className="text-sm text-green-600 dark:text-green-400 ml-2">
                        Perfect focus! 🎯
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Exercise-Specific Data */}
            {stats.additionalData && Object.keys(stats.additionalData).length > 0 && (
              <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h5 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2 text-sm">
                  Exercise Details
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(stats.additionalData).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:
                      </span>
                      <span className="text-indigo-900 dark:text-indigo-100 ml-2 font-semibold">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips for Improvement */}
          {!isPassed && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Tips for Improvement
              </h4>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1 list-disc list-inside">
                {stats.focusBreaks && stats.focusBreaks > 3 && (
                  <li>Try to maintain continuous focus without breaking</li>
                )}
                {stats.accuracy && stats.accuracy < 70 && (
                  <li>Take your time to ensure accuracy over speed</li>
                )}
                {stats.score < 40 && (
                  <li>Consider practicing similar exercises to build skill</li>
                )}
                <li>Remember: consistent practice leads to improvement</li>
              </ul>
            </div>
          )}

          {/* Success Message */}
          {isPerfect && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Perfect Performance! ⭐
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                You completed this exercise with exceptional focus. Keep up the great work!
              </p>
            </div>
          )}

          {/* Action Buttons - Different flows for passed vs failed */}
          {isPassed ? (
            // PASSED - Show Next Exercise and Go Back to Current Level
            <div className="space-y-2">
              {hasNextLesson && onNextLesson ? (
                <>
                  <Button
                    onClick={onNextLesson}
                    className="w-full"
                    variant="default"
                  >
                    Next Exercise →
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="w-full"
                    variant="outline"
                  >
                    Back to Level
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleContinue}
                  className="w-full"
                  variant="default"
                >
                  Back to Level
                </Button>
              )}
            </div>
          ) : (
            // FAILED - Show Try Again and Go Back to Current Level
            <div className="space-y-2">
              {onTryAgain ? (
                <>
                  <Button
                    onClick={onTryAgain}
                    className="w-full"
                    variant="default"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="w-full"
                    variant="outline"
                  >
                    Back to Level
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleContinue}
                  className="w-full"
                  variant="destructive"
                >
                  Back to Level
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
