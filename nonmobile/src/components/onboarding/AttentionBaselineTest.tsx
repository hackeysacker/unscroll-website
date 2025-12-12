import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface AttentionBaselineTestProps {
  onComplete: (score: number) => void;
}

export function AttentionBaselineTest({ onComplete }: AttentionBaselineTestProps) {
  const [stage, setStage] = useState<'intro' | 'testing' | 'result'>('intro');
  const [timeLeft, setTimeLeft] = useState(8);
  const [isHolding, setIsHolding] = useState(false);
  const [movements, setMovements] = useState(0);
  const [focusTime, setFocusTime] = useState(0);
  const [attentionScore, setAttentionScore] = useState(0);

  const holdStartRef = useRef<number | null>(null);
  const totalHoldTimeRef = useRef(0);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Track mouse movements during test
  useEffect(() => {
    if (stage !== 'testing') return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 20) { // Significant movement threshold
        setMovements((prev) => prev + 1);
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [stage]);

  // Countdown timer
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

    return () => clearInterval(timer);
  }, [stage]);

  // Track hold time
  useEffect(() => {
    if (!isHolding || stage !== 'testing') {
      if (holdStartRef.current) {
        totalHoldTimeRef.current += Date.now() - holdStartRef.current;
        holdStartRef.current = null;
      }
      return;
    }

    holdStartRef.current = Date.now();
    const interval = setInterval(() => {
      setFocusTime((prev) => prev + 100);
    }, 100);

    return () => {
      clearInterval(interval);
      if (holdStartRef.current) {
        totalHoldTimeRef.current += Date.now() - holdStartRef.current;
        holdStartRef.current = null;
      }
    };
  }, [isHolding, stage]);

  const calculateScore = () => {
    // Calculate final hold time
    if (holdStartRef.current) {
      totalHoldTimeRef.current += Date.now() - holdStartRef.current;
    }

    // Score based on:
    // - Percentage of time holding (max 70 points)
    // - Micro movements penalty (up to -30 points)
    const holdPercentage = (totalHoldTimeRef.current / 8000) * 100;
    const holdScore = Math.min(70, (holdPercentage / 100) * 70);
    const movementPenalty = Math.min(30, movements * 2);
    const finalScore = Math.max(0, Math.min(100, holdScore - movementPenalty));

    setAttentionScore(Math.round(finalScore));
    setStage('result');
  };

  const handleStart = () => {
    setStage('testing');
    setTimeLeft(8);
    setMovements(0);
    setFocusTime(0);
    totalHoldTimeRef.current = 0;
    lastMousePosRef.current = { x: 0, y: 0 };
  };

  if (stage === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 p-4 overflow-hidden relative">
        {/* Enhanced ambient gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
        <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="max-w-md w-full space-y-6 sm:space-y-8 text-center relative z-10">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Attention Baseline Test
            </h2>
            <p className="text-base sm:text-lg text-gray-300 font-medium">
              Stare at the dot for 8 seconds without looking away or moving.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm space-y-3 sm:space-y-4">
            <p className="text-base text-white font-semibold">
              This measures your baseline attention level. Try to:
            </p>
            <ul className="text-left text-sm text-gray-300 space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Keep your eyes on the center dot</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Keep your device/mouse still</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Don't tap or click anything</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-indigo-400 font-bold">✓</span>
                <span>Hold for the full 8 seconds</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={handleStart} 
            size="lg" 
            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
          >
            Start Test
          </Button>
        </div>
      </div>
    );
  }

  if (stage === 'testing') {
    return (
      <main 
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-8 sm:py-12 overflow-hidden relative"
        role="main"
        aria-label="Attention baseline test in progress"
      >
        {/* Enhanced ambient glow that intensifies when holding */}
        <div className={`absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transition-opacity duration-1000 ${isHolding ? 'opacity-100' : 'opacity-20'}`} />
        
        {/* Animated background orbs */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl transition-all duration-1000 ${isHolding ? 'scale-150 opacity-60' : 'scale-100 opacity-30'}`} />

        {/* Enhanced timer at top */}
        <div className="absolute top-8 sm:top-12 text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl" role="timer" aria-live="polite" aria-atomic="true">
          <span aria-label={`${timeLeft} seconds remaining`}>{timeLeft}</span>
        </div>

        {/* Enhanced center dot */}
        <div className="relative">
          {/* Multiple glowing rings when holding */}
          {isHolding && (
            <>
              <div className="absolute inset-0 w-32 h-32 -translate-x-14 -translate-y-14 rounded-full bg-indigo-400/50 blur-2xl animate-ping" />
              <div className="absolute inset-0 w-24 h-24 -translate-x-10 -translate-y-10 rounded-full bg-purple-400/60 blur-xl animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 -translate-x-6 -translate-y-6 rounded-full bg-pink-400/50 blur-lg animate-pulse" style={{ animationDelay: '0.3s' }} />
            </>
          )}

          <button
            type="button"
            className={`w-6 h-6 rounded-full transition-all duration-300 cursor-pointer relative z-10 focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-4 focus-visible:ring-offset-gray-950 focus-visible:outline-none ${
              isHolding
                ? 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/70 scale-150'
                : 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50'
            }`}
            onMouseDown={() => setIsHolding(true)}
            onMouseUp={() => setIsHolding(false)}
            onMouseLeave={() => setIsHolding(false)}
            onTouchStart={() => setIsHolding(true)}
            onTouchEnd={() => setIsHolding(false)}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setIsHolding(true);
              }
            }}
            onKeyUp={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                setIsHolding(false);
              }
            }}
            aria-label={isHolding ? "Holding focus, keep holding" : "Focus dot - hold to maintain attention"}
            aria-pressed={isHolding}
          />
        </div>

        {/* Enhanced instruction text at bottom */}
        <div className="absolute bottom-8 sm:bottom-12 text-sm sm:text-base font-medium" role="status" aria-live="polite">
          {isHolding ? (
            <span className="text-white font-bold animate-pulse">Keep focusing...</span>
          ) : (
            <span className="text-gray-400">Focus on the dot</span>
          )}
        </div>
      </main>
    );
  }

  // Results
  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-8 sm:py-12 md:py-16 overflow-hidden relative"
      role="main"
      aria-label="Attention baseline test results"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-md w-full space-y-6 sm:space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <div className="space-y-3 sm:space-y-4" role="status" aria-live="polite">
          <p className="text-lg sm:text-xl text-gray-300 font-medium">
            You held focus for
          </p>
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-indigo-500/50 blur-3xl scale-150 animate-pulse" aria-hidden="true" />
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent relative drop-shadow-2xl" aria-label={`${attentionScore} percent`}>
              {attentionScore}%
            </div>
          </div>
          <p className="text-lg sm:text-xl text-gray-300 font-medium">
            of the test
          </p>
        </div>

        <div className="p-6 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm">
          <p className="text-base text-white leading-relaxed">
            This gives us your starting level. Your attention will improve as you train.
          </p>
        </div>

        <Button 
          onClick={() => onComplete(attentionScore)} 
          size="lg" 
          className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
