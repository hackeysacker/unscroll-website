import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface StabilityHoldChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function StabilityHoldChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: StabilityHoldChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [inZoneTime, setInZoneTime] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const inZoneRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const ZONE_RADIUS = 60; // pixels

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

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setCursorPos({ x, y });

      // Calculate if cursor is in zone
      const targetX = (targetPos.x / 100) * rect.width;
      const targetY = (targetPos.y / 100) * rect.height;
      const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));

      if (distance <= ZONE_RADIUS) {
        inZoneRef.current += 50; // Add 50ms
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const updateInterval = setInterval(() => {
      setInZoneTime(inZoneRef.current);
    }, 50);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(updateInterval);
    };
  }, [isActive, targetPos]);

  const handleComplete = () => {
    const totalMs = duration * 1000;
    const accuracy = Math.min(1, inZoneRef.current / totalMs);
    const score = accuracy * 100;

    const stats: ExerciseStats = {
      score,
      duration: inZoneRef.current,
      accuracy: score,
    };

    setExerciseStats(stats);
    setShowOverview(true);
  };

  const handleOverviewContinue = () => {
    if (exerciseStats) {
      onComplete(exerciseStats.score, exerciseStats.duration);
    }
  };

  const isInZone = () => {
    if (!containerRef.current) return false;

    const rect = containerRef.current.getBoundingClientRect();
    const targetX = (targetPos.x / 100) * rect.width;
    const targetY = (targetPos.y / 100) * rect.height;
    const distance = Math.sqrt(
      Math.pow(cursorPos.x - targetX, 2) + Math.pow(cursorPos.y - targetY, 2)
    );

    return distance <= ZONE_RADIUS;
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="stability_hold"
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
            <h3 className="text-2xl font-bold">Stability Hold</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Keep your cursor stable within the target zone
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tests hand steadiness and fine motor control
            </p>
          </div>
          <Button onClick={() => setIsActive(true)} className="w-full">
            Start Challenge
          </Button>
        </CardContent>
      </Card>
    );
  }

  const accuracy = ((inZoneTime / (duration * 1000)) * 100).toFixed(1);

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
              <span>In Zone: {(inZoneTime / 1000).toFixed(1)}s</span>
              <span>Stability: {accuracy}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        ref={containerRef}
        className="relative h-96 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl shadow-lg overflow-hidden cursor-none"
      >
        {/* Target zone */}
        <div
          className={`absolute rounded-full transition-colors ${
            isInZone() ? 'bg-green-400/40' : 'bg-gray-400/20'
          } border-4 ${
            isInZone() ? 'border-green-600' : 'border-gray-400'
          }`}
          style={{
            left: `${targetPos.x}%`,
            top: `${targetPos.y}%`,
            width: `${ZONE_RADIUS * 2}px`,
            height: `${ZONE_RADIUS * 2}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gray-800 dark:bg-gray-200" />
          </div>
        </div>

        {/* Cursor indicator */}
        <div
          className="absolute w-6 h-6 rounded-full bg-blue-600 pointer-events-none"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Keep your cursor stable inside the target zone
      </p>
    </div>
  );
}
