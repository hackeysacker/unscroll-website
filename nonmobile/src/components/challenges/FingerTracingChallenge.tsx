import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface FingerTracingChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function FingerTracingChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: FingerTracingChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isTracing, setIsTracing] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const traceTimeRef = useRef(0);
  const offPathCountRef = useRef(0);

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
    if (!isTracing || !isActive) return;

    const interval = setInterval(() => {
      traceTimeRef.current += 100;
    }, 100);

    return () => clearInterval(interval);
  }, [isTracing, isActive]);

  const handleComplete = () => {
    const totalMs = duration * 1000;
    const accuracy = (traceTimeRef.current / totalMs) * 100;
    const penaltyForOffPath = Math.min(50, offPathCountRef.current * 5);
    const score = Math.max(0, Math.min(100, accuracy - penaltyForOffPath));

    const stats: ExerciseStats = {
      score,
      duration: traceTimeRef.current,
      accuracy,
      focusBreaks: offPathCountRef.current,
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
        challengeType="finger_tracing"
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
            <h3 className="text-2xl font-bold">Finger Tracing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Trace the path accurately - stay inside the lines
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
              <span className={offPathCountRef.current > 3 ? 'text-red-600' : 'text-green-600'}>
                Off Path: {offPathCountRef.current}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        {/* Path to trace - a simple winding path */}
        <svg width="300" height="300" className="absolute">
          <path
            d="M 50 150 Q 100 50, 150 150 T 250 150"
            stroke="#e5e7eb"
            strokeWidth="60"
            fill="none"
          />
          <path
            d="M 50 150 Q 100 50, 150 150 T 250 150"
            stroke="#6366f1"
            strokeWidth="4"
            fill="none"
          />
        </svg>

        <div
          className={`absolute w-full h-full ${isTracing ? 'cursor-crosshair' : 'cursor-pointer'}`}
          onMouseDown={() => setIsTracing(true)}
          onMouseUp={() => setIsTracing(false)}
          onMouseLeave={() => {
            if (isTracing) {
              offPathCountRef.current += 1;
              setIsTracing(false);
            }
          }}
          onTouchStart={() => setIsTracing(true)}
          onTouchEnd={() => setIsTracing(false)}
        />
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        {isTracing ? 'Keep tracing along the path...' : 'Touch and hold to trace the blue path'}
      </p>
    </div>
  );
}
