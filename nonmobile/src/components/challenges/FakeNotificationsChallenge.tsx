import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';
import { Bell, MessageCircle, Mail } from 'lucide-react';

interface FakeNotificationsChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

interface Notification {
  id: number;
  message: string;
  icon: typeof Bell;
}

export function FakeNotificationsChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: FakeNotificationsChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const clickedNotificationsRef = useRef(0);
  const totalNotificationsRef = useRef(0);

  const notificationTypes = [
    { icon: Bell, message: 'New message!' },
    { icon: MessageCircle, message: 'Someone commented' },
    { icon: Mail, message: 'You have mail' },
  ];

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  // Generate fake notifications
  useEffect(() => {
    if (!isActive) return;

    const generateNotification = () => {
      const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const newNotification: Notification = {
        id: Date.now(),
        message: type.message,
        icon: type.icon,
      };
      setNotifications(prev => [...prev, newNotification]);
      totalNotificationsRef.current += 1;

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 3000);
    };

    const interval = setInterval(generateNotification, 2500);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleNotificationClick = (id: number) => {
    clickedNotificationsRef.current += 1;
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleComplete = () => {
    // Score based on how many notifications were ignored (higher is better)
    const ignoredNotifications = totalNotificationsRef.current - clickedNotificationsRef.current;
    const score = totalNotificationsRef.current > 0
      ? (ignoredNotifications / totalNotificationsRef.current) * 100
      : 100;

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      correctActions: ignoredNotifications,
      totalActions: totalNotificationsRef.current,
    };

    setExerciseStats(stats);
    setShowOverview(true);
  };

  const handleOverviewContinue = () => {
    if (exerciseStats) {
      onComplete(exerciseStats.score, exerciseStats.duration);
    }
  };

  if (showOverview && exerciseStats) {
    return (
      <ExerciseOverview
        challengeType="fake_notifications"
        stats={exerciseStats}
        onContinue={handleOverviewContinue}
        showHeartLoss={true}
        onNextLesson={onNextLesson}
        hasNextLesson={hasNextLesson}
      />
    );
  }

  if (!isActive) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Fake Notifications</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Ignore all fake notifications - don't tap them! Stay focused for {duration} seconds
            </p>
          </div>
          <Button onClick={() => setIsActive(true)} className="w-full">
            Start Exercise
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Time Remaining</span>
              <span className="text-2xl font-bold">{timeLeft}s</span>
            </div>
            <Progress value={(timeLeft / duration) * 100} />
            <div className="text-sm text-center">
              <span className="text-green-600">Ignored: {totalNotificationsRef.current - clickedNotificationsRef.current}</span>
              <span className="mx-2">/</span>
              <span className="text-red-600">Clicked: {clickedNotificationsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🧘</div>
          <p className="text-2xl font-semibold">Stay Focused</p>
          <p className="text-gray-600 dark:text-gray-400">Ignore the distractions</p>
        </div>

        {/* Fake notifications */}
        <div className="absolute top-4 right-4 space-y-2">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all animate-in fade-in slide-in-from-right-5"
                onClick={() => handleNotificationClick(notif.id)}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">{notif.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Don't tap the notifications - resist the urge!
      </p>
    </div>
  );
}
