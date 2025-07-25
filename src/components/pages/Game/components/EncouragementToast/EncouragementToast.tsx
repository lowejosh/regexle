import { useState, useEffect, useCallback } from "react";

interface EncouragementToastProps {
  onShowMessage: (callback: () => void) => void;
}

const ENCOURAGEMENT_MESSAGES = [
  "Remember: There's no 'I' in team!",
  "Failure is just success in progress.",
  "Think outside the box!",
  "Every expert was once a beginner.",
  "Teamwork makes the dream work!",
  "Winners never quit and quitters never win.",
  "Believe in yourself and anything is possible!",
  "You can do it!",
  "Keep pushing forward!",
];

const TIMER = 4000; // 4 seconds

export function EncouragementToast({ onShowMessage }: EncouragementToastProps) {
  const [encouragementMessage, setEncouragementMessage] = useState<
    string | null
  >(null);

  const showEncouragement = useCallback(() => {
    const randomMessage =
      ENCOURAGEMENT_MESSAGES[
        Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
      ];
    setEncouragementMessage(randomMessage);
    // Clear message after 5 seconds
    setTimeout(() => setEncouragementMessage(null), TIMER);
  }, []);

  useEffect(() => {
    onShowMessage(showEncouragement);
  }, [onShowMessage, showEncouragement]);

  if (!encouragementMessage) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="max-w-lg p-8 bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-400 rounded-xl shadow-2xl animate-bounce pointer-events-auto">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-pulse">🌟</div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Motivational Moment
          </h2>
          <p className="text-xl text-green-800 font-semibold leading-relaxed">
            {encouragementMessage}
          </p>
          <div className="text-4xl">✨</div>
        </div>
      </div>
    </div>
  );
}
