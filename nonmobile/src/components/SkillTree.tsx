import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/contexts/GameContext';
import {
  ArrowLeft,
  Focus,
  Shield,
  Eye,
  Target,
  Brain,
  Zap,
  Trophy,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';

interface SkillTreeProps {
  onBack: () => void;
}

// Level theme descriptions and metadata
const LEVEL_THEMES = {
  1: {
    name: 'Foundation',
    theme: 'Building Blocks',
    color: 'from-blue-400 to-cyan-500',
    description: 'Master the basics of focus and calm',
    icon: '🌱',
    skills: ['Basic Focus', 'Breath Control', 'Steadiness'],
  },
  2: {
    name: 'Stability',
    theme: 'Rock Solid',
    color: 'from-emerald-400 to-green-500',
    description: 'Develop unwavering steadiness and precision',
    icon: '🪨',
    skills: ['Advanced Steadiness', 'Precision Control', 'Motor Mastery'],
  },
  3: {
    name: 'Tracking',
    theme: 'Eagle Eye',
    color: 'from-amber-400 to-orange-500',
    description: 'Dynamic movement and attention switching',
    icon: '🦅',
    skills: ['Dynamic Focus', 'Movement Tracking', 'Attention Switching'],
  },
  4: {
    name: 'Memory & Patterns',
    theme: 'Mental Vault',
    color: 'from-purple-400 to-violet-500',
    description: 'Cognitive load and pattern recall',
    icon: '🧠',
    skills: ['Pattern Recognition', 'Working Memory', 'Cognitive Load'],
  },
  5: {
    name: 'Impulse Control',
    theme: 'Inner Discipline',
    color: 'from-rose-400 to-pink-500',
    description: 'Delayed gratification and patience',
    icon: '⏳',
    skills: ['Patience', 'Self-Regulation', 'Impulse Mastery'],
  },
  6: {
    name: 'Distraction Resistance',
    theme: 'Mental Fortress',
    color: 'from-indigo-400 to-blue-500',
    description: 'Filter out noise and maintain focus',
    icon: '🛡️',
    skills: ['Noise Filtering', 'Focus Defense', 'Distraction Immunity'],
  },
  7: {
    name: 'Audio Focus',
    theme: 'Sonic Awareness',
    color: 'from-teal-400 to-cyan-500',
    description: 'Selective listening and auditory attention',
    icon: '🎧',
    skills: ['Auditory Selection', 'Sound Tracking', 'Listening Mastery'],
  },
  8: {
    name: 'Breath Control',
    theme: 'Zen Master',
    color: 'from-sky-400 to-blue-400',
    description: 'Advanced breathing techniques and rhythm',
    icon: '🌬️',
    skills: ['Breath Mastery', 'Rhythm Control', 'Calm Under Pressure'],
  },
  9: {
    name: 'Integration',
    theme: 'Skill Synthesis',
    color: 'from-fuchsia-400 to-purple-500',
    description: 'Mix all skills with rapid switching',
    icon: '⚡',
    skills: ['Rapid Switching', 'Multi-Tasking', 'Skill Integration'],
  },
  10: {
    name: 'Mastery',
    theme: 'Ultimate Flow',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    description: 'Ultimate challenge with all skills at peak',
    icon: '👑',
    skills: ['Peak Performance', 'Flow State', 'Complete Mastery'],
  },
};

export function SkillTree({ onBack }: SkillTreeProps) {
  const { skillTree, progressTree } = useGame();

  if (!skillTree || !progressTree) return null;

  // Calculate level-based stats
  const getLevelStats = (levelNum: number) => {
    const levelNodes = progressTree.nodes.filter(n => n.level === levelNum);
    const exercises = levelNodes.filter(n => n.nodeType === 'exercise');
    const completed = exercises.filter(n => n.status === 'completed' || n.status === 'perfect').length;
    const perfect = exercises.filter(n => n.status === 'perfect').length;
    const test = levelNodes.find(n => n.nodeType === 'test');
    const testCompleted = test?.status === 'completed' || test?.status === 'perfect';

    return { completed, total: exercises.length, perfect, testCompleted };
  };

  // Main skill paths
  const skills = [
    {
      name: 'Focus Path',
      shortName: 'Focus',
      description: 'Gaze holds, breath pacing, stability, and tracking challenges',
      detailedDesc: 'Train your ability to maintain sustained attention, track moving targets, and hold your gaze steady. This path builds the foundation of all attention skills.',
      progress: skillTree.focus,
      icon: Focus,
      secondaryIcon: Target,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-500',
      challenges: ['Gaze Hold', 'Moving Target', 'Breath Pacing', 'Stability Hold'],
    },
    {
      name: 'Impulse Control Path',
      shortName: 'Impulse Control',
      description: 'Delay tasks, pattern memory, and self-regulation exercises',
      detailedDesc: 'Develop patience, self-regulation, and the ability to delay gratification. Master pattern recognition and memory under pressure.',
      progress: skillTree.impulseControl,
      icon: Shield,
      secondaryIcon: Brain,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      borderColor: 'border-purple-500',
      challenges: ['Impulse Delay', 'Tap Pattern', 'Memory Tasks'],
    },
    {
      name: 'Distraction Resistance Path',
      shortName: 'Distraction Resistance',
      description: 'Filter noise, resist interruptions, and selective attention',
      detailedDesc: 'Build your mental fortress against distractions. Learn to filter out visual and auditory noise while maintaining focus on your goals.',
      progress: skillTree.distractionResistance,
      icon: Eye,
      secondaryIcon: Zap,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-500',
      challenges: ['Distraction Resistance', 'Audio Focus', 'Visual Filtering'],
    },
  ];

  // Get rank based on average progress
  const averageProgress = (skillTree.focus + skillTree.impulseControl + skillTree.distractionResistance) / 3;

  // Rank system with progression thresholds
  const ranks = [
    { name: 'Novice', icon: '🌱', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800', min: 0, max: 25 },
    { name: 'Adept', icon: '🔷', color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900', min: 25, max: 50 },
    { name: 'Expert', icon: '💎', color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900', min: 50, max: 75 },
    { name: 'Master', icon: '⭐', color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900', min: 75, max: 90 },
    { name: 'Grandmaster', icon: '👑', color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900', min: 90, max: 100 },
  ];

  const getRank = () => {
    for (let i = ranks.length - 1; i >= 0; i--) {
      if (averageProgress >= ranks[i].min) {
        return { ...ranks[i], nextRank: ranks[i + 1] || null };
      }
    }
    return { ...ranks[0], nextRank: ranks[1] };
  };

  const rank = getRank();

  // Calculate progress to next rank
  const progressToNextRank = rank.nextRank
    ? ((averageProgress - rank.min) / (rank.nextRank.min - rank.min)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header with Rank */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl">{rank.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Skill Tree</h1>
              <Badge className={`text-lg px-4 py-1 ${rank.color} border-2`} variant="outline">
                {rank.name} Rank
              </Badge>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Master three core paths to unlock your full potential
          </p>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
              Overall Progress: {Math.floor(averageProgress)}%
            </p>
          </div>

          {/* Rank Progression Card */}
          <Card className={`max-w-2xl mx-auto ${rank.bgColor} border-2`}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rank.icon}</span>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 dark:text-white">{rank.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Current Rank</p>
                    </div>
                  </div>
                  {rank.nextRank && (
                    <>
                      <div className="flex-1 mx-4">
                        <div className="relative">
                          <Progress value={progressToNextRank} className="h-3" />
                          <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-1">
                            {Math.floor(progressToNextRank)}% to next rank
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">{rank.nextRank.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Next Rank</p>
                        </div>
                        <span className="text-2xl opacity-50">{rank.nextRank.icon}</span>
                      </div>
                    </>
                  )}
                  {!rank.nextRank && (
                    <div className="flex items-center gap-2">
                      <Trophy className="w-8 h-8 text-yellow-500 animate-pulse" />
                      <div className="text-left">
                        <p className="font-bold text-yellow-700 dark:text-yellow-400">Maximum Rank!</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">You've achieved mastery</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* All Ranks Progress */}
                <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Rank Progression</p>
                  <div className="flex items-center gap-1">
                    {ranks.map((r, idx) => {
                      const isAchieved = averageProgress >= r.min;
                      const isCurrent = rank.name === r.name;
                      return (
                        <div key={r.name} className="flex-1 text-center">
                          <div
                            className={`w-full h-2 rounded-full transition-all ${
                              isAchieved
                                ? isCurrent
                                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse'
                                  : 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                          <p className={`text-[10px] mt-1 ${isAchieved ? 'font-bold' : 'text-gray-500'}`}>
                            {r.icon}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Skill Paths */}
        <div className="space-y-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            const SecondaryIcon = skill.secondaryIcon;

            // Determine achievement level
            const getAchievementLevel = (progress: number) => {
              if (progress >= 100) return { level: 'Mastered', badge: '👑', color: 'text-yellow-500' };
              if (progress >= 75) return { level: 'Advanced', badge: '⭐', color: 'text-purple-500' };
              if (progress >= 50) return { level: 'Proficient', badge: '💎', color: 'text-blue-500' };
              if (progress >= 25) return { level: 'Developing', badge: '🔷', color: 'text-green-500' };
              return { level: 'Learning', badge: '🌱', color: 'text-gray-500' };
            };

            const achievement = getAchievementLevel(skill.progress);

            return (
              <Card key={skill.name} className={`border-2 ${skill.borderColor} bg-gradient-to-br ${skill.bgGradient} shadow-lg hover:shadow-xl transition-all`}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    {/* Icon Section */}
                    <div className="relative">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-md border-2 border-gray-200 dark:border-gray-700">
                        <SecondaryIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-2xl">{skill.shortName}</CardTitle>
                        <Badge variant="outline" className={`${achievement.color} font-semibold`}>
                          {achievement.badge} {achievement.level}
                        </Badge>
                      </div>
                      <CardDescription className="text-base mb-2">
                        {skill.description}
                      </CardDescription>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {skill.detailedDesc}
                      </p>

                      {/* Challenge Tags */}
                      <div className="flex flex-wrap gap-2">
                        {skill.challenges.map(challenge => (
                          <Badge key={challenge} variant="secondary" className="text-xs">
                            {challenge}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="text-right min-w-[120px]">
                      <div className={`text-5xl font-bold bg-gradient-to-br ${skill.gradient} bg-clip-text text-transparent`}>
                        {Math.floor(skill.progress)}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                        Progress
                      </p>
                      {skill.progress === 100 && (
                        <div className="mt-2">
                          <Trophy className="w-8 h-8 text-yellow-500 mx-auto animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={skill.progress} className="h-4 mb-2" />
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>{Math.floor(skill.progress * 100 / 100)} skills unlocked</span>
                    <span>{100 - Math.floor(skill.progress)} to mastery</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Level Themes Section */}
        <Card className="border-2 border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <div>
                <CardTitle className="text-2xl">Level Themes & Specializations</CardTitle>
                <CardDescription className="text-base">
                  Each level focuses on a unique skill theme with progressively harder challenges
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(LEVEL_THEMES).map(([levelNum, theme]) => {
                const stats = getLevelStats(Number(levelNum));
                const progressPercent = stats.total > 0 ? Math.floor((stats.completed / stats.total) * 100) : 0;

                return (
                  <Card key={levelNum} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{theme.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">Level {levelNum}: {theme.name}</h3>
                            {stats.testCompleted && (
                              <Award className="w-5 h-5 text-yellow-500" />
                            )}
                          </div>
                          <p className={`text-xs font-semibold bg-gradient-to-r ${theme.color} bg-clip-text text-transparent mb-1`}>
                            {theme.theme}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {theme.description}
                          </p>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {theme.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="text-[10px] px-2 py-0">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          {/* Progress */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600 dark:text-gray-400">
                                {stats.completed}/{stats.total} exercises
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {progressPercent}%
                              </span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>How it works:</strong> Complete challenges to earn progress in each skill path.
                Different challenge types contribute to different paths. Each level has a unique theme and skill focus!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Focus className="w-4 h-4 text-blue-500" />
                  <span><strong>Focus Path:</strong> Gaze, stability, movement</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-purple-500" />
                  <span><strong>Impulse Control:</strong> Delays, patterns, memory</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span><strong>Distraction Resist:</strong> Filtering, audio, visual</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
