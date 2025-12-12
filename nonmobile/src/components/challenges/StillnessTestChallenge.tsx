import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface StillnessTestChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function StillnessTestChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: StillnessTestChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const [movementDetected, setMovementDetected] = useState(false);
  const movementCountRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });

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

  // Detect mouse movement
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = lastPositionRef.current;
      const distance = Math.sqrt(Math.pow(e.clientX - x, 2) + Math.pow(e.clientY - y, 2));

      if (distance > 10) {
        movementCountRef.current += 1;
        setMovementDetected(true);
        setTimeout(() => setMovementDetected(false), 500);
      }

      lastPositionRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  const handleComplete = () => {
    // Score based on minimal movement (fewer movements = higher score)
    const maxAllowedMovements = 10;
    const score = Math.max(0, 100 - (movementCountRef.current / maxAllowedMovements) * 100);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy: score,
      focusBreaks: movementCountRef.current,
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
        challengeType="stillness_test"
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
            <h3 className="text-2xl font-bold">Stillness Test</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hold perfectly still - minimize all movement for {duration} seconds
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
            <div className="text-sm text-center">
              <span className={movementCountRef.current > 5 ? 'text-red-600' : 'text-green-600'}>
                Movements: {movementCountRef.current}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={`relative h-96 rounded-xl shadow-lg flex items-center justify-center transition-all ${
        movementDetected ? 'bg-red-200 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'
      }`}>
        <div className="text-center space-y-6">
          <div className="text-8xl">🧘</div>
          <div className="space-y-2">
            <p className="text-3xl font-bold">Stay Still</p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {movementDetected ? 'Movement detected!' : 'Perfect stillness...'}
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Minimize all movement - stay perfectly still
      </p>
    </div>
  );
}
