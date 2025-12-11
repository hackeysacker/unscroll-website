import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface ControlledBreathingChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export function ControlledBreathingChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: ControlledBreathingChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const cyclesCompletedRef = useRef(0);
  const totalTimeRef = useRef(0);

  const phaseDurations: Record<BreathPhase, number> = {
    inhale: 4000,
    hold1: 4000,
    exhale: 4000,
    hold2: 4000,
  };

  const phaseSequence: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];

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

  // Breathing cycle
  useEffect(() => {
    if (!isActive) return;

    const phaseDuration = phaseDurations[phase];
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed / phaseDuration) * 100;

      if (progress >= 100) {
        // Move to next phase
        const currentIndex = phaseSequence.indexOf(phase);
        const nextIndex = (currentIndex + 1) % phaseSequence.length;
        const nextPhase = phaseSequence[nextIndex];

        if (nextPhase === 'inhale') {
          cyclesCompletedRef.current += 1;
        }

        setPhase(nextPhase);
        setPhaseProgress(0);
      } else {
        setPhaseProgress(progress);
      }

      totalTimeRef.current += 100;
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const handleComplete = () => {
    const expectedCycles = duration / 16; // Each cycle is 16 seconds
    const score = Math.min(100, (cyclesCompletedRef.current / expectedCycles) * 100);

    const stats: ExerciseStats = {
      score,
      duration: totalTimeRef.current,
      accuracy: score,
      correctActions: cyclesCompletedRef.current,
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
        challengeType="controlled_breathing"
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
            <h3 className="text-2xl font-bold">Controlled Breathing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Follow the box breathing pattern: 4-4-4-4 (inhale-hold-exhale-hold)
            </p>
          </div>
          <Button onClick={() => setIsActive(true)} className="w-full">
            Start Exercise
          </Button>
        </CardContent>
      </Card>
    );
  }

  const phaseColors: Record<BreathPhase, string> = {
    inhale: 'bg-blue-500',
    hold1: 'bg-purple-500',
    exhale: 'bg-green-500',
    hold2: 'bg-yellow-500',
  };

  const phaseLabels: Record<BreathPhase, string> = {
    inhale: 'Breathe In',
    hold1: 'Hold',
    exhale: 'Breathe Out',
    hold2: 'Hold',
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
              <span className="text-green-600">Cycles: {cyclesCompletedRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        <div className="text-center space-y-8">
          {/* Breathing circle */}
          <div className="relative flex items-center justify-center">
            <div
              className={`rounded-full transition-all duration-1000 ${phaseColors[phase]}`}
              style={{
                width: phase === 'inhale' ? '200px' : '100px',
                height: phase === 'inhale' ? '200px' : '100px',
              }}
            />
          </div>

          {/* Phase label */}
          <div className="space-y-2">
            <p className="text-3xl font-bold">{phaseLabels[phase]}</p>
            <Progress value={phaseProgress} className="w-64 mx-auto" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {Math.ceil((phaseDurations[phase] * (100 - phaseProgress)) / 1000)}s remaining
            </p>
          </div>

          {/* Breathing pattern guide */}
          <div className="grid grid-cols-4 gap-2 text-xs">
            {phaseSequence.map((p, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  p === phase ? phaseColors[p] + ' text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {phaseLabels[p]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Follow the breathing pattern - 4 seconds each phase
      </p>
    </div>
  );
}
