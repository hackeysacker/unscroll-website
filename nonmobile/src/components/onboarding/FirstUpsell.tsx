import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface FirstUpsellProps {
  onUpgrade: () => void;
  onContinueFree: () => void;
}

const premiumFeatures = [
  'Accurate daily scroll tracking',
  'Real trend graphs and insights',
  'Smart personalized difficulty levels',
  'Unlock 20+ advanced exercises',
  'Detailed progress analytics',
  'No ads, unlimited hearts',
];

export function FirstUpsell({ onUpgrade, onContinueFree }: FirstUpsellProps) {
  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="Premium upsell screen"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-md w-full space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-2 sm:space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Unlock Screen Time Auto-Sync
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-medium">
            Get the full experience with premium features
          </p>
        </div>

        {/* Enhanced features list */}
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 to-purple-950/50 backdrop-blur-sm space-y-3 sm:space-y-4">
          {premiumFeatures.map((feature, index) => (
            <div key={feature} className="flex items-start gap-4 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-indigo-500/50">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-200 font-medium leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        {/* Enhanced pricing */}
        <div className="text-center space-y-3 p-6 rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-purple-950/30 backdrop-blur-sm">
          <div className="text-sm text-gray-400 font-medium">
            Try free for 7 days
          </div>
          <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            $4.99<span className="text-2xl text-gray-400">/month</span>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Cancel anytime
          </div>
        </div>

        {/* Enhanced CTAs */}
        <div className="space-y-3">
          <Button
            onClick={onUpgrade}
            size="lg"
            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold"
          >
            Try Free For 7 Days
          </Button>
          <Button
            onClick={onContinueFree}
            variant="ghost"
            size="lg"
            className="w-full py-6 text-gray-400 hover:text-white hover:bg-gray-900/50 transition-all duration-300"
          >
            Continue Free
          </Button>
        </div>
      </div>
    </main>
  );
}
