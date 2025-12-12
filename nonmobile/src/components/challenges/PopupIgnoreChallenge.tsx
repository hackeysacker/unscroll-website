import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ExerciseOverview, type ExerciseStats } from '@/components/ExerciseOverview';
import { X } from 'lucide-react';

interface PopupIgnoreChallengeProps {
  duration: number;
  onComplete: (score: number, duration: number) => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

interface Popup {
  id: number;
  message: string;
  color: string;
}

export function PopupIgnoreChallenge({ duration, onComplete, onNextLesson, hasNextLesson }: PopupIgnoreChallengeProps) {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [showOverview, setShowOverview] = useState(false);
  const [exerciseStats, setExerciseStats] = useState<ExerciseStats | null>(null);
  const clickedPopupsRef = useRef(0);
  const totalPopupsRef = useRef(0);

  const popupMessages = [
    { message: 'You have 1 new message!', color: 'bg-blue-500' },
    { message: 'Click here for free stuff!', color: 'bg-green-500' },
    { message: 'URGENT: Read this now!', color: 'bg-red-500' },
    { message: 'Limited time offer!', color: 'bg-yellow-500' },
    { message: 'Your friend mentioned you!', color: 'bg-purple-500' },
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

  // Generate popups
  useEffect(() => {
    if (!isActive) return;

    const generatePopup = () => {
      const template = popupMessages[Math.floor(Math.random() * popupMessages.length)];
      const newPopup: Popup = {
        id: Date.now(),
        message: template.message,
        color: template.color,
      };

      setPopups(prev => [...prev.slice(-4), newPopup]);
      totalPopupsRef.current += 1;

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setPopups(prev => prev.filter(p => p.id !== newPopup.id));
      }, 3000);
    };

    const interval = setInterval(generatePopup, 2000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handlePopupClick = (id: number) => {
    clickedPopupsRef.current += 1;
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  const handleComplete = () => {
    // Score based on ignoring popups (higher is better)
    const ignoredPopups = totalPopupsRef.current - clickedPopupsRef.current;
    const score = totalPopupsRef.current > 0
      ? (ignoredPopups / totalPopupsRef.current) * 100
      : 100;

    const stats: ExerciseStats = {
      score,
      duration: duration * 1000,
      correctActions: ignoredPopups,
      totalActions: totalPopupsRef.current,
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
        challengeType="popup_ignore"
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
            <h3 className="text-2xl font-bold">Pop-Up Ignore</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Stay focused on the center - ignore all pop-up distractions
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
              <span className="text-green-600">Ignored: {totalPopupsRef.current - clickedPopupsRef.current}</span>
              <span className="mx-2">/</span>
              <span className="text-red-600">Clicked: {clickedPopupsRef.current}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative h-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center">
        {/* Central focus area */}
        <div className="text-center space-y-4 z-10">
          <div className="text-7xl">🎯</div>
          <p className="text-2xl font-bold">Stay Focused</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Ignore all pop-ups</p>
        </div>

        {/* Pop-ups */}
        {popups.map((popup, index) => (
          <div
            key={popup.id}
            className={`absolute ${popup.color} text-white p-4 rounded-lg shadow-2xl cursor-pointer hover:scale-105 transition-all animate-in fade-in slide-in-from-top-5`}
            style={{
              top: `${20 + index * 15}%`,
              right: `${10 + index * 5}%`,
            }}
            onClick={() => handlePopupClick(popup.id)}
          >
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="font-semibold text-sm">{popup.message}</p>
              </div>
              <X className="w-4 h-4 flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-gray-600 dark:text-gray-300">
        Don't click the pop-ups - stay focused on the center
      </p>
    </div>
  );
}
