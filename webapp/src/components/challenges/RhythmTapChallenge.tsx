import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface RhythmTapChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function RhythmTapChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: RhythmTapChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPulse, setIsPulse] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const correctTapsRef = useRef(0);
  const wrongTapsRef = useRef(0);
  const beatInterval = 1000; // 1 second rhythm
  const lastBeatTimeRef = useRef(0);

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

  // Create pulse rhythm
  useEffect(() => {
    if (!isActive) return;

    const pulseTimer = setInterval(() => {
      setIsPulse(true);
      lastBeatTimeRef.current = Date.now();

      setTimeout(() => {
        setIsPulse(false);
      }, 200);
    }, beatInterval);

    return () => clearInterval(pulseTimer);
  }, [isActive]);

  const handleTap = () => {
    const now = Date.now();
    const timeSinceLastBeat = now - lastBeatTimeRef.current;

    // Check if tap is within rhythm window (±300ms)
    if (timeSinceLastBeat < 300 || (beatInterval - timeSinceLastBeat) < 300) {
      correctTapsRef.current += 1;
    } else {
      wrongTapsRef.current += 1;
    }
  };

  const handleComplete = () => {
    const totalTaps = correctTapsRef.current + wrongTapsRef.current;
    const accuracy = totalTaps > 0 ? (correctTapsRef.current / totalTaps) * 100 : 0;
    const score = Math.min(100, accuracy);

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
        challengeType="rhythm_tap"
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
            <h3 className="text-2xl font-bold">Rhythm Tap</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tap in rhythm with the pulsing circle - match the beat!
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
              <span className="text-green-600">On Beat: {correctTapsRef.current}</span>
              <span className="mx-2">/</span>
              <span className="text-red-600">Off Beat: {wrongTapsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        <div
          className={`w-48 h-48 rounded-full cursor-pointer transition-all ${
            isPulse ? 'bg-purple-600 scale-125' : 'bg-purple-400 scale-100'
          }`}
          onClick={handleTap}
        >
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
            {isPulse ? '🎵' : 'TAP'}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Tap when the circle pulses - find the rhythm!
      </p>
    </div>
  );
}
