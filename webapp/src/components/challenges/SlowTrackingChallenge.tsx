import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface SlowTrackingChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function SlowTrackingChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: SlowTrackingChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [isTracking, setIsTracking] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const trackingTimeRef = useRef(0);
  const trackingBreaksRef = useRef(0);

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

  // Move target slowly
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTargetPosition({
        x: 30 + Math.sin(Date.now() / 2000) * 20,
        y: 30 + Math.cos(Date.now() / 2000) * 20,
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isTracking || !isActive) return;

    const interval = setInterval(() => {
      trackingTimeRef.current += 100;
    }, 100);

    return () => clearInterval(interval);
  }, [isTracking, isActive]);

  useEffect(() => {
    if (isActive && !isTracking && trackingTimeRef.current > 0) {
      trackingBreaksRef.current += 1;
    }
  }, [isTracking, isActive]);

  const handleComplete = () => {
    const totalMs = duration * 1000;
    const accuracy = (trackingTimeRef.current / totalMs) * 100;
    const score = Math.min(100, accuracy);

    const stats: ExerciseStats = {
      score,
      duration: trackingTimeRef.current,
      accuracy,
      focusBreaks: trackingBreaksRef.current,
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
        challengeType="slow_tracking"
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
            <h3 className="text-2xl font-bold">Slow Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track the moving shape with your eyes for {duration} seconds
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

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div
          className={`absolute w-20 h-20 rounded-full cursor-pointer transition-all ${
            isTracking ? 'bg-green-500' : 'bg-purple-600'
          }`}
          style={{
            left: `${targetPosition.x}%`,
            top: `${targetPosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseDown={() => setIsTracking(true)}
          onMouseUp={() => setIsTracking(false)}
          onMouseLeave={() => setIsTracking(false)}
          onTouchStart={() => setIsTracking(true)}
          onTouchEnd={() => setIsTracking(false)}
        />
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Follow the moving circle - tap and hold to track
      </p>
    </div>
  );
}
