import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Smartphone, Focus, Shield, Sparkles } from 'lucide-react';
import type { GoalType } from '@/types';

interface GoalSelectionProps {
  onNext: (goal: GoalType) => void;
  onBack: () => void;
}

const goals: Array<{ value: GoalType; label: string; description: string; details: string; icon: typeof Smartphone }> = [
  {
    value: 'reduce_doomscrolling',
    label: 'Reduce Doomscrolling',
    description: 'Break the habit of endless scrolling',
    details: 'Train your brain to recognize and resist the urge to mindlessly scroll through social media and news feeds.',
    icon: Smartphone,
  },
  {
    value: 'improve_focus',
    label: 'Improve Focus',
    description: 'Strengthen your concentration abilities',
    details: 'Build sustained attention through progressive challenges that increase your ability to concentrate on important tasks.',
    icon: Focus,
  },
  {
    value: 'build_impulse_control',
    label: 'Build Impulse Control',
    description: 'Resist distractions and manage impulses',
    details: 'Develop the mental discipline to delay gratification and resist immediate distractions for long-term benefits.',
    icon: Shield,
  },
  {
    value: 'calm_mind',
    label: 'Calm Mind',
    description: 'Achieve mental clarity and peace',
    details: 'Learn to quiet mental chatter and maintain inner calm even in distracting or stressful environments.',
    icon: Sparkles,
  },
];

export function GoalSelection({ onNext, onBack }: GoalSelectionProps) {
  const [selectedGoal, setSelectedGoal] = useState<GoalType>('improve_focus');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What's your primary goal?</CardTitle>
            <CardDescription>
              Choose what you want to improve. You can always change this later in settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={selectedGoal} onValueChange={(v) => setSelectedGoal(v as GoalType)}>
              <div className="space-y-3">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoal === goal.value;
                  return (
                    <div key={goal.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={goal.value} id={goal.value} />
                      <Label
                        htmlFor={goal.value}
                        className={`flex items-start gap-3 flex-1 cursor-pointer p-4 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 dark:bg-indigo-500'
                            : 'bg-indigo-100 dark:bg-indigo-900'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            isSelected ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {goal.label}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                            {goal.description}
                          </div>
                          {isSelected && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                              {goal.details}
                            </div>
                          )}
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Tip:</strong> All challenges work toward multiple goals. Your selection helps us personalize your experience and insights.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={onBack} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={() => onNext(selectedGoal)} className="flex-1">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
