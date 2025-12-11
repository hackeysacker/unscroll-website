import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface GazeHoldChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void; // Callback to go to next lesson
  hasNextLesson?: boolean; // Whether there is a next lesson
}

export function GazeHoldChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: GazeHoldChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isGazing, setIsGazing] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const gazeTimeRef = useRef(0);
  const focusBreaksRef = useRef(0);

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
    if (!isGazing || !isActive) return;

    const interval = setInterval(() => {
      gazeTimeRef.current += 100;
    }, 100);

    return () => clearInterval(interval);
  }, [isGazing, isActive]);

  // Track focus breaks
  useEffect(() => {
    if (isActive && !isGazing && gazeTimeRef.current > 0) {
      // User released focus after starting - count as break
      focusBreaksRef.current += 1;
    }
  }, [isGazing, isActive]);

  const handleComplete = () => {
    const totalMs = duration * 1000;
    const accuracy = (gazeTimeRef.current / totalMs) * 100;
    const score = Math.min(100, accuracy);

    // Create exercise stats
    const stats: ExerciseStats = {
      score,
      duration: gazeTimeRef.current,
      accuracy,
      focusBreaks: focusBreaksRef.current,
    };

    setExerciseStats(stats);
    setShowOverview(true);
  };

  const handleOverviewContinue = () => {
    if (exerciseStats) {
      onComplete(exerciseStats.score, exerciseStats.duration);
    }
  };

  // Show overview after completing exercise
  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="gaze_hold"
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
            <h3 className="text-2xl font-bold">Gaze Hold</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Hold your focus on the dot for {duration} seconds
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
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        <div
          className={`w-20 h-20 rounded-full cursor-pointer transition-all ${
            isGazing ? 'bg-green-600 scale-110' : 'bg-blue-600'
          }`}
          onMouseDown={() => setIsGazing(true)}
          onMouseUp={() => setIsGazing(false)}
          onMouseLeave={() => setIsGazing(false)}
          onTouchStart={() => setIsGazing(true)}
          onTouchEnd={() => setIsGazing(false)}
        />
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Hold the dot to maintain focus
      </p>
    </div>
  );
}
