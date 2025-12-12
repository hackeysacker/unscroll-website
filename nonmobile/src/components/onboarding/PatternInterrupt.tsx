import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface PatternInterruptProps {
  onNext: () => void;
}

export function PatternInterrupt({ onNext }: PatternInterruptProps) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const targetCount = 2.5;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (count < targetCount) {
      const timer = setTimeout(() => {
        setCount((prev) => Math.min(prev + 0.1, targetCount));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [count]);

  const progress = (count / targetCount) * 100;

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-8 sm:py-12 md:py-16 overflow-hidden relative"
      role="main"
      aria-label="Pattern interrupt screen"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className={`max-w-md w-full space-y-8 sm:space-y-12 text-center relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Enhanced counter animation */}
        <div className="space-y-6 sm:space-y-8">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto" aria-hidden="true">
            {/* Multiple glowing rings for depth */}
            <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-2xl animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Circular progress with gradient */}
            <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-2xl">
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-800/50"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 100}`}
                strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress / 100)}`}
                className="transition-all duration-100 drop-shadow-lg"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                  {count.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400 mt-1 font-medium">hours</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <p className="text-lg sm:text-xl font-semibold text-gray-300">
              Average person scrolls
            </p>
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {count.toFixed(1)} hours a day
            </p>
          </div>
        </div>

        {/* Enhanced reveal text */}
        {count >= targetCount && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className="p-6 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm">
              <p className="text-2xl font-bold text-white">
                You might be <span className="text-indigo-400">higher</span>.
              </p>
            </div>

            <Button
              onClick={onNext}
              size="lg"
              className="w-full text-base py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              aria-label="Continue to habit intake"
            >
              Let's check your habits
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
