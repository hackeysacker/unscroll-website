import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Crown, Check, Zap, BarChart, Sparkles, Lock, Brain, Moon, Palette, Heart } from 'lucide-react';

interface PremiumProps {
  onBack: () => void;
}

export function Premium({ onBack }: PremiumProps) {
  const { user, upgradeToPremium } = useAuth();

  if (!user) return null;

  const features = [
    {
      icon: Heart,
      title: 'Unlimited Hearts',
      description: 'Train anytime, without limits. Never run out of hearts and maintain your focus momentum.',
      highlighted: true,
    },
    {
      icon: Brain,
      title: 'Personalized Training Plan',
      description: 'AI-powered coach that adapts to your performance, weaknesses, and goals',
    },
    {
      icon: BarChart,
      title: 'Deep Analytics',
      description: 'Attention score, impulse control charts, and weekly/monthly progress visuals',
    },
    {
      icon: Moon,
      title: 'Wind-Down Mode',
      description: 'Guided breathing exercises for sleep and relaxation',
    },
    {
      icon: Palette,
      title: 'Custom Aesthetic Themes',
      description: 'Unlock 4 beautiful themes: minimal light, deep calm dark, vintage ink, and clean white studio',
    },
    {
      icon: Sparkles,
      title: 'Premium Features',
      description: 'Access all current and future premium features',
    },
  ];

  const handleUpgrade = () => {
    upgradeToPremium();
    // In a real app, this would integrate with a payment provider
    alert('Premium upgrade successful! (Demo mode - no payment processed)');
    onBack();
  };

  if (user.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto space-y-6 py-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="border-yellow-300 dark:border-yellow-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <CardTitle>You're a Premium Member!</CardTitle>
                  <CardDescription>Enjoying all premium features</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Thank you for supporting FocusFlow! You have access to all premium features.
                </p>

                <div className="space-y-2">
                  {features.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div key={feature.title} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {feature.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Unlock advanced features and accelerate your focus training
          </p>
        </div>

        {/* Pricing Card */}
        <Card className="border-2 border-yellow-400 dark:border-yellow-600 shadow-xl">
          <CardHeader className="text-center">
            <Badge className="mx-auto bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
              Limited Time Offer
            </Badge>
            <CardTitle className="text-3xl mt-4">$9.99/month</CardTitle>
            <CardDescription>or $99/year (save 17%)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isHighlighted = 'highlighted' in feature && feature.highlighted;
                return (
                  <div
                    key={feature.title}
                    className={`flex items-start gap-3 ${
                      isHighlighted
                        ? 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 p-3 rounded-lg border-2 border-rose-300 dark:border-rose-700'
                        : ''
                    }`}
                  >
                    <div className={`w-10 h-10 ${isHighlighted ? 'bg-rose-100 dark:bg-rose-900' : 'bg-yellow-100 dark:bg-yellow-900'} rounded-lg flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${isHighlighted ? 'text-rose-600 dark:text-rose-400' : 'text-yellow-600 dark:text-yellow-400'}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {feature.title}
                        {isHighlighted && (
                          <Badge className="bg-rose-500 hover:bg-rose-600 text-white text-xs">Most Popular</Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              size="lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Now
            </Button>

            <p className="text-xs text-center text-gray-600 dark:text-gray-400">
              Cancel anytime • 30-day money-back guarantee
            </p>
          </CardContent>
        </Card>

        {/* Free vs Premium Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Free vs Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold mb-2">Free</p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>✓ 5 hearts per day</li>
                    <li>✓ 1 daily session (3 challenges)</li>
                    <li>✓ Basic challenges</li>
                    <li>✓ Level progression</li>
                    <li>✓ Streak tracking</li>
                    <li>✓ Basic insights</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2 text-yellow-700 dark:text-yellow-400">
                    Premium
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li className="font-semibold text-rose-600 dark:text-rose-400">✓ Unlimited hearts</li>
                    <li>✓ AI Training Plan</li>
                    <li>✓ Deep Analytics</li>
                    <li>✓ Wind-Down Mode</li>
                    <li>✓ 4 Custom Themes</li>
                    <li>✓ All Future Features</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Note:</strong> The free version remains fully functional with core training
              features. Premium unlocks additional tools to accelerate your progress.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
