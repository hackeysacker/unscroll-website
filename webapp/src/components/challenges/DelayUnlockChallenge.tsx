import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';
import { Lock, Unlock } from 'lucide-react';

interface DelayUnlockChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function DelayUnlockChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: DelayUnlockChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const holdTimeRef = useRef(0);
  const requiredHoldTime = 3000; // 3 seconds
  const successfulUnlocksRef = useRef(0);
  const failedAttemptsRef = useRef(0);

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
    if (!isHolding) {
      if (holdTimeRef.current > 0 && holdTimeRef.current < requiredHoldTime) {
        failedAttemptsRef.current += 1;
      }
      holdTimeRef.current = 0;
      setHoldProgress(0);
      return;
    }

    const interval = setInterval(() => {
      holdTimeRef.current += 100;
      setHoldProgress((holdTimeRef.current / requiredHoldTime) * 100);

      if (holdTimeRef.current >= requiredHoldTime) {
        successfulUnlocksRef.current += 1;
        setIsHolding(false);
        holdTimeRef.current = 0;
        setHoldProgress(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isHolding]);

  const handleComplete = () => {
    const totalAttempts = successfulUnlocksRef.current + failedAttemptsRef.current;
    const accuracy = totalAttempts > 0 ? (successfulUnlocksRef.current / totalAttempts) * 100 : 0;
    const score = Math.min(100, accuracy);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy,
      correctActions: successfulUnlocksRef.current,
      totalActions: totalAttempts,
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
        challengeType="delay_unlock"
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
            <h3 className="text-2xl font-bold">Delay Unlock</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hold the unlock button for 3 full seconds - practice patience
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
              <span className="text-green-600">Unlocked: {successfulUnlocksRef.current}</span>
              <span className="mx-2">/</span>
              <span className="text-red-600">Failed: {failedAttemptsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        <div className="text-center space-y-6">
          <div
            className={`w-40 h-40 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isHolding ? 'bg-yellow-500 scale-110' : 'bg-gray-600'
            }`}
            onMouseDown={() => setIsHolding(true)}
            onMouseUp={() => setIsHolding(false)}
            onMouseLeave={() => setIsHolding(false)}
            onTouchStart={() => setIsHolding(true)}
            onTouchEnd={() => setIsHolding(false)}
          >
            {isHolding ? (
              <Unlock className="w-20 h-20 text-white" />
            ) : (
              <Lock className="w-20 h-20 text-white" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold">
              {isHolding ? 'Keep Holding...' : 'Hold to Unlock'}
            </p>
            {isHolding && (
              <div className="w-64 mx-auto">
                <Progress value={holdProgress} className="h-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {Math.ceil((requiredHoldTime - holdTimeRef.current) / 1000)}s remaining
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Hold for the full 3 seconds - don't release early!
      </p>
    </div>
  );
}
