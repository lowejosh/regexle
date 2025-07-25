import { useState, useEffect, useCallback } from "react";

import { useSpinWheelStore } from "../../../../../store/spinWheelStore";

const ENCOURAGEMENT_MESSAGES = [
  "Failure is just a learning opportunity in disguise!",
  "Success is just failure that hasn't happened yet!",
  "Remember: We're all about that growth mindset!",
  "Embrace the journey of continuous improvement!",
  "Believe in yourself and anything is possible!",
  "Let's touch base and align on best practices!",
  "Synergize your potential for maximum impact!",
  "Let's circle back and ideate some solutions!",
  "Innovation happens when we push boundaries!",
  "Winners never quit and quitters never win.",
  "Your potential is limitless! Actualize it!",
  "Think outside the box to move the needle!",
  "Time to pivot and disrupt the status quo!",
  "Every challenge is a chance to level up!",
  "You're crushing it! Keep being awesome!",
  "Let's take this offline and deep dive!",
  "Let's leverage our core competencies!",
  "Failure is just success in progress.",
  "Remember: There's no 'I' in team!",
  "Every expert was once a beginner.",
  "Teamwork makes the dream work!",
  "Think outside the box!",
  "Keep pushing forward!",
  "You can do it!",
];

const TIMER = 4000; // 4 seconds

export function EncouragementToast() {
  const { setShowEncouragementCallback } = useSpinWheelStore();
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
    setShowEncouragementCallback(showEncouragement);
  }, [setShowEncouragementCallback, showEncouragement]);

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
