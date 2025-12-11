import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface FingerHoldChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function FingerHoldChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: FingerHoldChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isHolding, setIsHolding] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const holdTimeRef = useRef(0);
  const breaksRef = useRef(0);

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
    if (!isHolding || !isActive) return;

    const interval = setInterval(() => {
      holdTimeRef.current += 100;
    }, 100);

    return () => clearInterval(interval);
  }, [isHolding, isActive]);

  useEffect(() => {
    if (isActive && !isHolding && holdTimeRef.current > 0) {
      breaksRef.current += 1;
    }
  }, [isHolding, isActive]);

  const handleComplete = () => {
    const totalMs = duration * 1000;
    const accuracy = (holdTimeRef.current / totalMs) * 100;
    const score = Math.min(100, accuracy);

    const stats: ExerciseStats = {
      score,
      duration: holdTimeRef.current,
      accuracy,
      focusBreaks: breaksRef.current,
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
        challengeType="finger_hold"
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
            <h3 className="text-2xl font-bold">Finger Hold</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep your finger still on the spot for {duration} seconds
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
          className={`w-32 h-32 rounded-lg cursor-pointer transition-all ${
            isHolding ? 'bg-green-500 shadow-2xl' : 'bg-blue-600'
          }`}
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
        >
          <div className="w-full h-full flex items-center justify-center text-white font-semibold">
            {isHolding ? 'Holding...' : 'Hold Here'}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Press and hold the square - keep your finger still
      </p>
    </div>
  );
}
