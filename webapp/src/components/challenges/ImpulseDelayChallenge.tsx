import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface ImpulseDelayChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function ImpulseDelayChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: ImpulseDelayChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [targetDelay, setTargetDelay] = useState(3);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const pressTimerRef = useRef<number>(0);

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
    if (!isPressing || pressStartTime === null) return;

    const interval = setInterval(() => {
      pressTimerRef.current = Date.now() - pressStartTime;
    }, 10);

    return () => clearInterval(interval);
  }, [isPressing, pressStartTime]);

  const handleComplete = () => {
    if (attempts.length === 0) {
      const stats: ExerciseStats = {
        score: 0,
        duration: duration * 1000,
        accuracy: 0,
        correctActions: 0,
        totalActions: 0,
      };
      setExerciseStats(stats);
      setShowOverview(true);
      return;
    }

    // Calculate accuracy based on how close to target delay
    const accuracies = attempts.map(attempt => {
      const diff = Math.abs(attempt - targetDelay * 1000);
      const maxDiff = targetDelay * 1000;
      return Math.max(0, 1 - (diff / maxDiff));
    });

    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    const score = Math.min(100, avgAccuracy * 100);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy: avgAccuracy * 100,
      totalActions: attempts.length,
    };

    setExerciseStats(stats);
    setShowOverview(true);
  };

  const handleOverviewContinue = () => {
    if (exerciseStats) {
      onComplete(exerciseStats.score, exerciseStats.duration);
    }
  };

  const handlePressStart = () => {
    setIsPressing(true);
    setPressStartTime(Date.now());
    pressTimerRef.current = 0;
  };

  const handlePressEnd = () => {
    if (!isPressing || pressStartTime === null) return;

    const elapsed = Date.now() - pressStartTime;
    setAttempts(prev => [...prev, elapsed]);
    setCurrentAttempt(prev => prev + 1);

    // Generate new random target delay (2-5 seconds)
    setTargetDelay(Math.floor(Math.random() * 3) + 2);

    setIsPressing(false);
    setPressStartTime(null);
    pressTimerRef.current = 0;
  };

  const getCurrentDelay = () => {
    return isPressing && pressStartTime ? Date.now() - pressStartTime : 0;
  };

  const getAccuracyColor = () => {
    if (!isPressing) return 'bg-gray-400';

    const elapsed = getCurrentDelay();
    const target = targetDelay * 1000;
    const diff = Math.abs(elapsed - target);

    if (diff < 200) return 'bg-green-500';
    if (diff < 500) return 'bg-yellow-500';
    if (diff < 1000) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="impulse_delay"
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
            <h3 className="text-2xl font-bold">Impulse Delay</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hold the button for exactly the target duration
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tests impulse control and time estimation
            </p>
          </div>
          <Button onClick={() => setIsActive(true)} className="w-full">
            Start Challenge
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
            <div className="flex justify-between text-sm">
              <span>Attempts: {currentAttempt}</span>
              <span>Target: {targetDelay}s</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl shadow-lg flex flex-col items-center justify-center gap-8 p-8">
        <div className="text-center space-y-2">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            Hold for {targetDelay} seconds
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isPressing ? `${(getCurrentDelay() / 1000).toFixed(2)}s` : 'Press and hold'}
          </p>
        </div>

        <button
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          className={`w-48 h-48 rounded-full ${getAccuracyColor()} text-white text-xl font-bold shadow-2xl transition-all active:scale-95 select-none`}
        >
          {isPressing ? 'Release at target!' : 'Press & Hold'}
        </button>

        {attempts.length > 0 && (
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Last attempt: {(attempts[attempts.length - 1] / 1000).toFixed(2)}s
          </div>
        )}
      </div>
    </div>
  );
}
