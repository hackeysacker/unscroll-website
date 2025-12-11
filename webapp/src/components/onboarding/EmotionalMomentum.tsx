import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface EmotionalMomentumProps {
  onNext: () => void;
}

export function EmotionalMomentum({ onNext }: EmotionalMomentumProps) {
  const [breatheScale, setBreatheScale] = useState(1);

  useEffect(() => {
    // Breathing animation: inhale (4s) -> exhale (4s)
    const breatheAnimation = () => {
      setBreatheScale(1.3); // Inhale
      setTimeout(() => {
        setBreatheScale(1); // Exhale
      }, 4000);
    };

    breatheAnimation();
    const interval = setInterval(breatheAnimation, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="Emotional momentum screen"
    >
      {/* Enhanced ambient gradient orbs that sync with breathing */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/15 rounded-full opacity-40 blur-3xl transition-transform duration-[4000ms] ease-in-out"
        style={{ transform: `translate(-50%, -50%) scale(${breatheScale})` }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/15 rounded-full opacity-30 blur-3xl transition-transform duration-[4000ms] ease-in-out"
        style={{ transform: `translate(-50%, -50%) scale(${breatheScale * 1.2})`, animationDelay: '0.5s' }}
      />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-md w-full space-y-8 sm:space-y-12 text-center relative z-10">
        {/* Enhanced breathing circle */}
        <div className="flex items-center justify-center py-6 sm:py-8 relative">
          {/* Multiple glowing rings with enhanced effects */}
          <div
            className="absolute w-56 h-56 rounded-full bg-indigo-500/20 blur-2xl transition-transform duration-[4000ms] ease-in-out"
            style={{ transform: `scale(${breatheScale * 1.3})` }}
          />
          <div
            className="absolute w-48 h-48 rounded-full bg-purple-500/20 blur-xl transition-transform duration-[4000ms] ease-in-out"
            style={{ transform: `scale(${breatheScale * 1.2})` }}
          />
          <div
            className="absolute w-40 h-40 rounded-full bg-pink-500/15 blur-lg transition-transform duration-[4000ms] ease-in-out"
            style={{ transform: `scale(${breatheScale * 1.1})` }}
          />

          {/* Enhanced main breathing circle */}
          <div
            className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 transition-transform duration-[4000ms] ease-in-out relative z-10 shadow-2xl shadow-indigo-500/60"
            style={{ transform: `scale(${breatheScale})` }}
          >
            {/* Inner gradient overlay with animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/40 to-pink-500/40 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-400/20 to-transparent" />
          </div>
        </div>

        {/* Enhanced motivational copy */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Imagine how much your life changes with <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">real focus</span>.
          </h2>

          <p className="text-xl sm:text-2xl text-gray-300 font-medium">
            You are <span className="font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">21 days</span> away.
          </p>
        </div>

        {/* Enhanced CTA */}
        <div className="pt-4">
          <Button 
            onClick={onNext} 
            size="lg" 
            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
          >
            Continue
          </Button>
        </div>

        {/* Enhanced breathing instruction */}
        <p className="text-sm text-gray-400 font-medium animate-pulse">
          Breathe with the circle
        </p>
      </div>
    </main>
  );
}
