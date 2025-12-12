import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BaselineTestProps {
  onComplete: (level: number) => void;
  onSkip: () => void;
}

export function BaselineTest({ onComplete, onSkip }: BaselineTestProps) {
  const [stage, setStage] = useState<'intro' | 'testing' | 'results'>('intro');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [distractionCount, setDistractionCount] = useState(0);
  const [isGazing, setIsGazing] = useState(false);
  const gazeTimeRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (stage !== 'testing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          calculateScore();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Add random distractions
    const distractionTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        setDistractionCount((prev) => prev + 1);
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(distractionTimer);
    };
  }, [stage]);

  useEffect(() => {
    if (!isGazing || stage !== 'testing') return;

    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      gazeTimeRef.current += 100;
    }, 100);

    return () => clearInterval(interval);
  }, [isGazing, stage]);

  const calculateScore = () => {
    const focusPercentage = (gazeTimeRef.current / 30000) * 100;
    const distractionPenalty = distractionCount * 5;
    const finalScore = Math.max(0, Math.min(100, focusPercentage - distractionPenalty));
    setScore(Math.floor(finalScore));
    setStage('results');
  };

  const getAssignedLevel = (testScore: number): number => {
    if (testScore >= 80) return 5;
    if (testScore >= 60) return 3;
    if (testScore >= 40) return 2;
    return 1;
  };

  const handleComplete = () => {
    const level = getAssignedLevel(score);
    onComplete(level);
  };

  if (stage === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Optional: Quick Baseline Test</CardTitle>
              <CardDescription>
                A 30-second focus test to determine your starting level (or skip to start at Level 1)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Why take this test?</strong> This helps us place you at an appropriate difficulty level. Skip if you prefer to start from the beginning.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Instructions:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li>A blue dot will appear on screen - this is your focus target</li>
                    <li>Press and hold your finger/mouse on the dot</li>
                    <li>Keep holding as long as you can, even when distractions appear</li>
                    <li>The test lasts 30 seconds total</li>
                  </ol>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Your score will determine your starting level (1-5). Don't worry - you can always adjust difficulty later!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={onSkip} variant="outline" className="flex-1">
                  Skip - Start at Level 1
                </Button>
                <Button onClick={() => setStage('testing')} className="flex-1">
                  Take the Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === 'testing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl w-full space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Time Remaining</span>
                  <span className="text-2xl font-bold">{timeLeft}s</span>
                </div>
                <Progress value={(timeLeft / 30) * 100} />
              </div>
            </CardContent>
          </Card>

          <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
            <div
              className="w-16 h-16 bg-blue-600 rounded-full cursor-pointer transition-transform hover:scale-110"
              onMouseDown={() => setIsGazing(true)}
              onMouseUp={() => setIsGazing(false)}
              onMouseLeave={() => setIsGazing(false)}
              onTouchStart={() => setIsGazing(true)}
              onTouchEnd={() => setIsGazing(false)}
            />

            {distractionCount > 0 && distractionCount % 2 === 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg animate-pulse">
                Distraction!
              </div>
            )}
          </div>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Hold the blue dot to maintain focus
          </p>
        </div>
      </div>
    );
  }

  // Results stage
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Complete!</CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400">
                {score}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Focus Score</p>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Starting Level: {getAssignedLevel(score)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {score >= 80 && "Excellent focus! You'll start at an intermediate level."}
                  {score >= 60 && score < 80 && "Good focus! You'll start at a comfortable level."}
                  {score >= 40 && score < 60 && "Fair focus. We'll start you at a beginner level."}
                  {score < 40 && "We'll start you at level 1 and build up from there."}
                </p>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full">
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
