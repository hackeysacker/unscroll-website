import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Moon, Wind, Heart, Play, Pause, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { WindDownSession, WindDownSettings } from '@/types';
import { STORAGE_KEYS, saveToStorage, loadFromStorage } from '@/lib/storage';

interface WindDownModeProps {
  onBack: () => void;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

const BREATH_PATTERNS = {
  box: { inhale: 4, hold: 4, exhale: 4, rest: 4, name: 'Box Breathing', description: 'Equal 4-second intervals for balance' },
  relaxing: { inhale: 4, hold: 2, exhale: 6, rest: 2, name: 'Relaxing Breath', description: 'Longer exhales for calm' },
  sleep: { inhale: 4, hold: 7, exhale: 8, rest: 0, name: '4-7-8 Sleep Breath', description: 'Dr. Weil\'s technique for sleep' },
};

export function WindDownMode({ onBack }: WindDownModeProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<WindDownSettings | null>(null);
  const [currentSession, setCurrentSession] = useState<WindDownSession | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!user) return;

    // Load or create settings
    const savedSettings = loadFromStorage<WindDownSettings>(STORAGE_KEYS.WIND_DOWN_SETTINGS);
    if (savedSettings && savedSettings.userId === user.id) {
      setSettings(savedSettings);
    } else {
      const defaultSettings: WindDownSettings = {
        userId: user.id,
        enabled: true,
        duration: 10, // 10 minutes default
        breathingPattern: 'relaxing',
      };
      setSettings(defaultSettings);
      saveToStorage(STORAGE_KEYS.WIND_DOWN_SETTINGS, defaultSettings);
    }
  }, [user]);

  useEffect(() => {
    if (!isActive || !settings) return;

    const pattern = BREATH_PATTERNS[settings.breathingPattern];
    const phases: BreathPhase[] = ['inhale', 'hold', 'exhale'];
    if (pattern.rest > 0) phases.push('rest');

    let startTime = Date.now();
    let currentPhaseIndex = 0;
    let currentPhaseName = phases[0];

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const phaseDuration = pattern[currentPhaseName] * 1000;
      const progress = (elapsed / phaseDuration) * 100;

      setPhaseProgress(progress);
      setSessionTime(prev => prev + 16); // ~60fps

      if (progress >= 100) {
        // Move to next phase
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        currentPhaseName = phases[currentPhaseIndex];
        setCurrentPhase(currentPhaseName);
        startTime = Date.now();

        // Increment breath count when completing exhale
        if (currentPhaseName === 'inhale') {
          setBreathCount(prev => prev + 1);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, currentPhase, settings]);

  const startSession = () => {
    if (!user || !settings) return;

    const session: WindDownSession = {
      id: crypto.randomUUID(),
      userId: user.id,
      startedAt: Date.now(),
      duration: 0,
      breathingExercises: 0,
      completed: false,
    };

    setCurrentSession(session);
    setIsActive(true);
    setBreathCount(0);
    setSessionTime(0);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resumeSession = () => {
    setIsActive(true);
  };

  const completeSession = () => {
    if (!currentSession) return;

    const completedSession: WindDownSession = {
      ...currentSession,
      completedAt: Date.now(),
      duration: sessionTime,
      breathingExercises: breathCount,
      completed: true,
    };

    // Save session
    const allSessions = loadFromStorage<WindDownSession[]>(STORAGE_KEYS.WIND_DOWN_SESSIONS) || [];
    allSessions.push(completedSession);
    saveToStorage(STORAGE_KEYS.WIND_DOWN_SESSIONS, allSessions);

    setCurrentSession(null);
    setIsActive(false);
    setBreathCount(0);
    setSessionTime(0);
  };

  const changePattern = (pattern: 'box' | 'relaxing' | 'sleep') => {
    if (!user || !settings) return;

    const newSettings = { ...settings, breathingPattern: pattern };
    setSettings(newSettings);
    saveToStorage(STORAGE_KEYS.WIND_DOWN_SETTINGS, newSettings);

    // Reset session if active
    if (isActive) {
      setIsActive(false);
      setPhaseProgress(0);
    }
  };

  if (!user?.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto space-y-6 py-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardContent className="pt-6 text-center">
              <p>Wind-Down Mode is a premium feature.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  const pattern = BREATH_PATTERNS[settings.breathingPattern];
  const targetBreaths = Math.floor((settings.duration * 60 * 1000) / ((pattern.inhale + pattern.hold + pattern.exhale + pattern.rest) * 1000));
  const sessionProgress = targetBreaths > 0 ? (breathCount / targetBreaths) * 100 : 0;

  const phaseColors = {
    inhale: 'from-blue-500 to-cyan-500',
    hold: 'from-purple-500 to-indigo-500',
    exhale: 'from-green-500 to-teal-500',
    rest: 'from-gray-600 to-gray-700',
  };

  const phaseInstructions = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out',
    rest: 'Rest',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
              <Moon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white">Wind-Down Mode</h1>
          <p className="text-lg text-blue-100">
            Calm your mind with guided breathing exercises
          </p>
        </div>

        {/* Breathing Patterns */}
        {!currentSession && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(BREATH_PATTERNS).map(([key, p]) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all ${
                  settings.breathingPattern === key
                    ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => changePattern(key as 'box' | 'relaxing' | 'sleep')}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                  <CardDescription>{p.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Wind className="w-4 h-4" />
                    <span>{p.inhale}s - {p.hold}s - {p.exhale}s{p.rest > 0 ? ` - ${p.rest}s` : ''}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Breathing Animation */}
        {currentSession && (
          <Card className="border-none bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg">
            <CardContent className="pt-12 pb-12">
              <div className="flex flex-col items-center space-y-8">
                {/* Animated Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColors[currentPhase]} transition-all duration-1000`}
                    style={{
                      transform: `scale(${0.5 + (phaseProgress / 100) * 0.5})`,
                      opacity: 0.3 + (phaseProgress / 100) * 0.4,
                    }}
                  />
                  <div className="relative text-center space-y-4 text-white">
                    <p className="text-4xl font-bold capitalize">{phaseInstructions[currentPhase]}</p>
                    <p className="text-6xl font-light">{Math.ceil(pattern[currentPhase] - (phaseProgress / 100) * pattern[currentPhase])}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="w-full max-w-md space-y-4">
                  <div className="flex items-center justify-between text-white text-sm">
                    <span className="flex items-center gap-2">
                      <Wind className="w-4 h-4" />
                      {breathCount} breaths
                    </span>
                    <span>{Math.floor(sessionTime / 1000 / 60)}m {Math.floor((sessionTime / 1000) % 60)}s</span>
                  </div>
                  <Progress value={sessionProgress} className="h-2 bg-white/20" />
                  <p className="text-center text-white/80 text-sm">
                    {targetBreaths - breathCount} breaths remaining
                  </p>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                  {isActive ? (
                    <Button
                      onClick={pauseSession}
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      onClick={resumeSession}
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button
                    onClick={completeSession}
                    size="lg"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Session */}
        {!currentSession && (
          <Card className="border-none bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center gap-2 text-white">
                  <Heart className="w-5 h-5" />
                  <p className="text-lg">
                    Selected: <strong>{pattern.name}</strong>
                  </p>
                </div>
                <Button
                  onClick={startSession}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Wind-Down Session ({settings.duration} min)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        {!currentSession && (
          <Card className="border-none bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-white">Benefits of Wind-Down Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-white/90">
              <p className="text-sm">✨ Reduces stress and anxiety before sleep</p>
              <p className="text-sm">🧘 Calms the nervous system with controlled breathing</p>
              <p className="text-sm">💤 Improves sleep quality and reduces racing thoughts</p>
              <p className="text-sm">🎯 Complements your focus training with relaxation skills</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
