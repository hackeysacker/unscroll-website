import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles } from 'lucide-react';

interface FocusResetAnimationProps {
  open: boolean;
  onComplete: () => void;
}

export function FocusResetAnimation({ open, onComplete }: FocusResetAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isComplete, setIsComplete] = useState(false);

  const ANIMATION_DURATION = 20000; // 20 seconds
  const BREATH_CYCLE_DURATION = 4000; // 4 seconds per cycle (inhale 2s, hold 1s, exhale 1s)

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setBreathPhase('inhale');
      setIsComplete(false);
      return;
    }

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / ANIMATION_DURATION) * 100);
      setProgress(newProgress);

      // Breathing cycle animation
      const cyclePosition = (elapsed % BREATH_CYCLE_DURATION) / BREATH_CYCLE_DURATION;
      if (cyclePosition < 0.5) {
        setBreathPhase('inhale');
      } else if (cyclePosition < 0.75) {
        setBreathPhase('hold');
      } else {
        setBreathPhase('exhale');
      }

      if (elapsed >= ANIMATION_DURATION) {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [open]);

  const handleComplete = () => {
    onComplete();
  };

  const getBreathInstructions = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe Out...';
    }
  };

  const getCircleScale = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'scale-150';
      case 'hold':
        return 'scale-150';
      case 'exhale':
        return 'scale-100';
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg" showCloseButton={false}>
        <div className="space-y-6 py-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Focus Reset</h2>
              <Sparkles className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Take a moment to center yourself and restore your focus
            </p>
          </div>

          {/* Breathing Circle Animation */}
          <div className="flex items-center justify-center py-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Outer glow rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-2xl animate-pulse" />

              {/* Animated circle */}
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 transition-transform duration-2000 ease-in-out ${getCircleScale()}`}
              />

              {/* Center icon */}
              <Heart className="absolute w-12 h-12 text-white fill-white" />
            </div>
          </div>

          {/* Breathing Instructions */}
          <div className="text-center">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white animate-pulse">
              {getBreathInstructions()}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {Math.floor(progress)}% complete
            </p>
          </div>

          {/* Complete Button */}
          {isComplete && (
            <div className="text-center space-y-4 animate-in fade-in duration-500">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <Heart className="w-6 h-6 fill-current" />
                <p className="font-semibold">Focus Restored! +1 Heart</p>
              </div>
              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Skip option (only before complete) */}
          {!isComplete && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleComplete}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                Skip (no heart reward)
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
