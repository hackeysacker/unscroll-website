import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type {
  DistractionApp,
  WorstScrollTime,
  ImprovementReason,
  OnboardingData,
} from '@/types';
import {
  Smartphone,
  Youtube,
  Instagram,
  Clock,
  Target,
  Moon,
  Sun,
  Coffee,
  Sunset,
  Brain,
  Heart,
  Lightbulb,
  TrendingUp,
  Award,
} from 'lucide-react';

interface HabitIntakeProps {
  onNext: (data: Partial<OnboardingData>) => void;
}

type QuestionStep = 1 | 2 | 3 | 4 | 5;

const appOptions: Array<{ value: DistractionApp; label: string; icon: typeof Smartphone }> = [
  { value: 'tiktok', label: 'TikTok', icon: Smartphone },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'snapchat', label: 'Snapchat', icon: Smartphone },
  { value: 'other', label: 'Other', icon: Smartphone },
];

const timeOptions: Array<{ value: WorstScrollTime; label: string; icon: typeof Sun }> = [
  { value: 'morning_bed', label: 'Morning in bed', icon: Sun },
  { value: 'work_breaks', label: 'Work breaks', icon: Coffee },
  { value: 'after_school', label: 'After school', icon: Clock },
  { value: 'evenings', label: 'Evenings', icon: Sunset },
  { value: 'late_night', label: 'Late night before sleep', icon: Moon },
];

const reasonOptions: Array<{ value: ImprovementReason; label: string; icon: typeof Brain }> = [
  { value: 'more_focus', label: 'More focus', icon: Target },
  { value: 'better_sleep', label: 'Better sleep', icon: Moon },
  { value: 'mental_clarity', label: 'Mental clarity', icon: Brain },
  { value: 'productivity', label: 'Productivity', icon: TrendingUp },
  { value: 'discipline', label: 'Discipline', icon: Award },
  { value: 'other', label: 'Other', icon: Lightbulb },
];

export function HabitIntake({ onNext }: HabitIntakeProps) {
  const [currentStep, setCurrentStep] = useState<QuestionStep>(1);
  const [scrollHours, setScrollHours] = useState(3);
  const [primaryApp, setPrimaryApp] = useState<DistractionApp>('instagram');
  const [worstTime, setWorstTime] = useState<WorstScrollTime>('late_night');
  const [reason, setReason] = useState<ImprovementReason>('more_focus');
  const [autoTracking, setAutoTracking] = useState(false);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as QuestionStep);
    } else {
      onNext({
        dailyScrollHours: scrollHours,
        primaryDistractionApp: primaryApp,
        worstScrollTime: worstTime,
        improvementReason: reason,
        wantsAutoTracking: autoTracking,
      });
    }
  };

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="Habit intake questionnaire"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} aria-hidden="true" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" aria-hidden="true" />

      <div className="max-w-lg w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Enhanced progress indicator */}
        <div className="flex gap-2 mb-2 sm:mb-4" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={5} aria-label={`Question ${currentStep} of 5`}>
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50'
                  : 'bg-gray-800/50'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Question 1: Daily scroll hours */}
        {currentStep === 1 && (
          <section className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500" aria-labelledby="question-1-title">
            <div className="space-y-2 sm:space-y-3">
              <h2 id="question-1-title" className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                How many hours a day do you honestly think you scroll?
              </h2>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="text-center py-8 sm:py-10 px-4 sm:px-6 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm" role="status" aria-live="polite">
                <div className="text-6xl sm:text-7xl md:text-8xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg" aria-label={`${scrollHours} ${scrollHours === 1 ? 'hour' : 'hours'}`}>
                  {scrollHours}
                </div>
                <div className="text-xl sm:text-2xl text-gray-300 mt-2 sm:mt-3 font-medium">
                  {scrollHours === 1 ? 'hour' : 'hours'} per day
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Slider
                  value={[scrollHours]}
                  onValueChange={(value) => setScrollHours(value[0])}
                  min={0}
                  max={6}
                  step={0.5}
                  className="w-full"
                  aria-label="Daily scroll hours"
                  aria-valuenow={scrollHours}
                  aria-valuemin={0}
                  aria-valuemax={6}
                />

                <div className="flex justify-between text-sm text-gray-400 font-medium">
                  <span>0h</span>
                  <span>6h</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleNext} 
              size="lg" 
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
            >
              Continue
            </Button>
          </section>
        )}

        {/* Question 2: Primary app */}
        {currentStep === 2 && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              What app steals your time the most?
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {appOptions.map((app) => {
                const Icon = app.icon;
                const isSelected = primaryApp === app.value;
                return (
                  <button
                    key={app.value}
                    onClick={() => setPrimaryApp(app.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setPrimaryApp(app.value);
                      }
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Select ${app.label} as primary distraction app`}
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
                    <div className={`font-semibold relative z-10 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{app.label}</div>
                  </button>
                );
              })}
            </div>

            <Button 
              onClick={handleNext} 
              size="lg" 
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Question 3: Worst time */}
        {currentStep === 3 && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              When is your worst scrolling time?
            </h2>

            <div className="space-y-2 sm:space-y-3">
              {timeOptions.map((time) => {
                const Icon = time.icon;
                const isSelected = worstTime === time.value;
                return (
                  <button
                    key={time.value}
                    onClick={() => setWorstTime(time.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setWorstTime(time.value);
                      }
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Select ${time.label} as worst scrolling time`}
                    className={`w-full p-5 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden group focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 focus-visible:outline-none ${
                      isSelected
                        ? 'border-indigo-400 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-[1.02]'
                        : 'border-gray-800/50 bg-gray-900/50 hover:border-indigo-500/50 hover:bg-gray-900 text-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-600/20" />
                    )}
                    <Icon className={`w-7 h-7 relative z-10 ${isSelected ? 'drop-shadow-lg' : ''}`} />
                    <span className={`font-semibold text-lg relative z-10 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{time.label}</span>
                  </button>
                );
              })}
            </div>

            <Button 
              onClick={handleNext} 
              size="lg" 
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Question 4: Main reason */}
        {currentStep === 4 && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              What is your main reason for wanting to improve?
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {reasonOptions.map((reasonOption) => {
                const Icon = reasonOption.icon;
                const isSelected = reason === reasonOption.value;
                return (
                  <button
                    key={reasonOption.value}
                    onClick={() => setReason(reasonOption.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setReason(reasonOption.value);
                      }
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Select ${reasonOption.label} as improvement reason`}
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
                    <div className={`font-semibold relative z-10 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{reasonOption.label}</div>
                  </button>
                );
              })}
            </div>

            <Button 
              onClick={handleNext} 
              size="lg" 
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Question 5: Auto tracking */}
        {currentStep === 5 && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              Do you want to track screen time automatically?
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div className="p-6 rounded-xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm">
                <p className="text-gray-200 mb-6 leading-relaxed">
                  This feature lets us compare your training progress to your actual scrolling habits and provide personalized recommendations.
                </p>

                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-800/50">
                  <Label htmlFor="auto-tracking" className="text-lg font-semibold cursor-pointer text-white">
                    Enable auto-tracking
                  </Label>
                  <Switch
                    id="auto-tracking"
                    checked={autoTracking}
                    onCheckedChange={setAutoTracking}
                  />
                </div>
              </div>

              <p className="text-sm text-gray-400 text-center font-medium">
                You can change this anytime in settings
              </p>
            </div>

            <Button 
              onClick={handleNext} 
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
