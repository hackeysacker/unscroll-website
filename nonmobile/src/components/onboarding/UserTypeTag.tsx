import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { UserPersonalityType } from '@/types';
import { Brain, Clock, Moon, Zap, Briefcase, Target } from 'lucide-react';

interface UserTypeTagProps {
  onNext: (personalityType: UserPersonalityType) => void;
}

const personalityTypes: Array<{
  value: UserPersonalityType;
  label: string;
  icon: typeof Brain;
}> = [
  { value: 'overthinker', label: 'Overthinker', icon: Brain },
  { value: 'procrastinator', label: 'Procrastinator', icon: Clock },
  { value: 'night_scroller', label: 'Night scroller', icon: Moon },
  { value: 'impulse_tapper', label: 'Impulse tapper', icon: Zap },
  { value: 'work_distracter', label: 'Work distracter', icon: Briefcase },
  { value: 'focus_beginner', label: 'Focus beginner', icon: Target },
];

export function UserTypeTag({ onNext }: UserTypeTagProps) {
  const [selectedType, setSelectedType] = useState<UserPersonalityType>('focus_beginner');

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="User type selection"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-lg w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-2 sm:space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Which type describes you?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-medium">
            This helps us adapt your training plan
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {personalityTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.value;
            return (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedType(type.value);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`Select personality type: ${type.label}`}
                className={`p-6 rounded-xl border-2 transition-all duration-300 relative overflow-hidden group focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 focus-visible:outline-none ${
                  isSelected
                    ? 'border-indigo-400 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                    : 'border-gray-800/50 bg-gray-900/50 hover:border-indigo-500/50 hover:bg-gray-900 text-white hover:scale-102'
                }`}
              >
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 animate-pulse" />
                )}
                <Icon className={`w-10 h-10 mx-auto mb-3 relative z-10 ${isSelected ? 'drop-shadow-lg' : ''}`} />
                <div className={`font-semibold text-sm relative z-10 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{type.label}</div>
              </button>
            );
          })}
        </div>

        <Button 
          onClick={() => onNext(selectedType)} 
          size="lg" 
          className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
