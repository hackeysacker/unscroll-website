import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface BreathPacingChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function BreathPacingChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: BreathPacingChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleTime, setCycleTime] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const accuracyScores = useRef<number[]>([]);

  const INHALE_DURATION = 4;
  const HOLD_DURATION = 4;
  const EXHALE_DURATION = 4;
  const TOTAL_CYCLE = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION;

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

    const cycleTimer = setInterval(() => {
      setCycleTime(prev => {
        const newTime = (prev + 0.1) % TOTAL_CYCLE;

        // Update phase
        if (newTime < INHALE_DURATION) {
          setBreathPhase('inhale');
        } else if (newTime < INHALE_DURATION + HOLD_DURATION) {
          setBreathPhase('hold');
        } else {
          setBreathPhase('exhale');
        }

        return newTime;
      });
    }, 100);

    return () => clearInterval(cycleTimer);
  }, [isActive]);

  const handleComplete = () => {
    const avgAccuracy = accuracyScores.current.length > 0
      ? accuracyScores.current.reduce((a, b) => a + b, 0) / accuracyScores.current.length
      : 0.8; // Default good score for breathing exercise
    const score = Math.min(100, avgAccuracy * 100);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
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

  const getCircleScale = () => {
    if (breathPhase === 'inhale') {
      return 0.5 + (cycleTime / INHALE_DURATION) * 0.5;
    } else if (breathPhase === 'hold') {
      return 1;
    } else {
      const exhaleProgress = (cycleTime - INHALE_DURATION - HOLD_DURATION) / EXHALE_DURATION;
      return 1 - exhaleProgress * 0.5;
    }
  };

  const getPhaseText = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getPhaseColor = () => {
    switch (breathPhase) {
      case 'inhale': return 'from-blue-400 to-cyan-400';
      case 'hold': return 'from-purple-400 to-pink-400';
      case 'exhale': return 'from-green-400 to-teal-400';
    }
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="breath_pacing"
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
            <h3 className="text-2xl font-bold">Breath Pacing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Follow the breathing pattern to calm your mind
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              4-4-4 breathing: Inhale, Hold, Exhale
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

      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl shadow-lg flex items-center justify-center">
        <div
          className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} transition-transform duration-1000 ease-in-out flex items-center justify-center shadow-2xl`}
          style={{
            transform: `scale(${getCircleScale()})`,
          }}
        >
          <span className="text-white text-2xl font-bold">{getPhaseText()}</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Follow the circle's rhythm with your breathing
      </p>
    </div>
  );
}
