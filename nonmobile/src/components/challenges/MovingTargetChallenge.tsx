import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface MovingTargetChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function MovingTargetChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: MovingTargetChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [hits, setHits] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (!isActive) return;

    const moveTarget = setInterval(() => {
      const newX = Math.random() * 80 + 10; // 10-90%
      const newY = Math.random() * 80 + 10;
      setTargetPosition({ x: newX, y: newY });
      setTotalTargets(prev => prev + 1);
    }, 2000);

    return () => clearInterval(moveTarget);
  }, [isActive]);

  const handleComplete = () => {
    const accuracy = totalTargets > 0 ? (hits / totalTargets) * 100 : 0;
    const score = Math.min(100, accuracy);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy,
      correctActions: hits,
      totalActions: totalTargets,
    };

    setExerciseStats(stats);
    setShowOverview(true);
  };

  const handleOverviewContinue = () => {
    if (exerciseStats) {
      onComplete(exerciseStats.score, exerciseStats.duration);
    }
  };

  const handleTargetClick = () => {
    setHits(prev => prev + 1);
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="moving_target"
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
            <h3 className="text-2xl font-bold">Moving Target</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track and click the moving target as quickly as possible
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tests visual tracking and reaction speed
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
              <span>Hits: {hits}</span>
              <span>Accuracy: {totalTargets > 0 ? Math.round((hits / totalTargets) * 100) : 0}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        ref={containerRef}
        className="relative h-96 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl shadow-lg overflow-hidden"
      >
        <div
          className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center text-white font-bold shadow-lg"
          style={{
            left: `${targetPosition.x}%`,
            top: `${targetPosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={handleTargetClick}
        >
          •
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Click the moving target to earn points
      </p>
    </div>
  );
}
