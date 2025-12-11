import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { HeartDisplay } from '@/components/HeartDisplay';
import { Flame, Trophy, Zap, Lock, Crown, Brain, Moon, Sparkles } from 'lucide-react';
import { XP_PER_LEVEL, getUserLevelBracket } from '@/lib/game-mechanics';
interface DashboardProps {
  onNavigate: (route: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { progress, todaySession, initializeProgress, heartState } = useGame();
  const { user } = useAuth();

  // If user exists but no progress, initialize with level 1
  if (user && !progress) {
    initializeProgress(1);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="text-xl font-semibold text-gray-900 dark:text-white">Setting up your dashboard...</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Initializing your progress</div>
        </div>
      </div>
    );
  }

  if (!progress || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="text-xl font-semibold text-gray-900 dark:text-white">Loading...</div>
        </div>
      </div>
    );
  }

  const levelBracket = getUserLevelBracket(progress.level);
  const xpProgress = (progress.xp / XP_PER_LEVEL) * 100;
  const sessionComplete = todaySession?.completed ?? false;
  const challengesCompleted = todaySession?.challenges.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 px-4 py-6 sm:py-8 md:py-10 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] dark:opacity-20 opacity-10" />
      
      {/* Ambient gradient orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse opacity-40" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '1s' }} />

      <div className="max-w-4xl mx-auto space-y-6 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            FocusFlow
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium">
            Welcome back! Ready to train your attention?
          </p>
          {/* Hearts Display */}
          {heartState && (
            <div className="flex justify-center mt-4">
              <HeartDisplay heartState={heartState} isPremium={user.isPremium} showTimer={true} size="lg" />
            </div>
          )}
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Card className="border-2 border-orange-200 dark:border-orange-800/50 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50">
                  <Flame className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {progress.streak}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    Level {progress.level}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 capitalize font-medium">
                    {levelBracket}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {progress.xp} XP
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {XP_PER_LEVEL - progress.xp} to next level
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Level Progress */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-800/50 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Level Progress</CardTitle>
            <CardDescription className="text-base font-medium">
              {progress.xp} / {XP_PER_LEVEL} XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Progress value={xpProgress} className="h-4 shadow-inner" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{Math.round(xpProgress)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Progress Tree Access */}
        <Card className="border-2 border-indigo-500/50 dark:border-indigo-500/30 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  Progress Path
                </CardTitle>
                <CardDescription className="text-base font-medium mt-1">Continue your learning journey</CardDescription>
              </div>
              {sessionComplete && (
                <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg shadow-green-500/50 px-3 py-1">
                  ✓ Daily Goal Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                    i < challengesCompleted
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/50'
                      : 'bg-gray-200 dark:bg-gray-700/50'
                  }`}
                />
              ))}
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {challengesCompleted} / 3 challenges completed today
            </p>

            <Button
              onClick={() => onNavigate('progress-tree')}
              className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105 font-semibold focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
              size="lg"
              aria-label={sessionComplete ? 'View your progress tree' : 'Continue your training session'}
            >
              {sessionComplete ? 'View Progress Tree' : 'Continue Training'}
              <Zap className="w-5 h-5 ml-2" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 border-2 border-purple-200 dark:border-purple-800/50 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-950/50 dark:hover:to-indigo-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus-visible:ring-4 focus-visible:ring-purple-400 focus-visible:ring-offset-2"
            onClick={() => onNavigate('skill-tree')}
            aria-label="View skill tree"
          >
            <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <span className="text-xs font-semibold">Skill Tree</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2 border-2 border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-950/50 dark:hover:to-cyan-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus-visible:ring-4 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
            onClick={() => onNavigate('insights')}
            aria-label="View insights"
          >
            <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span className="text-xs font-semibold">Insights</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2 border-2 border-gray-200 dark:border-gray-800/50 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-950/50 dark:hover:to-slate-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus-visible:ring-4 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            onClick={() => onNavigate('settings')}
            aria-label="Open settings"
          >
            <Lock className="w-6 h-6 text-gray-600 dark:text-gray-400" aria-hidden="true" />
            <span className="text-xs font-semibold">Settings</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex-col gap-2 border-2 border-yellow-300 dark:border-yellow-700/50 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 hover:from-yellow-100 hover:to-amber-100 dark:hover:from-yellow-950/50 dark:hover:to-amber-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
            onClick={() => onNavigate('premium')}
            aria-label="View premium features"
          >
            <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
            <span className="text-xs font-semibold">Premium</span>
          </Button>
        </div>

        {/* Enhanced Premium Features - Only show if user is premium */}
        {user.isPremium && (
          <Card className="border-2 border-purple-500/50 dark:border-purple-500/30 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-950/40 dark:via-indigo-950/40 dark:to-pink-950/40 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Premium Features</CardTitle>
                  <CardDescription className="text-base font-medium mt-1">
                    Unlock your full potential with AI-powered training and advanced tools
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-28 flex-col gap-3 border-2 border-purple-300 dark:border-purple-700/50 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 hover:from-purple-100 hover:to-indigo-100 dark:hover:from-purple-950/50 dark:hover:to-indigo-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => onNavigate('training-plan')}
                >
                  <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  <div className="text-center">
                    <div className="font-bold text-sm">AI Training Plan</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Personalized coach
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-28 flex-col gap-3 border-2 border-indigo-300 dark:border-indigo-700/50 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-950/50 dark:hover:to-blue-950/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => onNavigate('wind-down')}
                >
                  <Moon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                  <div className="text-center">
                    <div className="font-bold text-sm">Wind-Down Mode</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Sleep & calm
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Premium Upsell Banner */}
        {!user.isPremium && (
          <Card className="border-2 border-yellow-400/50 dark:border-yellow-600/50 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/40 dark:via-amber-950/40 dark:to-orange-950/40 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/50">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      Upgrade to Premium
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                      Unlock extra challenges and advanced insights
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => onNavigate('premium')}
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white shadow-lg shadow-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/60 transition-all duration-300 hover:scale-105 font-semibold px-6 focus-visible:ring-4 focus-visible:ring-yellow-400 focus-visible:ring-offset-2"
                  aria-label="Upgrade to premium"
                >
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
