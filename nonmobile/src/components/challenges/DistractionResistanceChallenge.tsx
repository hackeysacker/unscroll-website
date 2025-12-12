import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from 'lucide-react';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface DistractionResistanceChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

interface Distraction {
  id: string;
  x: number;
  y: number;
  text: string;
}

export function DistractionResistanceChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: DistractionResistanceChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [targetNumber, setTargetNumber] = useState(1);
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [clicks, setClicks] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const distractionClicksRef = useRef(0);

  const distractionTexts = [
    'Click me!', 'Special offer!', 'You won!', 'Free gift!',
    'Limited time!', 'Trending now!', '99% off!', 'New message!'
  ];

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

    // Spawn distractions every 2-4 seconds
    const spawnInterval = setInterval(() => {
      const newDistraction: Distraction = {
        id: crypto.randomUUID(),
        x: Math.random() * 70 + 10,
        y: Math.random() * 70 + 10,
        text: distractionTexts[Math.floor(Math.random() * distractionTexts.length)],
      };

      setDistractions(prev => [...prev, newDistraction]);

      // Remove after 3 seconds
      setTimeout(() => {
        setDistractions(prev => prev.filter(d => d.id !== newDistraction.id));
      }, 3000);
    }, 2500);

    return () => clearInterval(spawnInterval);
  }, [isActive]);

  const handleComplete = () => {
    const totalClicks = clicks + wrongClicks + distractionClicksRef.current;
    const goodClicks = clicks;
    const accuracy = totalClicks > 0 ? (goodClicks / totalClicks) * 100 : 0;
    const distractionPenalty = distractionClicksRef.current * 15; // Heavy penalty for clicking distractions
    const score = Math.max(0, accuracy - distractionPenalty);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy,
      correctActions: clicks,
      totalActions: totalClicks,
      additionalData: {
        distractionsClicked: distractionClicksRef.current,
        wrongClicks: wrongClicks,
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

  const handleTargetClick = () => {
    setTargetNumber(prev => prev + 1);
    setClicks(prev => prev + 1);
  };

  const handleDistractionClick = (id: string) => {
    distractionClicksRef.current += 1;
    setDistractions(prev => prev.filter(d => d.id !== id));
  };

  const handleWrongClick = () => {
    setWrongClicks(prev => prev + 1);
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="distraction_resistance"
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
            <h3 className="text-2xl font-bold">Distraction Resistance</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Stay focused on the task while ignoring pop-ups
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click the numbers in order, ignore everything else
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
              <span>Target: {targetNumber}</span>
              <span>Distractions Clicked: {distractionClicksRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        className="relative h-96 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl shadow-lg overflow-hidden"
        onClick={handleWrongClick}
      >
        {/* Main target */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTargetClick();
            }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-4xl font-bold shadow-2xl hover:scale-110 transition-transform"
          >
            {targetNumber}
          </button>
        </div>

        {/* Distractions */}
        {distractions.map(distraction => (
          <button
            key={distraction.id}
            onClick={(e) => {
              e.stopPropagation();
              handleDistractionClick(distraction.id);
            }}
            className="absolute px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg shadow-lg animate-bounce font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2"
            style={{
              left: `${distraction.x}%`,
              top: `${distraction.y}%`,
            }}
          >
            {distraction.text}
            <X className="w-4 h-4" />
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Click the number in the center, ignore the pop-ups!
      </p>
    </div>
  );
}
