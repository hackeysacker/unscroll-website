import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { OnboardingData } from '@/types';

interface HabitGraphProps {
  onboardingData: Partial<OnboardingData>;
  onNext: () => void;
}

interface HabitMetric {
  label: string;
  value: 'high' | 'moderate' | 'low';
  percentage: number;
}

export function HabitGraph({ onboardingData, onNext }: HabitGraphProps) {
  const [showGraph, setShowGraph] = useState(false);

  // Calculate habit metrics from onboarding data
  const getHabitMetrics = (): HabitMetric[] => {
    const metrics: HabitMetric[] = [];

    // Night scrolling intensity based on worst time
    if (onboardingData.worstScrollTime === 'late_night' || onboardingData.worstScrollTime === 'evenings') {
      metrics.push({ label: 'Night scrolling', value: 'high', percentage: 85 });
    } else if (onboardingData.worstScrollTime === 'morning_bed') {
      metrics.push({ label: 'Night scrolling', value: 'low', percentage: 25 });
    } else {
      metrics.push({ label: 'Night scrolling', value: 'moderate', percentage: 50 });
    }

    // App usage based on primary app and hours
    const appLabel = onboardingData.primaryDistractionApp === 'tiktok' ? 'TikTok usage' :
      onboardingData.primaryDistractionApp === 'instagram' ? 'Instagram usage' :
      onboardingData.primaryDistractionApp === 'youtube' ? 'YouTube usage' :
      onboardingData.primaryDistractionApp === 'snapchat' ? 'Snapchat usage' :
      'App usage';

    if ((onboardingData.dailyScrollHours || 0) >= 4) {
      metrics.push({ label: appLabel, value: 'high', percentage: 90 });
    } else if ((onboardingData.dailyScrollHours || 0) >= 2) {
      metrics.push({ label: appLabel, value: 'moderate', percentage: 60 });
    } else {
      metrics.push({ label: appLabel, value: 'low', percentage: 30 });
    }

    // Morning control (inverse of morning scrolling)
    if (onboardingData.worstScrollTime === 'morning_bed') {
      metrics.push({ label: 'Morning control', value: 'low', percentage: 20 });
    } else if (onboardingData.worstScrollTime === 'work_breaks' || onboardingData.worstScrollTime === 'after_school') {
      metrics.push({ label: 'Morning control', value: 'moderate', percentage: 55 });
    } else {
      metrics.push({ label: 'Morning control', value: 'high', percentage: 80 });
    }

    return metrics;
  };

  const metrics = getHabitMetrics();

  useEffect(() => {
    const timer = setTimeout(() => setShowGraph(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getBarColor = (value: 'high' | 'moderate' | 'low') => {
    switch (value) {
      case 'high':
        return 'bg-destructive';
      case 'moderate':
        return 'bg-accent';
      case 'low':
        return 'bg-primary';
    }
  };

  const getValueColor = (value: 'high' | 'moderate' | 'low') => {
    switch (value) {
      case 'high':
        return 'text-destructive';
      case 'moderate':
        return 'text-accent-foreground';
      case 'low':
        return 'text-primary';
    }
  };

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="Habit graph visualization"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-lg w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-2 sm:space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Your Attention Profile
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-medium">
            This is your starting baseline. It will update as you improve.
          </p>
        </div>

        {/* Enhanced bar chart */}
        <div className="space-y-5 sm:space-y-6 p-6 sm:p-8 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm">
          {metrics.map((metric, index) => (
            <div key={metric.label} className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-white text-lg">
                  {metric.label}
                </span>
                <span className={`text-sm font-bold capitalize px-3 py-1 rounded-full ${
                  metric.value === 'high' ? 'bg-red-500/20 text-red-400' :
                  metric.value === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {metric.value}
                </span>
              </div>
              <div className="h-10 bg-gray-800/50 rounded-full overflow-hidden relative shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                    metric.value === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    metric.value === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                    'bg-gradient-to-r from-green-500 to-green-600'
                  }`}
                  style={{
                    width: showGraph ? `${metric.percentage}%` : '0%',
                    transitionDelay: `${index * 200}ms`,
                    boxShadow: showGraph ? `0 0 20px ${metric.value === 'high' ? 'rgba(239, 68, 68, 0.5)' : metric.value === 'moderate' ? 'rgba(234, 179, 8, 0.5)' : 'rgba(34, 197, 94, 0.5)'}` : 'none',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center p-6 rounded-xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-purple-950/30 backdrop-blur-sm">
          <p className="text-base text-white leading-relaxed">
            <strong className="text-indigo-400 font-bold">Good news:</strong> Every metric here can be improved with consistent training.
          </p>
        </div>

        <Button 
          onClick={onNext} 
          size="lg" 
          className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
        >
          Continue
        </Button>
      </div>
    </main>
  );
}
