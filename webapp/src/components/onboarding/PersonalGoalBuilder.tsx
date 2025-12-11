import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { OnboardingGoalResult } from '@/types';
import { Moon, TrendingDown, Target, Award } from 'lucide-react';

interface PersonalGoalBuilderProps {
  onNext: (goal: OnboardingGoalResult, minutes: number) => void;
}

const goalOptions: Array<{
  value: OnboardingGoalResult;
  label: string;
  icon: typeof Moon;
  description: string;
}> = [
  {
    value: 'better_sleep',
    label: 'Better sleep',
    icon: Moon,
    description: 'Reduce late-night scrolling and improve sleep quality',
  },
  {
    value: 'reduce_scrolling',
    label: 'Reduce daily scrolling',
    icon: TrendingDown,
    description: 'Cut down overall screen time and scrolling habits',
  },
  {
    value: 'improve_focus',
    label: 'Improve focus',
    icon: Target,
    description: 'Build sustained attention and concentration',
  },
  {
    value: 'build_discipline',
    label: 'Build discipline',
    icon: Award,
    description: 'Develop mental resilience and self-control',
  },
];

const minuteOptions = [2, 5, 7, 10];

export function PersonalGoalBuilder({ onNext }: PersonalGoalBuilderProps) {
  const [step, setStep] = useState<'goal' | 'minutes'>('goal');
  const [selectedGoal, setSelectedGoal] = useState<OnboardingGoalResult>('improve_focus');
  const [selectedMinutes, setSelectedMinutes] = useState(5);

  const handleGoalNext = () => {
    setStep('minutes');
  };

  const handleComplete = () => {
    onNext(selectedGoal, selectedMinutes);
  };

  if (step === 'goal') {
    return (
      <main 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
        role="main"
        aria-label="Personal goal selection"
      >
        {/* Enhanced ambient gradient orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="max-w-lg w-full space-y-6 sm:space-y-8 relative z-10">
          <div className="text-center space-y-2 sm:space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              What result do you want in 21 days?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 font-medium">
              Choose your primary focus for the next three weeks
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {goalOptions.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoal === goal.value;
              return (
                <button
                  key={goal.value}
                  onClick={() => setSelectedGoal(goal.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedGoal(goal.value);
                    }
                  }}
                  aria-pressed={isSelected}
                  aria-label={`Select goal: ${goal.label} - ${goal.description}`}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden group focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 focus-visible:outline-none ${
                    isSelected
                      ? 'border-indigo-400 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-[1.02]'
                      : 'border-gray-800/50 bg-gray-900/50 hover:border-indigo-500/50 hover:bg-gray-900 text-white'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-600/20" />
                  )}
                  <div className="flex items-start gap-4 relative z-10">
                    <Icon className={`w-8 h-8 shrink-0 mt-0.5 ${isSelected ? 'drop-shadow-lg' : ''}`} />
                    <div className="space-y-2">
                      <div className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-gray-200'}`}>{goal.label}</div>
                      <div className={`text-sm leading-relaxed ${
                        isSelected
                          ? 'text-white/90'
                          : 'text-gray-400'
                      }`}>
                        {goal.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <Button 
            onClick={handleGoalNext} 
            size="lg" 
            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
          >
            Continue
          </Button>
        </div>
    </main>
  );
  }

  // Minutes selection
  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="Training minutes selection"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-lg w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-2 sm:space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            How many minutes a day do you want to train?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-medium">
            Short, consistent sessions work best
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {minuteOptions.map((minutes) => {
            const isSelected = selectedMinutes === minutes;
            return (
              <button
                key={minutes}
                onClick={() => setSelectedMinutes(minutes)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMinutes(minutes);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`Select ${minutes} minutes per day - ${minutes === 2 ? 'Quick' : minutes === 5 ? 'Balanced' : minutes === 7 ? 'Intensive' : 'Deep'} training`}
                className={`p-8 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 focus-visible:outline-none ${
                  isSelected
                    ? 'border-indigo-400 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                    : 'border-gray-800/50 bg-gray-900/50 hover:border-indigo-500/50 hover:bg-gray-900 text-white hover:scale-102'
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 animate-pulse" />
                )}
                <div className={`text-5xl sm:text-6xl font-bold mb-2 sm:mb-3 relative z-10 ${isSelected ? 'text-white drop-shadow-lg' : 'text-gray-200'}`}>{minutes}</div>
                <div className={`text-sm font-semibold relative z-10 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                  {minutes === 2 && 'Quick'}
                  {minutes === 5 && 'Balanced'}
                  {minutes === 7 && 'Intensive'}
                  {minutes === 10 && 'Deep'}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center p-5 rounded-xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm">
          <p className="text-sm text-gray-200 leading-relaxed">
            <strong className="text-indigo-400 font-bold">Recommended:</strong> Start with 5 minutes and adjust based on your schedule.
          </p>
        </div>

        <Button 
          onClick={handleComplete} 
          size="lg" 
          className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
        >
          Build My Plan
        </Button>
      </div>
    </main>
  );
}
