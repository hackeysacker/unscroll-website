import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface TapOnlyCorrectChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

interface Target {
  id: number;
  x: number;
  y: number;
  isCorrect: boolean;
}

export function TapOnlyCorrectChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: TapOnlyCorrectChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [targets, setTargets] = useState<Target[]>([]);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const correctTapsRef = useRef(0);
  const wrongTapsRef = useRef(0);
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

  // Generate targets periodically
  useEffect(() => {
    if (!isActive) return;

    const generateTarget = () => {
      const newTarget: Target = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        isCorrect: Math.random() > 0.3, // 70% correct targets
      };
      setTargets(prev => [...prev.slice(-3), newTarget]);
      totalTargetsRef.current += 1;
    };

    generateTarget();
    const interval = setInterval(generateTarget, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleTap = (target: Target) => {
    if (target.isCorrect) {
      correctTapsRef.current += 1;
    } else {
      wrongTapsRef.current += 1;
    }
    setTargets(prev => prev.filter(t => t.id !== target.id));
  };

  const handleComplete = () => {
    const totalTaps = correctTapsRef.current + wrongTapsRef.current;
    const accuracy = totalTaps > 0 ? (correctTapsRef.current / totalTaps) * 100 : 0;
    const completionRate = totalTargetsRef.current > 0 ? (correctTapsRef.current / (totalTargetsRef.current * 0.7)) * 100 : 0;
    const score = Math.min(100, (accuracy * 0.6 + completionRate * 0.4));

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy,
      correctActions: correctTapsRef.current,
      totalActions: totalTaps,
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
        challengeType="tap_only_correct"
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
            <h3 className="text-2xl font-bold">Tap Only Correct</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tap only the GREEN circles - ignore the red ones
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
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Correct: {correctTapsRef.current}</span>
              <span className="text-red-600">Wrong: {wrongTapsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {targets.map(target => (
          <div
            key={target.id}
            className={`absolute w-16 h-16 rounded-full cursor-pointer transition-all ${
              target.isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => handleTap(target)}
          />
        ))}
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Tap GREEN circles only - ignore RED ones
      </p>
    </div>
  );
}
