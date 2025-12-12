import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Volume2, VolumeX } from 'lucide-react';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface AudioFocusChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function AudioFocusChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: AudioFocusChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [targetCount, setTargetCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [round, setRound] = useState(1);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const beepCountRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const correctCountsRef = useRef(0);
  const totalRoundsRef = useRef(0);

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
    if (isActive && !isListening) {
      startRound();
    }
  }, [isActive, round]);

  const playBeep = (frequency: number, duration: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  };

  const startRound = () => {
    const beeps = Math.floor(Math.random() * 5) + 3; // 3-7 beeps
    setTargetCount(beeps);
    setUserCount(0);
    setIsListening(true);
    beepCountRef.current = 0;

    let currentBeep = 0;
    const beepInterval = setInterval(() => {
      if (currentBeep >= beeps) {
        clearInterval(beepInterval);
        setTimeout(() => {
          setIsListening(false);
        }, 1000);
        return;
      }

      // Play beep with occasional distractions
      const isDistraction = Math.random() < 0.3;
      const frequency = isDistraction ? 800 : 440; // Target is 440Hz, distraction is 800Hz
      playBeep(frequency, 150);

      if (!isDistraction) {
        beepCountRef.current += 1;
      }

      currentBeep += 1;
    }, 800);
  };

  const handleComplete = () => {
    const accuracy = totalRoundsRef.current > 0 ? (correctCountsRef.current / totalRoundsRef.current) * 100 : 70;
    const score = Math.min(100, accuracy);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      accuracy,
      correctActions: correctCountsRef.current,
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

  const handleCountSubmit = (count: number) => {
    setUserCount(count);
    totalRoundsRef.current += 1;

    // Check if correct
    if (count === beepCountRef.current) {
      correctCountsRef.current += 1;
    }

    // Move to next round after a delay
    setTimeout(() => {
      setRound(prev => prev + 1);
      setIsListening(false);
    }, 1000);
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="audio_focus"
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
            <h3 className="text-2xl font-bold">Audio Focus</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Count the target beeps while ignoring distractions
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tests auditory attention and filtering
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
              <span>Round: {round}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl shadow-lg flex flex-col items-center justify-center gap-8 p-8">
        {isListening ? (
          <div className="text-center space-y-6">
            <Volume2 className="w-24 h-24 text-violet-600 mx-auto animate-pulse" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Listen carefully...
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Count the low-pitched beeps
            </p>
          </div>
        ) : (
          <div className="text-center space-y-6 w-full max-w-md">
            <VolumeX className="w-24 h-24 text-gray-400 mx-auto" />
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              How many beeps did you hear?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <Button
                  key={num}
                  onClick={() => handleCountSubmit(num)}
                  variant="outline"
                  className="h-16 text-lg font-bold"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Focus on the low-pitched target beeps
      </p>
    </div>
  );
}
