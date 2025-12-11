import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';
import { ArrowUp } from 'lucide-react';

interface AntiScrollSwipeChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function AntiScrollSwipeChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: AntiScrollSwipeChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const swipeUpCountRef = useRef(0);
  const requiredSwipes = 5;
  const startYRef = useRef(0);

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

    // Auto-scroll down (simulating doom scroll)
    const scrollInterval = setInterval(() => {
      setScrollPosition(prev => Math.min(prev + 5, 100));
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(scrollInterval);
    };
  }, [isActive]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startYRef.current;

    // Swipe up detected (deltaY negative = swipe up)
    if (deltaY < -50) {
      handleSwipeUp();
    }
  };

  const handleSwipeUp = () => {
    swipeUpCountRef.current += 1;
    setScrollPosition(prev => Math.max(prev - 20, 0));
  };

  const handleComplete = () => {
    const score = Math.min(100, (swipeUpCountRef.current / requiredSwipes) * 100);

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      correctActions: swipeUpCountRef.current,
      totalActions: requiredSwipes,
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
        challengeType="anti_scroll_swipe"
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
            <h3 className="text-2xl font-bold">Anti-Scroll Swipe</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Break the doom scroll! Swipe UP {requiredSwipes} times to fight the auto-scroll
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
              <span className="text-green-600">Swipes: {swipeUpCountRef.current} / {requiredSwipes}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        className="relative h-96 bg-gradient-to-b from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-xl shadow-lg overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleSwipeUp}
      >
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{ transform: `translateY(${scrollPosition}%)` }}
        >
          <div className="p-8 space-y-6">
            <div className="text-center text-6xl animate-pulse">⬇️</div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-bold">Scrolling down...</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">This is the doom scroll effect</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-bold">Keep scrolling...</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Or swipe up to break free!</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <p className="font-bold">More content...</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Infinite scroll awaits...</p>
            </div>
          </div>
        </div>

        {/* Swipe Up Indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg animate-bounce">
            <ArrowUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Swipe or click UP to resist the scroll!
      </p>
    </div>
  );
}
