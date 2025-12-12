import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MAX_HEARTS, formatTimeRemaining, getTimeUntilNextRefill, getPremiumHeartsDisplay } from '@/lib/heart-mechanics';
import type { HeartState } from '@/types';
import { useState, useEffect } from 'react';

interface CornerHeartDisplayProps {
  heartState: HeartState;
  isPremium: boolean;
  className?: string;
}

export function CornerHeartDisplay({ heartState, isPremium, className }: CornerHeartDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Update timer every second
  useEffect(() => {
    if (isPremium) return;

    const updateTimer = () => {
      const remaining = getTimeUntilNextRefill(heartState, isPremium);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [heartState, isPremium]);

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50',
      'bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700',
      'px-4 py-3',
      'flex flex-col items-center gap-2',
      'transition-all duration-200 hover:shadow-xl',
      className
    )}>
      {/* Hearts Display */}
      <div className="flex items-center gap-1.5">
        {isPremium ? (
          // Premium: Show infinity symbol
          <div className="flex items-center gap-1.5">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            <span className="font-bold text-rose-600 dark:text-rose-400 text-lg">
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
                    'w-6 h-6',
                    isFilled
                      ? 'fill-rose-500 text-rose-500 animate-pulse'
                      : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
                  )}
                />
              );
            })}
          </>
        )}
      </div>

      {/* Heart count text */}
      {!isPremium && (
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {heartState.currentHearts} / {MAX_HEARTS}
          </div>
        </div>
      )}

      {/* Timer for next refill */}
      {!isPremium && timeRemaining !== null && heartState.currentHearts < MAX_HEARTS && (
        <div className="text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400">Next refill</div>
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {formatTimeRemaining(timeRemaining)}
          </div>
        </div>
      )}

      {/* Out of hearts warning */}
      {!isPremium && heartState.currentHearts === 0 && (
        <div className="text-center">
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
            No hearts!
          </div>
        </div>
      )}
    </div>
  );
}
