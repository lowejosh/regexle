// Animation and styling constants for the SpinWheelButton
export const SPIN_BUTTON_ANIMATIONS = {
  TRANSITION_DURATION: "duration-300",
  HIGHLIGHT_CLASSES:
    "wiggle bg-yellow-50 border-yellow-300 hover:bg-yellow-100",
  HOVER_CLASSES: "hover:bg-gray-50",
  DISABLED_CLASSES: "opacity-50 cursor-not-allowed",
  INDICATOR_PULSE: "animate-pulse",
} as const;

export const SPIN_BUTTON_CONFIG = {
  EMOJI: "🎲",
  INDICATOR_COLORS: {
    MULTIPLE_SPINS: "bg-red-500",
    SINGLE_SPIN_FAILED: "bg-yellow-400",
  },
} as const;
