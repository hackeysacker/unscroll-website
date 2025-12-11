import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Smartphone, CalendarCheck } from 'lucide-react';

interface PermissionRequestsProps {
  onComplete: (permissions: {
    notifications: boolean;
    screenTime: boolean;
    dailyCheckIn: boolean;
  }) => void;
}

type PermissionStep = 'notifications' | 'screenTime' | 'dailyCheckIn';

export function PermissionRequests({ onComplete }: PermissionRequestsProps) {
  const [currentStep, setCurrentStep] = useState<PermissionStep>('notifications');
  const [permissions, setPermissions] = useState({
    notifications: false,
    screenTime: false,
    dailyCheckIn: false,
  });

  const handleAllow = () => {
    const newPermissions = { ...permissions };

    if (currentStep === 'notifications') {
      newPermissions.notifications = true;
      setPermissions(newPermissions);
      setCurrentStep('screenTime');
    } else if (currentStep === 'screenTime') {
      newPermissions.screenTime = true;
      setPermissions(newPermissions);
      setCurrentStep('dailyCheckIn');
    } else {
      newPermissions.dailyCheckIn = true;
      onComplete(newPermissions);
    }
  };

  const handleSkip = () => {
    if (currentStep === 'notifications') {
      setCurrentStep('screenTime');
    } else if (currentStep === 'screenTime') {
      setCurrentStep('dailyCheckIn');
    } else {
      onComplete(permissions);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'notifications':
        return {
          icon: Bell,
          title: 'Enable Notifications',
          description: 'We remind you gently when your brain needs a break.',
          detail: 'Get helpful reminders to train daily and track your progress.',
        };
      case 'screenTime':
        return {
          icon: Smartphone,
          title: 'Allow Screen Time Tracking',
          description: 'This lets us compare your training to your actual scrolling.',
          detail: 'See real data on how your habits improve over time.',
        };
      case 'dailyCheckIn':
        return {
          icon: CalendarCheck,
          title: 'Daily Check-In',
          description: 'Quick 5 second mood and focus check every day.',
          detail: 'Help us personalize your experience and track your progress.',
        };
    }
  };

  const content = getStepContent();
  const Icon = content.icon;

  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="Permission requests"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        {/* Enhanced progress dots */}
        <div className="flex justify-center gap-2 mb-2 sm:mb-4">
          <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
            currentStep === 'notifications' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50' : 'bg-gray-800/50'
          }`} />
          <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
            currentStep === 'screenTime' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50' : 'bg-gray-800/50'
          }`} />
          <div className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
            currentStep === 'dailyCheckIn' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50' : 'bg-gray-800/50'
          }`} />
        </div>

        {/* Enhanced animated permission card */}
        <div className="text-center space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 w-28 h-28 rounded-full bg-indigo-500/20 blur-xl animate-pulse" />
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-lg" />
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {content.title}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 font-medium">
              {content.description}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm">
            <p className="text-sm text-gray-200 leading-relaxed">
              {content.detail}
            </p>
          </div>
        </div>

        {/* Enhanced CTAs */}
        <div className="space-y-3">
          <Button 
            onClick={handleAllow} 
            size="lg" 
            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            aria-label={`Allow ${content.title.toLowerCase()}`}
          >
            Allow
          </Button>
          <Button
            onClick={handleSkip}
            variant="ghost"
            size="lg"
            className="w-full py-6 text-gray-400 hover:text-white hover:bg-gray-900/50 transition-all duration-300 focus-visible:ring-4 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
            aria-label={`Skip ${content.title.toLowerCase()}`}
          >
            Not Now
          </Button>
        </div>
      </div>
    </main>
  );
}
