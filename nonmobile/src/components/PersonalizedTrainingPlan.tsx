import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Brain, Flame, Target, TrendingUp, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { PersonalizedTrainingPlan, TrainingPlanRecommendation, ChallengeType, SkillPath } from '@/types';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '@/lib/storage';

interface PersonalizedTrainingPlanProps {
  onBack: () => void;
  onStartChallenge?: (challengeType: ChallengeType) => void;
}

export function PersonalizedTrainingPlanComponent({ onBack, onStartChallenge }: PersonalizedTrainingPlanProps) {
  const { user } = useAuth();
  const { progress, skillTree, stats } = useGame();
  const [plan, setPlan] = useState<PersonalizedTrainingPlan | null>(null);

  useEffect(() => {
    if (!user || !progress || !skillTree || !stats) return;

    // Load or generate personalized training plan
    const savedPlan = loadFromStorage<PersonalizedTrainingPlan>(STORAGE_KEYS.TRAINING_PLAN);

    // Check if plan needs regeneration (older than 24 hours or different user)
    const needsRegeneration = !savedPlan ||
      savedPlan.userId !== user.id ||
      Date.now() - savedPlan.lastUpdated > 24 * 60 * 60 * 1000;

    if (needsRegeneration) {
      const newPlan = generateTrainingPlan(user.id, progress, skillTree, stats);
      setPlan(newPlan);
      saveToStorage(STORAGE_KEYS.TRAINING_PLAN, newPlan);
    } else {
      setPlan(savedPlan);
    }
  }, [user, progress, skillTree, stats]);

  if (!plan || !progress || !skillTree) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">Loading your personalized plan...</div>
      </div>
    );
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  };

  const challengeNames: Record<ChallengeType, string> = {
    // New MVP exercises
    focus_hold: 'Focus Hold',
    finger_hold: 'Finger Hold',
    slow_tracking: 'Slow Tracking',
    tap_only_correct: 'Tap Only Correct',
    breath_pacing: 'Breath Pacing',
    fake_notifications: 'Fake Notifications',
    look_away: 'Look Away',
    delay_unlock: 'Delay Unlock',
    anti_scroll_swipe: 'Anti-Scroll Swipe',
    memory_flash: 'Memory Flash',
    reaction_inhibition: 'Reaction Inhibition',
    multi_object_tracking: 'Multi-Object Tracking',
    rhythm_tap: 'Rhythm Tap',
    stillness_test: 'Stillness Test',
    impulse_spike_test: 'Impulse Spike Test',
    finger_tracing: 'Finger Tracing',
    multi_task_tap: 'Multi-Task Tap',
    popup_ignore: 'Pop-Up Ignore',
    controlled_breathing: 'Controlled Breathing',
    reset: 'Level Reset',
    // Legacy exercises
    gaze_hold: 'Gaze Hold',
    moving_target: 'Moving Target',
    tap_pattern: 'Tap Pattern',
    stability_hold: 'Stability Hold',
    impulse_delay: 'Impulse Delay',
    distraction_resistance: 'Distraction Resistance',
    audio_focus: 'Audio Focus',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Your Personalized Training Plan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-powered recommendations based on your performance, weaknesses, and goals
          </p>
        </div>

        {/* Streak Bonus Banner */}
        {plan.streakBonus && (
          <Card className="border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Flame className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {progress.streak} Day Streak! 🔥
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Your consistency is amazing! Keep it up for maximum retention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Focus Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Areas to Improve
            </CardTitle>
            <CardDescription>
              Based on your recent performance, focus on these skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {plan.focusAreas.map((area) => (
                <Badge key={area} variant="outline" className="px-4 py-2">
                  {area === 'focus' && '🎯 Focus'}
                  {area === 'impulseControl' && '⚡ Impulse Control'}
                  {area === 'distractionResistance' && '🛡️ Distraction Resistance'}
                </Badge>
              ))}
              {plan.focusAreas.length === 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Great work! All skills are balanced. Keep training to maintain mastery.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Today's Recommended Challenges
            </CardTitle>
            <CardDescription>
              Personalized for maximum improvement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {plan.recommendations.map((rec, index) => (
              <div
                key={rec.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {challengeNames[rec.challengeType]}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                  <Badge className={priorityColors[rec.priority]}>
                    {rec.priority === 'high' && '🔴 High Priority'}
                    {rec.priority === 'medium' && '🟡 Medium Priority'}
                    {rec.priority === 'low' && '🔵 Maintenance'}
                  </Badge>
                </div>
                {onStartChallenge && (
                  <Button
                    onClick={() => onStartChallenge(rec.challengeType)}
                    variant={rec.priority === 'high' ? 'default' : 'outline'}
                  >
                    Start
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Coach Insights */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Coach's Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>💡 Performance Analysis:</strong>{' '}
              {getPerformanceInsight(skillTree, progress)}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>🎯 Next Milestone:</strong>{' '}
              {getNextMilestone(progress)}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>⏰ Best Time to Train:</strong>{' '}
              Morning sessions (8-10 AM) show highest focus retention. Try to maintain consistency!
            </p>
          </CardContent>
        </Card>

        {/* Regenerate Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => {
              if (user && progress && skillTree && stats) {
                const newPlan = generateTrainingPlan(user.id, progress, skillTree, stats);
                setPlan(newPlan);
                saveToStorage(STORAGE_KEYS.TRAINING_PLAN, newPlan);
              }
            }}
          >
            Regenerate Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to generate training plan based on user data
function generateTrainingPlan(
  userId: string,
  progress: { level: number; streak: number; totalChallengesCompleted: number },
  skillTree: { focus: number; impulseControl: number; distractionResistance: number },
  stats: { focusAccuracy: number; impulseControlScore: number }
): PersonalizedTrainingPlan {
  const recommendations: TrainingPlanRecommendation[] = [];
  const focusAreas: SkillPath[] = [];

  // Identify weak areas
  const skills = [
    { path: 'focus' as SkillPath, value: skillTree.focus },
    { path: 'impulseControl' as SkillPath, value: skillTree.impulseControl },
    { path: 'distractionResistance' as SkillPath, value: skillTree.distractionResistance },
  ];

  const sortedSkills = skills.sort((a, b) => a.value - b.value);

  // Add weakest skills to focus areas
  if (sortedSkills[0].value < 70) focusAreas.push(sortedSkills[0].path);
  if (sortedSkills[1].value < 60) focusAreas.push(sortedSkills[1].path);

  // Generate recommendations based on weak areas
  if (skillTree.focus < 70) {
    recommendations.push({
      id: crypto.randomUUID(),
      challengeType: 'gaze_hold',
      reason: 'Build foundational focus with sustained attention exercises',
      priority: skillTree.focus < 50 ? 'high' : 'medium',
    });
    recommendations.push({
      id: crypto.randomUUID(),
      challengeType: 'moving_target',
      reason: 'Improve dynamic focus tracking abilities',
      priority: 'medium',
    });
  }

  if (skillTree.impulseControl < 70) {
    recommendations.push({
      id: crypto.randomUUID(),
      challengeType: 'impulse_delay',
      reason: 'Strengthen impulse control and delayed gratification',
      priority: skillTree.impulseControl < 50 ? 'high' : 'medium',
    });
    recommendations.push({
      id: crypto.randomUUID(),
      challengeType: 'tap_pattern',
      reason: 'Train precise control over reactive responses',
      priority: 'medium',
    });
  }

  if (skillTree.distractionResistance < 70) {
    recommendations.push({
      id: crypto.randomUUID(),
      challengeType: 'distraction_resistance',
      reason: 'Build resilience against environmental distractions',
      priority: skillTree.distractionResistance < 50 ? 'high' : 'medium',
    });
    recommendations.push({
      id: crypto.randomUUID(),
      challengeType: 'audio_focus',
      reason: 'Enhance selective attention in noisy environments',
      priority: 'medium',
    });
  }

  // Add maintenance challenges for strong areas
  if (skillTree.focus >= 70 && recommendations.length < 5) {
    recommendations.push({
      id: crypto.randomUUID(),
      challengeType: 'stability_hold',
      reason: 'Maintain your excellent focus skills',
      priority: 'low',
    });
  }

  if (recommendations.length < 3) {
    recommendations.push({
      id: crypto.randomUUID(),
      challengeType: 'breath_pacing',
      reason: 'Balance all skills with mindful breathing practice',
      priority: 'low',
    });
  }

  // Limit to top 5 recommendations
  const topRecommendations = recommendations.slice(0, 5);

  return {
    userId,
    generatedAt: Date.now(),
    recommendations: topRecommendations,
    focusAreas,
    streakBonus: progress.streak >= 3,
    lastUpdated: Date.now(),
  };
}

function getPerformanceInsight(
  skillTree: { focus: number; impulseControl: number; distractionResistance: number },
  progress: { level: number; totalChallengesCompleted: number }
): string {
  const avgSkill = (skillTree.focus + skillTree.impulseControl + skillTree.distractionResistance) / 3;

  if (avgSkill >= 80) {
    return "You're performing exceptionally well! Your skills are well-balanced. Consider increasing difficulty for optimal growth.";
  } else if (avgSkill >= 60) {
    return "Solid progress! Focus on your weakest areas to achieve balanced mastery across all skills.";
  } else if (avgSkill >= 40) {
    return "You're building momentum! Consistency is key. Complete daily sessions to see rapid improvement.";
  } else {
    return "You're just getting started! Stay consistent with the recommended challenges to build strong foundations.";
  }
}

function getNextMilestone(progress: { level: number; streak: number }): string {
  if (progress.streak < 7) {
    return `Reach a 7-day streak (currently ${progress.streak} days) to unlock streak multiplier bonus!`;
  } else if (progress.level < 10) {
    return `Reach Level 10 to unlock intermediate challenges and advanced analytics!`;
  } else if (progress.level < 20) {
    return `Reach Level 20 to unlock expert mode and custom training paths!`;
  } else {
    return `Reach Level 30 to complete your mastery journey and unlock all achievements!`;
  }
}
