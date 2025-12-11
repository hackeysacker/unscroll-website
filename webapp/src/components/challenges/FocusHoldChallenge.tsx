import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface FocusHoldChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function FocusHoldChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: FocusHoldChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isFocusing, setIsFocusing] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const focusTimeRef = useRef(0);
  const focusBreaksRef = useRef(0);

  // Reset function to retry the exercise
  const handleTryAgain = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setIsFocusing(false);
    setShowOverview(false);
    setExerciseStats(null);
    focusTimeRef.current = 0;
    focusBreaksRef.current = 0;
  };

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

  useEffect(() => {
    if (!isFocusing || !isActive) return;

    const interval = setInterval(() => {
      focusTimeRef.current += 100;
    }, 100);

    return () => clearInterval(interval);
  }, [isFocusing, isActive]);

  // Track focus breaks
  useEffect(() => {
    if (isActive && !isFocusing && focusTimeRef.current > 0) {
      focusBreaksRef.current += 1;
    }
  }, [isFocusing, isActive]);

  const handleComplete = () => {
    const totalMs = duration * 1000;
    const accuracy = (focusTimeRef.current / totalMs) * 100;
    const score = Math.min(100, accuracy);

    const stats: ExerciseStats = {
      score,
      duration: focusTimeRef.current,
      accuracy,
      focusBreaks: focusBreaksRef.current,
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
        challengeType="focus_hold"
        stats={exerciseStats}
        onContinue={handleOverviewContinue}
        showHeartLoss={true}
        onNextLesson={onNextLesson}
        hasNextLesson={hasNextLesson}
        onTryAgain={handleTryAgain}
      />
    );
  }

  if (!isActive) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Focus Hold</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hold your gaze on the center dot for {duration} seconds without looking away
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

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        <div
          className={`w-24 h-24 rounded-full cursor-pointer transition-all ${
            isFocusing ? 'bg-green-500 scale-110' : 'bg-indigo-600'
          }`}
          onMouseDown={() => setIsFocusing(true)}
          onMouseUp={() => setIsFocusing(false)}
          onMouseLeave={() => setIsFocusing(false)}
          onTouchStart={() => setIsFocusing(true)}
          onTouchEnd={() => setIsFocusing(false)}
        />
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Hold the dot to maintain focus
      </p>
    </div>
  );
}
