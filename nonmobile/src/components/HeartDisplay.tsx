import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_HEARTS, formatTimeRemaining, getTimeUntilNextRefill, getPremiumHeartsDisplay } from '@/lib/heart-mechanics';
import type { HeartState } from '@/types';
import { useState, useEffect } from 'react';

interface HeartDisplayProps {
  heartState: HeartState;
  isPremium: boolean;
  showTimer?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function HeartDisplay({ heartState, isPremium, showTimer = false, size = 'md', className }: HeartDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Update timer every second
  useEffect(() => {
    if (!showTimer || isPremium) return;

    const updateTimer = () => {
      const remaining = getTimeUntilNextRefill(heartState, isPremium);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [heartState, isPremium, showTimer]);

  const heartSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const heartSize = heartSizes[size];
  const textSize = textSizes[size];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Hearts Display */}
      <div className="flex items-center gap-1">
        {isPremium ? (
          // Premium: Show infinity symbol
          <div className="flex items-center gap-1">
            <Heart className={cn(heartSize, 'fill-rose-500 text-rose-500')} />
            <span className={cn('font-bold text-rose-600 dark:text-rose-400', textSize)}>
              {getPremiumHeartsDisplay()}
            </span>
          </div>
        ) : (
          // Free: Show hearts (filled/empty)
          <>
            {Array.from({ length: MAX_HEARTS }).map((_, index) => {
              const isFilled = index < heartState.currentHearts;
              return (
                <Heart
                  key={index}
                  className={cn(
                    heartSize,
                    isFilled
                      ? 'fill-rose-500 text-rose-500'
                      : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
                  )}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Timer for next refill */}
      {showTimer && !isPremium && timeRemaining !== null && heartState.currentHearts < MAX_HEARTS && (
        <div className={cn('text-gray-600 dark:text-gray-400', textSize)}>
          <span className="font-medium">Next: {formatTimeRemaining(timeRemaining)}</span>
        </div>
      )}
    </div>
  );
}
