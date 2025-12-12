import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface LookAwayChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function LookAwayChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: LookAwayChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const touchedRef = useRef(false);

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

  const handleTouch = () => {
    touchedRef.current = true;
  };

  const handleComplete = () => {
    // Perfect score if never touched, 0 if touched
    const score = touchedRef.current ? 0 : 100;

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy: score,
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
        challengeType="look_away"
        stats={exerciseStats}
        onContinue={handleOverviewContinue}
        showHeartLoss={true}
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
            <h3 className="text-2xl font-bold">Look Away</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Do not touch the screen - just breathe and look away for {duration} seconds
            </p>
          </div>
          <Button onClick={() => setIsActive(true)} className="w-full">
            Start Exercise
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Time Remaining</span>
              <span className="text-2xl font-bold">{timeLeft}s</span>
            </div>
            <Progress value={(timeLeft / duration) * 100} />
          </div>
        </CardContent>
      </Card>

      <div
        className="relative h-96 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg flex items-center justify-center"
        onMouseDown={handleTouch}
        onTouchStart={handleTouch}
      >
        <div className="text-center space-y-6">
          <div className="text-7xl">👁️</div>
          <div className="space-y-2">
            <p className="text-3xl font-bold">Look Away</p>
            <p className="text-lg text-gray-600 dark:text-gray-300">Don't touch the screen</p>
          </div>
          <div className="text-6xl opacity-50">🧘‍♀️</div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        {touchedRef.current ? (
          <span className="text-red-600 font-semibold">You touched! Try not to touch the screen.</span>
        ) : (
          'Just breathe and look away - no touching!'
        )}
      </p>
    </div>
  );
}
