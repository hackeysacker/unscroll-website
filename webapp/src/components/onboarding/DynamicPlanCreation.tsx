import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface DynamicPlanCreationProps {
  onNext: () => void;
}

const planDays = [
  { day: 1, exercise: 'Focus Hold' },
  { day: 2, exercise: 'Finger Hold' },
  { day: 3, exercise: 'Reaction Inhibition' },
  { day: 4, exercise: 'Scroll Resistance' },
  { day: 5, exercise: 'Combined Drill' },
];

export function DynamicPlanCreation({ onNext }: DynamicPlanCreationProps) {
  const [visibleCards, setVisibleCards] = useState(0);

  useEffect(() => {
    if (visibleCards < planDays.length) {
      const timer = setTimeout(() => {
        setVisibleCards((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visibleCards]);

  const dayColors = [
    'bg-indigo-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-indigo-500',
  ];

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="Dynamic plan creation"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-lg w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-2 sm:space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Your attention plan is ready
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-medium">
            A personalized 21-day journey to rebuild your focus
          </p>
        </div>

        {/* Enhanced animated card stack */}
        <div className="space-y-2 sm:space-y-3">
          {planDays.map((item, index) => (
            <div
              key={item.day}
              className={`p-6 rounded-xl border-2 transition-all duration-500 hover:scale-[1.02] ${
                index < visibleCards
                  ? 'opacity-100 translate-y-0 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm shadow-lg shadow-indigo-500/20'
                  : 'opacity-0 translate-y-4 border-gray-800 bg-gray-900/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${dayColors[index]} flex items-center justify-center shrink-0 shadow-lg`}>
                  <span className="text-white font-bold text-lg">
                    {item.day}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-gray-400 font-medium mb-1">
                    Day {item.day}
                  </div>
                  <div className="font-semibold text-white text-lg">
                    {item.exercise}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {visibleCards >= planDays.length && (
            <div className="pt-3 text-center animate-in fade-in duration-700">
              <p className="text-sm text-gray-400 font-medium">
                + 16 more exercises with increasing difficulty
              </p>
            </div>
          )}
        </div>

        {visibleCards >= planDays.length && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Button 
              onClick={onNext} 
              size="lg" 
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
