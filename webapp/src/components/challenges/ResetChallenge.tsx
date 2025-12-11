import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface ResetChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function ResetChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: ResetChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // Short cooldown
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const handleComplete = () => {
    // Auto-pass reset challenge
    const stats: ExerciseStats = {
      score: 100,
      duration: 10000,
      accuracy: 100,
    };

    setExerciseStats(stats);
    setShowOverview(true);
  };

  const handleOverviewContinue = () => {
    if (exerciseStats) {
      onComplete(exerciseStats.score, exerciseStats.duration);
    }
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="reset"
        stats={exerciseStats}
        onContinue={handleOverviewContinue}
        showHeartLoss={false}
        onNextLesson={onNextLesson}
        hasNextLesson={hasNextLesson}
      />
    );
  }

  if (!isActive) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Reset & Reflect</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Take a moment to reset and prepare for the upcoming test
            </p>
          </div>
          <Button onClick={() => setIsActive(true)} className="w-full">
            Start Reset
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative h-96 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-xl shadow-lg flex items-center justify-center">
        <div className="text-center space-y-8 p-8">
          <div className="text-8xl animate-pulse">🌟</div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Take a Breath</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              You're doing great!
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Resetting in {timeLeft}s...
            </p>
          </div>
          <div className="space-y-2 text-left max-w-md mx-auto">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✨ You've completed this level's exercises
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              🎯 The level test is coming up next
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              💪 You're ready for this!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
