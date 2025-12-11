import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Clock, Eye, Target, Zap, Flame, TrendingUp, Brain, Shield, Crown, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DeepAnalytics, ChallengeResult } from '@/types';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '@/lib/storage';
import { calculateDeepAnalytics } from '@/lib/analytics';

// Component to display recent exercise history
function RecentExerciseHistory({ userId }: { userId: string }) {
  const [recentExercises, setRecentExercises] = useState<ChallengeResult[]>([]);

  useEffect(() => {
    const allResults = loadFromStorage<ChallengeResult[]>(STORAGE_KEYS.CHALLENGE_RESULTS) || [];
    const userResults = allResults
      .filter(r => r.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
    setRecentExercises(userResults);
  }, [userId]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatChallengeName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (recentExercises.length === 0) {
    return (
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
        No exercises completed yet. Start training to see your history!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {recentExercises.map((exercise) => {
        const isPassed = exercise.score >= 80;
        const isPerfect = exercise.isPerfect;

        return (
          <div
            key={exercise.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              {isPerfect ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : isPassed ? (
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {formatChallengeName(exercise.type)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formatTimestamp(exercise.timestamp)} • {formatTime(exercise.duration)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge
                variant={isPerfect ? 'default' : isPassed ? 'secondary' : 'destructive'}
                className="min-w-[60px] justify-center"
              >
                {Math.round(exercise.score)}%
              </Badge>
              <div className="text-right min-w-[50px]">
                <p className="text-xs text-gray-600 dark:text-gray-400">XP</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  +{exercise.xpEarned}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface InsightsProps {
  onBack: () => void;
}

export function Insights({ onBack }: InsightsProps) {
  const { stats, progress, skillTree } = useGame();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DeepAnalytics | null>(null);

  useEffect(() => {
    if (!user || !skillTree) return;

    // Load or calculate deep analytics for premium users
    if (user.isPremium) {
      const savedAnalytics = loadFromStorage<DeepAnalytics>(STORAGE_KEYS.DEEP_ANALYTICS);

      // Recalculate if older than 1 hour or different user
      const needsRecalculation = !savedAnalytics ||
        savedAnalytics.userId !== user.id ||
        Date.now() - savedAnalytics.lastCalculated > 60 * 60 * 1000;

      if (needsRecalculation) {
        const challengeResults = loadFromStorage<ChallengeResult[]>(STORAGE_KEYS.CHALLENGE_RESULTS) || [];
        const newAnalytics = calculateDeepAnalytics(user.id, challengeResults, skillTree);
        setAnalytics(newAnalytics);
        saveToStorage(STORAGE_KEYS.DEEP_ANALYTICS, newAnalytics);
      } else {
        setAnalytics(savedAnalytics);
      }
    }
  }, [user, skillTree]);

  if (!stats || !progress) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const insights = [
    {
      label: 'Total Attention Time',
      value: formatTime(stats.totalAttentionTime),
      icon: Clock,
      color: 'blue',
    },
    {
      label: 'Longest Gaze Hold',
      value: formatTime(stats.longestGazeHold),
      icon: Eye,
      color: 'purple',
    },
    {
      label: 'Streak Record',
      value: `${progress.longestStreak} days`,
      icon: Flame,
      color: 'orange',
    },
    {
      label: 'Focus Accuracy',
      value: `${Math.floor(stats.focusAccuracy)}%`,
      icon: Target,
      color: 'green',
    },
    {
      label: 'Impulse Control',
      value: `${Math.floor(stats.impulseControlScore)}%`,
      icon: Zap,
      color: 'indigo',
    },
    {
      label: 'Total Sessions',
      value: progress.totalSessionsCompleted.toString(),
      icon: Target,
      color: 'pink',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Insights</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your attention training progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => {
            const Icon = insight.icon;
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
              purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
              orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
              green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
              indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400',
              pink: 'bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400',
            }[insight.color];

            return (
              <Card key={insight.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {insight.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {insight.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Your overall training statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Total Challenges:</span>
                <span className="font-semibold">{progress.totalChallengesCompleted}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Current XP:</span>
                <span className="font-semibold">{progress.xp} XP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Total XP Earned:</span>
                <span className="font-semibold">{progress.totalXp} XP</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Current Level:</span>
                <span className="font-semibold">Level {progress.level}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Exercise History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Exercises</CardTitle>
            <CardDescription>Your last 10 completed exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentExerciseHistory userId={user?.id || ''} />
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Tip:</strong> Maintain your streak to maximize XP gains! After 4 days, you'll
              earn a streak multiplier on all challenges.
            </p>
          </CardContent>
        </Card>

        {/* Premium Deep Analytics */}
        {user?.isPremium && analytics && (
          <>
            <Card className="border-yellow-300 dark:border-yellow-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    Premium Deep Analytics
                  </CardTitle>
                  <Badge className="bg-yellow-400 text-yellow-900">Premium</Badge>
                </div>
                <CardDescription>
                  Advanced performance metrics and trend analysis
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Core Skill Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Attention Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-4xl font-bold text-purple-600">
                    {analytics.attentionScore}
                    <span className="text-lg text-gray-600 dark:text-gray-400">/100</span>
                  </div>
                  <Progress value={analytics.attentionScore} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {analytics.attentionScore >= 80 ? 'Excellent focus!' :
                     analytics.attentionScore >= 60 ? 'Good progress' :
                     'Keep training!'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-600" />
                    Impulse Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-4xl font-bold text-indigo-600">
                    {analytics.impulseControlScore}
                    <span className="text-lg text-gray-600 dark:text-gray-400">/100</span>
                  </div>
                  <Progress value={analytics.impulseControlScore} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {analytics.impulseControlScore >= 80 ? 'Strong self-control!' :
                     analytics.impulseControlScore >= 60 ? 'Improving steadily' :
                     'Building discipline'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Distraction Resistance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-4xl font-bold text-green-600">
                    {analytics.distractionResistanceScore}
                    <span className="text-lg text-gray-600 dark:text-gray-400">/100</span>
                  </div>
                  <Progress value={analytics.distractionResistanceScore} className="h-2" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {analytics.distractionResistanceScore >= 80 ? 'Highly resilient!' :
                     analytics.distractionResistanceScore >= 60 ? 'Good resistance' :
                     'Growing stronger'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Weekly Performance Trend
                </CardTitle>
                <CardDescription>Your average scores over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-2">
                  {analytics.weeklyProgress.map((point, index) => {
                    const height = point.value > 0 ? `${point.value}%` : '8px';
                    const date = new Date(point.timestamp);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t transition-all hover:opacity-80"
                          style={{ height }}
                          title={`${dayName}: ${Math.round(point.value)}%`}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {dayName}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Monthly Progress (4 Weeks)
                </CardTitle>
                <CardDescription>Your performance trends over the last month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-end justify-between gap-4">
                  {analytics.monthlyProgress.map((point, index) => {
                    const height = point.value > 0 ? `${point.value}%` : '8px';
                    const weekLabel = `Week ${index + 1}`;

                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t transition-all hover:opacity-80"
                          style={{ height }}
                          title={`${weekLabel}: ${Math.round(point.value)}%`}
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {weekLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle>AI Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>🎯 Strongest Skill:</strong>{' '}
                  {analytics.attentionScore >= analytics.impulseControlScore && analytics.attentionScore >= analytics.distractionResistanceScore
                    ? 'Attention & Focus - Your concentration abilities are exceptional!'
                    : analytics.impulseControlScore >= analytics.distractionResistanceScore
                    ? 'Impulse Control - You have excellent self-regulation!'
                    : 'Distraction Resistance - You excel at maintaining focus in challenging environments!'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>💪 Growth Opportunity:</strong>{' '}
                  {analytics.attentionScore <= analytics.impulseControlScore && analytics.attentionScore <= analytics.distractionResistanceScore
                    ? 'Focus on sustained attention exercises to balance your skills.'
                    : analytics.impulseControlScore <= analytics.distractionResistanceScore
                    ? 'Practice impulse delay challenges to improve self-control.'
                    : 'Work on distraction resistance to strengthen environmental focus.'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>📈 Trend Analysis:</strong>{' '}
                  {analytics.weeklyProgress.slice(-3).every((p, i, arr) => i === 0 || p.value >= arr[i - 1].value)
                    ? 'Your scores are trending upward! Excellent consistency.'
                    : analytics.weeklyProgress.slice(-3).some(p => p.value > 0)
                    ? 'Your performance shows variation. Focus on daily consistency for better results.'
                    : 'Complete more challenges to generate trend insights.'}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
