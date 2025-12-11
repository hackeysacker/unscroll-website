import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Vibrate, Volume2, Moon, Bell, Trash2, Palette, Crown, Check } from 'lucide-react';
import type { ThemeType } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme, availableThemes } = useTheme();

  if (!settings || !user) return null;

  const themeInfo: Record<ThemeType, { name: string; description: string; preview: string; animated?: boolean }> = {
    'noir-cinema': {
      name: 'Noir Cinema',
      description: 'Dramatic film noir with warm amber accents',
      preview: 'bg-gradient-to-br from-zinc-950 via-neutral-900 to-amber-950 animate-gradient',
      animated: true,
    },
    'tokyo-neon': {
      name: 'Tokyo Neon',
      description: 'Electric cyberpunk pink & cyan glow',
      preview: 'bg-gradient-to-br from-slate-950 via-fuchsia-950 to-cyan-950 animate-gradient',
      animated: true,
    },
    'aura-glass': {
      name: 'Aura Glass',
      description: 'Ethereal frosted lavender dreamscape',
      preview: 'bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 animate-gradient',
      animated: true,
    },
    'paper-craft': {
      name: 'Paper Craft',
      description: 'Handmade artisanal warmth with terracotta',
      preview: 'bg-gradient-to-br from-orange-50 via-amber-50 to-rose-100 animate-gradient',
      animated: true,
    },
    'arctic-aurora': {
      name: 'Arctic Aurora',
      description: 'Deep arctic night with northern lights',
      preview: 'bg-gradient-to-br from-slate-900 via-cyan-950 to-emerald-950 animate-gradient',
      animated: true,
    },
    'rose-quartz': {
      name: 'Rose Quartz',
      description: 'Luxurious dark with rose gold shimmer',
      preview: 'bg-gradient-to-br from-zinc-900 via-rose-950 to-pink-950 animate-gradient',
      animated: true,
    },
    'matcha-zen': {
      name: 'Matcha Zen',
      description: 'Japanese-inspired deep green serenity',
      preview: 'bg-gradient-to-br from-stone-900 via-green-950 to-emerald-950 animate-gradient',
      animated: true,
    },
    'cosmic-void': {
      name: 'Cosmic Void',
      description: 'Ultra-deep space with nebula purples',
      preview: 'bg-gradient-to-br from-black via-purple-950 to-indigo-950 animate-gradient',
      animated: true,
    },
  };

  const handleResetProgress = () => {
    logout();
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Customize your FocusFlow experience
          </p>
        </div>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle>App Settings</CardTitle>
            <CardDescription>Customize your training experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Label htmlFor="vibration" className="cursor-pointer">
                  <div className="font-medium">Vibration</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Haptic feedback during challenges
                  </div>
                </Label>
              </div>
              <Switch
                id="vibration"
                checked={settings.vibrationEnabled}
                onCheckedChange={(checked) => updateSettings({ vibrationEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Label htmlFor="sound" className="cursor-pointer">
                  <div className="font-medium">Sound</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Audio feedback and effects
                  </div>
                </Label>
              </div>
              <Switch
                id="sound"
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Label htmlFor="darkMode" className="cursor-pointer">
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Switch to dark theme
                  </div>
                </Label>
              </div>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <Label htmlFor="notifications" className="cursor-pointer">
                  <div className="font-medium">Notifications</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Daily reminders and milestone alerts
                  </div>
                </Label>
              </div>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Theme Selector - Premium Feature */}
        {user.isPremium && (
          <Card className="border-yellow-300 dark:border-yellow-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  <CardTitle>Aesthetic Themes</CardTitle>
                </div>
                <Badge className="bg-yellow-400 text-yellow-900">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <CardDescription>Customize your app's visual style</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(themeInfo) as ThemeType[]).map((themeKey) => {
                  const info = themeInfo[themeKey];
                  const isSelected = theme === themeKey;
                  const isLocked = !availableThemes.includes(themeKey);

                  return (
                    <button
                      key={themeKey}
                      onClick={() => !isLocked && setTheme(themeKey)}
                      disabled={isLocked}
                      className={`relative p-4 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:shadow-md'
                      } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      {info.animated && (
                        <Badge className="absolute top-2 left-2 z-10 bg-purple-500 text-white text-xs">
                          Animated
                        </Badge>
                      )}
                      <div className={`w-full h-24 rounded-lg mb-3 shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden ${info.preview}`}>
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center px-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mx-auto mb-2 flex items-center justify-center">
                              <Palette className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                            <p className="text-xs font-bold text-white drop-shadow-lg">Preview</p>
                          </div>
                        </div>
                      </div>
                      <p className="font-bold text-base text-gray-900 dark:text-white">{info.name}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {info.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.email && (
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Account ID</p>
              <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                {user.id.slice(0, 8)}...
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <Button variant="outline" onClick={logout} className="w-full">
                Logout
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset Progress
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your progress, including streaks, XP, levels,
                      and challenge history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetProgress}>
                      Reset Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="pt-6">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              FocusFlow v1.0.0 • Made with focus and dedication
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
