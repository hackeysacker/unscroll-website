import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface FirstWinProps {
  onNext: () => void;
}

export function FirstWin({ onNext }: FirstWinProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 relative overflow-hidden"
      role="main"
      aria-label="First win celebration"
    >
      {/* Enhanced confetti effect */}
      {showConfetti && (
        <>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 animate-pulse shadow-lg"
              style={{
                left: `${15 + i * 4}%`,
                top: `${5 + (i % 4) * 20}%`,
                animationDelay: `${i * 100}ms`,
                opacity: 0.7,
                boxShadow: '0 0 10px rgba(129, 140, 248, 0.6)',
              }}
            />
          ))}
        </>
      )}

      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-md w-full space-y-8 sm:space-y-12 text-center relative z-10">
        {/* Enhanced icon */}
        <div className="flex justify-center animate-in zoom-in duration-700 mb-4 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-0 w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-indigo-500/30 blur-2xl animate-pulse" />
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/60">
              <Sparkles className="w-14 h-14 sm:w-16 sm:h-16 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Enhanced main message */}
        <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              You just completed
            </h2>
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              1%
            </div>
            <p className="text-lg sm:text-xl text-gray-300 font-medium">
              of your attention journey
            </p>
          </div>

          <div className="p-6 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm">
            <p className="text-sm text-gray-200 leading-relaxed">
              Every expert started exactly where you are now. The difference is they kept going.
            </p>
          </div>
        </div>

        {/* Enhanced CTA */}
        <Button 
          onClick={onNext} 
          size="lg" 
          className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
        >
          Start Your First 2-Minute Training
        </Button>
      </div>
    </main>
  );
}
