import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface MultiObjectTrackingChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

interface MovingObject {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isTarget: boolean;
}

export function MultiObjectTrackingChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: MultiObjectTrackingChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'show' | 'track' | 'select'>('show');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [objects, setObjects] = useState<MovingObject[]>([]);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const correctSelectionsRef = useRef(0);
  const totalRoundsRef = useRef(0);

  useEffect(() => {
    if (isActive && phase === 'show') {
      initializeRound();
    }
  }, [isActive, phase]);

  const initializeRound = () => {
    // Create 6 objects, 2 are targets
    const newObjects: MovingObject[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 70 + 15,
      y: Math.random() * 70 + 15,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      isTarget: i < 2, // First 2 are targets
    }));

    setObjects(newObjects);

    // Show targets for 2 seconds
    setTimeout(() => {
      setPhase('track');

      // Track for duration seconds
      setTimeout(() => {
        setPhase('select');
      }, 5000);
    }, 2000);
  };

  // Animate objects
  useEffect(() => {
    if (phase !== 'track') return;

    const interval = setInterval(() => {
      setObjects(prev => prev.map(obj => {
        let { x, y, vx, vy } = obj;

        x += vx;
        y += vy;

        // Bounce off walls
        if (x <= 0 || x >= 100) vx = -vx;
        if (y <= 0 || y >= 100) vy = -vy;

        return { ...obj, x, y, vx, vy };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [phase]);

  const handleObjectSelect = (id: number) => {
    if (phase !== 'select') return;

    const object = objects.find(o => o.id === id);
    if (!object) return;

    totalRoundsRef.current += 1;

    if (object.isTarget) {
      correctSelectionsRef.current += 1;
    }

    // Check if we should continue or complete
    if (totalRoundsRef.current >= 2) {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const score = totalRoundsRef.current > 0 ? (correctSelectionsRef.current / totalRoundsRef.current) * 100 : 0;

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy: score,
      correctActions: correctSelectionsRef.current,
      totalActions: totalRoundsRef.current,
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
        challengeType="multi_object_tracking"
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
            <h3 className="text-2xl font-bold">Multi-Object Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Track the highlighted circles as they move and mix with others
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
            <div className="text-center">
              <span className="text-sm font-medium">
                {phase === 'show' && 'Remember these targets...'}
                {phase === 'track' && 'Keep tracking...'}
                {phase === 'select' && 'Select the targets!'}
              </span>
            </div>
            <div className="text-sm text-center">
              <span className="text-green-600">Correct: {correctSelectionsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {objects.map(obj => (
          <div
            key={obj.id}
            className={`absolute w-12 h-12 rounded-full transition-all cursor-pointer ${
              phase === 'show' && obj.isTarget
                ? 'bg-yellow-500 ring-4 ring-yellow-300'
                : phase === 'select'
                ? 'bg-gray-400 hover:bg-blue-500'
                : 'bg-gray-400'
            }`}
            style={{
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => handleObjectSelect(obj.id)}
          />
        ))}
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        {phase === 'show' && 'Memorize the highlighted circles'}
        {phase === 'track' && 'Keep your eyes on them as they move'}
        {phase === 'select' && 'Click the circles you tracked'}
      </p>
    </div>
  );
}
