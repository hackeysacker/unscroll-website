import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface ImpulseSpikeTestChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

interface Bait {
  id: number;
  x: number;
  y: number;
  type: 'flash' | 'button' | 'popup';
}

export function ImpulseSpikeTestChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: ImpulseSpikeTestChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [baits, setBaits] = useState<Bait[]>([]);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const clickedBaitsRef = useRef(0);
  const totalBaitsRef = useRef(0);

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

  // Generate tempting baits
  useEffect(() => {
    if (!isActive) return;

    const generateBait = () => {
      const types: Array<'flash' | 'button' | 'popup'> = ['flash', 'button', 'popup'];
      const newBait: Bait = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        type: types[Math.floor(Math.random() * types.length)],
      };

      setBaits(prev => [...prev, newBait]);
      totalBaitsRef.current += 1;

      // Auto-remove after 2 seconds
      setTimeout(() => {
        setBaits(prev => prev.filter(b => b.id !== newBait.id));
      }, 2000);
    };

    const interval = setInterval(generateBait, 1500);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleBaitClick = (id: number) => {
    clickedBaitsRef.current += 1;
    setBaits(prev => prev.filter(b => b.id !== id));
  };

  const handleComplete = () => {
    // Score based on resisting clicks (higher is better)
    const resistedBaits = totalBaitsRef.current - clickedBaitsRef.current;
    const score = totalBaitsRef.current > 0
      ? (resistedBaits / totalBaitsRef.current) * 100
      : 100;

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      correctActions: resistedBaits,
      totalActions: totalBaitsRef.current,
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
        challengeType="impulse_spike_test"
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
            <h3 className="text-2xl font-bold">Impulse Spike Test</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Resist clicking bright, tempting buttons and flashes!
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
              <span className="text-green-600">Resisted: {totalBaitsRef.current - clickedBaitsRef.current}</span>
              <span className="mx-2">/</span>
              <span className="text-red-600">Clicked: {clickedBaitsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-lg overflow-hidden">
        {/* Central focus point */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-2xl font-bold">Stay Focused</p>
            <p className="text-sm mt-2 opacity-70">Don't click anything</p>
          </div>
        </div>

        {/* Tempting baits */}
        {baits.map(bait => (
          <div
            key={bait.id}
            className="absolute animate-pulse"
            style={{ left: `${bait.x}%`, top: `${bait.y}%` }}
            onClick={() => handleBaitClick(bait.id)}
          >
            {bait.type === 'flash' && (
              <div className="w-20 h-20 bg-yellow-400 rounded-full cursor-pointer shadow-2xl animate-ping" />
            )}
            {bait.type === 'button' && (
              <button className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-2xl hover:bg-red-600 cursor-pointer">
                CLICK ME!
              </button>
            )}
            {bait.type === 'popup' && (
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-2xl cursor-pointer">
                <p className="font-bold text-sm">You won!</p>
                <p className="text-xs">Claim prize</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Resist all temptations - don't click anything!
      </p>
    </div>
  );
}
