import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface TapPatternChallengeProps {
  duration: number; // in seconds
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function TapPatternChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: TapPatternChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(true);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const successCountRef = useRef(0);
  const totalRoundsRef = useRef(0);

  const colors = [
    { bg: 'bg-red-500', active: 'bg-red-600' },
    { bg: 'bg-blue-500', active: 'bg-blue-600' },
    { bg: 'bg-green-500', active: 'bg-green-600' },
    { bg: 'bg-yellow-500', active: 'bg-yellow-600' },
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
    if (isActive && pattern.length === 0) {
      generateNewPattern();
    }
  }, [isActive]);

  useEffect(() => {
    if (!showPattern && userPattern.length > 0) {
      // Check if current input matches pattern
      const currentIndex = userPattern.length - 1;
      if (userPattern[currentIndex] !== pattern[currentIndex]) {
        // Wrong input, show pattern again
        setTimeout(() => {
          setUserPattern([]);
          setShowPattern(true);
          generateNewPattern();
        }, 500);
      } else if (userPattern.length === pattern.length) {
        // Correct! Generate new pattern
        successCountRef.current += 1;
        totalRoundsRef.current += 1;
        setScore(Math.round((successCountRef.current / totalRoundsRef.current) * 100));
        setTimeout(() => {
          setUserPattern([]);
          setShowPattern(true);
          setRound(prev => prev + 1);
          generateNewPattern();
        }, 500);
      }
    }
  }, [userPattern, showPattern]);

  const generateNewPattern = () => {
    const length = Math.min(3 + Math.floor(round / 2), 7); // Increase difficulty
    const newPattern = Array.from({ length }, () => Math.floor(Math.random() * 4));
    setPattern(newPattern);

    // Show pattern for 2 seconds
    setTimeout(() => {
      setShowPattern(false);
    }, 2000);
  };

  const handleComplete = () => {
    const finalScore = totalRoundsRef.current > 0
      ? (successCountRef.current / totalRoundsRef.current) * 100
      : 0;

    const stats: ExerciseStats = {
      score: finalScore,
      duration: duration * 1000,
      accuracy: finalScore,
      correctActions: successCountRef.current,
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

  const handleTap = (index: number) => {
    if (showPattern) return;
    setUserPattern(prev => [...prev, index]);
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="tap_pattern"
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
            <h3 className="text-2xl font-bold">Pattern Memory</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Watch the pattern and repeat it from memory
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tests working memory and impulse control
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
              <span>Score: {score}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl shadow-lg p-8">
        <div className="h-full flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {showPattern ? 'Watch the pattern...' : 'Repeat the pattern!'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {colors.map((color, index) => {
              const isHighlighted = showPattern && pattern.includes(index);
              const isUserTapped = !showPattern && userPattern.includes(index);

              return (
                <button
                  key={index}
                  onClick={() => handleTap(index)}
                  disabled={showPattern}
                  className={`w-24 h-24 rounded-lg transition-all duration-200 ${
                    isHighlighted || isUserTapped ? color.active : color.bg
                  } ${
                    showPattern ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'
                  } shadow-lg`}
                />
              );
            })}
          </div>

          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Pattern length: {pattern.length}
          </div>
        </div>
      </div>
    </div>
  );
}
