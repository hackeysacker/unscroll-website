import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface ReactionInhibitionChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

interface Target {
  id: number;
  color: 'green' | 'red' | 'blue';
  shouldTap: boolean;
}

export function ReactionInhibitionChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: ReactionInhibitionChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentTarget, setCurrentTarget] = useState<Target | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const correctActionsRef = useRef(0);
  const wrongActionsRef = useRef(0);
  const targetRule = 'green'; // Only tap green

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

  // Generate targets
  useEffect(() => {
    if (!isActive) return;

    const generateTarget = () => {
      const colors: Array<'green' | 'red' | 'blue'> = ['green', 'red', 'blue'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shouldTap = color === targetRule;

      setCurrentTarget({
        id: Date.now(),
        color,
        shouldTap,
      });

      // Auto-remove after 1.5 seconds (missed opportunity)
      setTimeout(() => {
        setCurrentTarget(prev => {
          if (prev && prev.id === Date.now()) {
            // Target wasn't tapped
            if (prev.shouldTap) {
              wrongActionsRef.current += 1; // Missed a green
            } else {
              correctActionsRef.current += 1; // Correctly ignored
            }
          }
          return null;
        });
      }, 1500);
    };

    const interval = setInterval(generateTarget, 2000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleTap = () => {
    if (!currentTarget) return;

    if (currentTarget.shouldTap) {
      correctActionsRef.current += 1;
    } else {
      wrongActionsRef.current += 1;
    }

    setCurrentTarget(null);
  };

  const handleComplete = () => {
    const totalActions = correctActionsRef.current + wrongActionsRef.current;
    const accuracy = totalActions > 0 ? (correctActionsRef.current / totalActions) * 100 : 0;
    const score = Math.min(100, accuracy);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy,
      correctActions: correctActionsRef.current,
      totalActions,
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
        challengeType="reaction_inhibition"
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
            <h3 className="text-2xl font-bold">Reaction Inhibition</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tap ONLY when you see GREEN - resist tapping red or blue!
            </p>
          </div>
          <Button onClick={() => setIsActive(true)} className="w-full">
            Start Exercise
          </Button>
        </CardContent>
      </Card>
    );
  }

  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

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
              <span className="text-green-600">Correct: {correctActionsRef.current}</span>
              <span className="mx-2">/</span>
              <span className="text-red-600">Wrong: {wrongActionsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        {currentTarget ? (
          <div
            className={`w-40 h-40 rounded-full cursor-pointer transition-all ${colorClasses[currentTarget.color]} hover:scale-110`}
            onClick={handleTap}
          />
        ) : (
          <div className="text-center text-gray-400">
            <p className="text-2xl font-semibold">Get Ready...</p>
            <p className="text-sm mt-2">Tap GREEN only!</p>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Rule: Tap GREEN circles only - ignore all others
      </p>
    </div>
  );
}
