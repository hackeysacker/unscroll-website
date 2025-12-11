import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface FinalConfirmationProps {
  onComplete: () => void;
}

export function FinalConfirmation({ onComplete }: FinalConfirmationProps) {
  return (
    <main 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-indigo-950 to-purple-950 px-4 py-6 sm:py-8 md:py-12 overflow-hidden relative"
      role="main"
      aria-label="Final confirmation"
    >
      {/* Enhanced ambient gradient orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDelay: '1s' }} />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="max-w-md w-full space-y-6 sm:space-y-8 text-center relative z-10">
        {/* Enhanced success icon */}
        <div className="flex justify-center animate-in zoom-in duration-700 mb-4 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-0 w-28 h-28 rounded-full bg-green-500/30 blur-2xl animate-pulse" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/60">
              <Check className="w-12 h-12 sm:w-14 sm:h-14 text-white drop-shadow-lg" />
            </div>
          </div>
        </div>

        {/* Enhanced main message */}
        <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            You are all set
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 font-medium">
            Let's start building real focus
          </p>
        </div>

        {/* Enhanced what's next */}
        <div className="p-6 rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-950/50 to-emerald-950/50 backdrop-blur-sm space-y-4 text-left">
          <div className="font-semibold text-lg text-white text-center mb-4">
            What happens next:
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-green-500/50">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <div className="text-sm text-gray-200 leading-relaxed">
                Complete your first exercise to unlock your daily streak
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-green-500/50">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <div className="text-sm text-gray-200 leading-relaxed">
                Train for just a few minutes each day
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-green-500/50">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <div className="text-sm text-gray-200 leading-relaxed">
                Watch your attention improve over 21 days
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <Button
          onClick={onComplete}
          size="lg"
          className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 transition-all duration-300 hover:scale-105 font-semibold"
        >
          Begin Level 1
        </Button>
      </div>
    </main>
  );
}
