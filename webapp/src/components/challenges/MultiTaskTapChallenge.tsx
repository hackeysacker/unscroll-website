import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface MultiTaskTapChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

interface TapTarget {
  id: number;
  x: number;
  y: number;
}

export function MultiTaskTapChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: MultiTaskTapChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isHolding, setIsHolding] = useState(false);
  const [targets, setTargets] = useState<TapTarget[]>([]);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const holdTimeRef = useRef(0);
  const tappedTargetsRef = useRef(0);
  const totalTargetsRef = useRef(0);

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

  // Track hold time
  useEffect(() => {
    if (!isHolding || !isActive) return;

    const interval = setInterval(() => {
      holdTimeRef.current += 100;
    }, 100);

    return () => clearInterval(interval);
  }, [isHolding, isActive]);

  // Generate tap targets
  useEffect(() => {
    if (!isActive) return;

    const generateTarget = () => {
      const newTarget: TapTarget = {
        id: Date.now(),
        x: Math.random() * 70 + 15,
        y: Math.random() * 50 + 25,
      };
      setTargets(prev => [...prev.slice(-2), newTarget]);
      totalTargetsRef.current += 1;

      // Auto-remove after 2.5 seconds
      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== newTarget.id));
      }, 2500);
    };

    const interval = setInterval(generateTarget, 2000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleTargetTap = (id: number) => {
    tappedTargetsRef.current += 1;
    setTargets(prev => prev.filter(t => t.id !== id));
  };

  const handleComplete = () => {
    const totalMs = duration * 1000;
    const holdAccuracy = (holdTimeRef.current / totalMs) * 100;
    const tapAccuracy = totalTargetsRef.current > 0
      ? (tappedTargetsRef.current / totalTargetsRef.current) * 100
      : 0;

    // Combined score: 50% hold + 50% tap
    const score = (holdAccuracy * 0.5 + tapAccuracy * 0.5);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy: score,
      correctActions: tappedTargetsRef.current,
      totalActions: totalTargetsRef.current,
      additionalData: {
        holdTime: holdTimeRef.current,
        holdAccuracy: Math.round(holdAccuracy),
      },
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
        challengeType="multi_task_tap"
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
            <h3 className="text-2xl font-bold">Multi-Task Tap</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hold the bottom button while tapping appearing targets
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
              <span className="text-green-600">Tapped: {tappedTargetsRef.current}</span>
              <span className="mx-2">/</span>
              <span className="text-blue-600">Holding: {isHolding ? '✓' : '✗'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Tap targets */}
        {targets.map(target => (
          <div
            key={target.id}
            className="absolute w-16 h-16 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600 transition-all flex items-center justify-center text-white font-bold"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => handleTargetTap(target.id)}
          >
            TAP
          </div>
        ))}

        {/* Hold button at bottom */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div
            className={`w-32 h-32 rounded-full cursor-pointer transition-all ${
              isHolding ? 'bg-green-600' : 'bg-blue-600'
            }`}
            onMouseDown={() => setIsHolding(true)}
            onMouseUp={() => setIsHolding(false)}
            onMouseLeave={() => setIsHolding(false)}
            onTouchStart={() => setIsHolding(true)}
            onTouchEnd={() => setIsHolding(false)}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-bold">
              HOLD
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Hold the bottom button AND tap the yellow targets
      </p>
    </div>
  );
}
