import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeProps {
  onNext: () => void;
}

export function Welcome({ onNext }: WelcomeProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowAnimation(true), 200);
    // Simulate endless scrolling animation
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-8 sm:py-12 md:py-16 overflow-hidden relative"
      role="main"
      aria-label="Welcome screen"
    >
      {/* Enhanced ambient gradient orbs with movement */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }} aria-hidden="true" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" aria-hidden="true" />

      <div className={`max-w-md w-full space-y-12 sm:space-y-16 text-center relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Enhanced animated finger scrolling visualization */}
        <div className="relative h-56 sm:h-64 flex items-center justify-center mb-4 sm:mb-8">
          {showAnimation && (
            <div className="relative animate-float">
              {/* Phone/screen representation with enhanced gradient border and glow */}
              <div className="relative">
                <div className="absolute inset-0 w-44 h-60 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse" />
                <div className="relative w-40 h-56 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500 p-[2px] shadow-2xl shadow-indigo-500/50">
                  <div className="w-full h-full rounded-3xl bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
                    {/* Scrolling content lines with gradient */}
                    <div
                      className="space-y-3 p-4 transition-transform duration-100"
                      style={{ transform: `translateY(-${scrollPosition}px)` }}
                    >
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full shadow-sm shadow-indigo-400/50" />
                          <div className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full w-3/4 shadow-sm shadow-purple-400/50" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced animated finger with better glow */}
              <div
                className="absolute left-1/2 -translate-x-1/2 text-5xl animate-bounce filter drop-shadow-[0_0_12px_rgba(167,139,250,1)] transition-all duration-300"
                style={{ bottom: '15%', animationDuration: '1.5s' }}
              >
                👆
              </div>
            </div>
          )}
        </div>

        {/* Enhanced main copy with better typography */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent leading-tight animate-in fade-in duration-1000">
              Welcome.
            </h1>
            <p className="text-2xl sm:text-3xl font-semibold text-white leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Let's rebuild your attention.
            </p>
            <p className="text-base sm:text-lg text-gray-300 font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              This takes less than 90 seconds.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Button 
              onClick={onNext} 
              size="lg" 
              className="w-full text-lg py-7 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
              aria-label="Start onboarding journey"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
