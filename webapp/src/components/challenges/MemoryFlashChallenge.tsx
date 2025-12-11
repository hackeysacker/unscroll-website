import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';

interface MemoryFlashChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export function MemoryFlashChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: MemoryFlashChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'show' | 'recall'>('show');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const correctRecallsRef = useRef(0);
  const totalRoundsRef = useRef(0);
  const sequenceLength = 4;

  useEffect(() => {
    if (isActive) {
      startNewRound();
    }
  }, [isActive]);

  const startNewRound = () => {
    // Generate random sequence
    const newSequence = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 9));
    setSequence(newSequence);
    setUserSequence([]);
    setPhase('show');

    // Show for 3 seconds then hide
    setTimeout(() => {
      setPhase('recall');

      // Auto-complete after duration
      setTimeout(() => {
        checkAnswer();
      }, duration * 1000);
    }, 3000);
  };

  const handleNumberClick = (num: number) => {
    if (phase !== 'recall') return;

    const newUserSequence = [...userSequence, num];
    setUserSequence(newUserSequence);

    if (newUserSequence.length === sequenceLength) {
      checkAnswer(newUserSequence);
    }
  };

  const checkAnswer = (answer = userSequence) => {
    totalRoundsRef.current += 1;
    const isCorrect = JSON.stringify(answer) === JSON.stringify(sequence);

    if (isCorrect) {
      correctRecallsRef.current += 1;
    }

    handleComplete();
  };

  const handleComplete = () => {
    const score = totalRoundsRef.current > 0 ? (correctRecallsRef.current / totalRoundsRef.current) * 100 : 0;

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      correctActions: correctRecallsRef.current,
      totalActions: totalRoundsRef.current,
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

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="memory_flash"
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
            <h3 className="text-2xl font-bold">Memory Flash</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Remember the sequence of {sequenceLength} numbers shown to you
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
                {phase === 'show' ? 'Memorize the sequence...' : 'Recall the sequence!'}
              </span>
            </div>
            <div className="text-sm text-center">
              <span className="text-green-600">Correct: {correctRecallsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center p-8">
        {phase === 'show' ? (
          <div className="text-center space-y-4">
            <p className="text-xl font-semibold mb-6">Remember this sequence:</p>
            <div className="flex gap-4 justify-center">
              {sequence.map((num, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-4xl font-bold"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-6">
            <p className="text-xl font-semibold text-center">
              Enter the sequence ({userSequence.length}/{sequenceLength}):
            </p>
            <div className="flex gap-4 justify-center mb-6">
              {userSequence.map((num, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 bg-green-600 text-white rounded-lg flex items-center justify-center text-4xl font-bold"
                >
                  {num}
                </div>
              ))}
              {Array.from({ length: sequenceLength - userSequence.length }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-lg"
                />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  className="w-full h-20 bg-gray-200 dark:bg-gray-700 hover:bg-indigo-500 hover:text-white rounded-lg text-2xl font-bold transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        {phase === 'show' ? 'Focus and memorize...' : 'Tap the numbers in order'}
      </p>
    </div>
  );
}
