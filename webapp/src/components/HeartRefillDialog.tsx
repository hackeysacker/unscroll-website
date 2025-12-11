import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Wind, Zap, UserPlus, Lightbulb, Crown } from 'lucide-react';
import type { HeartRefillActionType } from '@/types';

interface HeartRefillDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectAction: (action: HeartRefillActionType) => void;
  onUpgradeToPremium: () => void;
  currentHearts: number;
}

export function HeartRefillDialog({ open, onClose, onSelectAction, onUpgradeToPremium, currentHearts }: HeartRefillDialogProps) {
  const refillActions: Array<{
    type: HeartRefillActionType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    {
      type: 'breathing_exercise',
      label: 'Breathing Exercise',
      description: 'Complete a 60-second calming breath exercise',
      icon: Wind,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      type: 'micro_focus',
      label: 'Micro Focus Challenge',
      description: '10-second quick focus test',
      icon: Zap,
      color: 'from-purple-500 to-pink-600',
    },
    {
      type: 'invite_friend',
      label: 'Invite a Friend',
      description: 'Share FocusFlow with someone',
      icon: UserPlus,
      color: 'from-green-500 to-emerald-600',
    },
    {
      type: 'watch_tip',
      label: 'Watch a Tip',
      description: 'Learn a quick focus improvement tip',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            Out of Hearts
          </DialogTitle>
          <DialogDescription>
            You have {currentHearts} heart{currentHearts !== 1 ? 's' : ''} remaining. Refill a heart to continue training!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Premium Option */}
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-500">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Unlimited Hearts</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Premium users never run out of hearts. Train anytime, without limits.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  onClose();
                  onUpgradeToPremium();
                }}
                className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700"
              >
                Upgrade
              </Button>
            </div>
          </Card>

          {/* Free Refill Actions */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Free Refill Options (+1 Heart)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {refillActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.type}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      onSelectAction(action.type);
                      onClose();
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{action.label}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Automatic Refill Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Automatic Refills:</strong> Hearts refill automatically at 1 heart every 4 hours, or all 5 hearts reset at midnight.
            </p>
          </div>

          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
