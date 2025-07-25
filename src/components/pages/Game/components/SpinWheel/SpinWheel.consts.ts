// Define the wheel option IDs as a union type for type safety
export type WheelOptionId =
  | "challenge-description"
  | "half-challenge-description"
  | "emotional-support"
  | "free-spin"
  | "clippy"
  | "rubber-duck"
  | "comic-sans-mode"
  | "rainbow-mode"
  | "dad-jokes"
  | "existential-crisis"
  | "cat-facts"
  | "backwards-day"
  | "viking-mode"
  | "disco-fever";

export interface WheelOption {
  id: WheelOptionId;
  label: string;
  color: string;
}

export const WHEEL_OPTIONS: WheelOption[] = [
  {
    id: "challenge-description",
    label: "Description",
    color: "#FF6B6B", // Red
  },
  {
    id: "half-challenge-description",
    label: "Half Description",
    color: "#4ECDC4", // Teal
  },
  {
    id: "emotional-support",
    label: "Emotional Support",
    color: "#45B7D1", // Blue
  },
  {
    id: "free-spin",
    label: "Free Spin",
    color: "#FFA07A", // Light Orange
  },
  {
    id: "clippy",
    label: "Clippy",
    color: "#98D8C8", // Mint Green
  },
  {
    id: "rubber-duck",
    label: "Rubber Duck",
    color: "#F1C40F", // Yellow
  },
  {
    id: "comic-sans-mode",
    label: "Comic Sans Mode",
    color: "#E74C3C", // Bright Red
  },
  {
    id: "rainbow-mode",
    label: "Rainbow Mode",
    color: "#9B59B6", // Purple
  },
  {
    id: "dad-jokes",
    label: "Dad Jokes",
    color: "#E67E22", // Orange
  },
  {
    id: "existential-crisis",
    label: "Existential Crisis",
    color: "#34495E", // Dark Gray
  },
  {
    id: "cat-facts",
    label: "Cat Facts",
    color: "#F39C12", // Gold
  },
  {
    id: "backwards-day",
    label: "Backwards Day",
    color: "#2ECC71", // Green
  },
  {
    id: "viking-mode",
    label: "Viking Mode",
    color: "#8E44AD", // Dark Purple
  },
  {
    id: "disco-fever",
    label: "Disco Fever",
    color: "#E91E63", // Pink
  },
];

export const WHEEL_CONFIG = {
  SEGMENTS: WHEEL_OPTIONS.length,
  SEGMENT_ANGLE: 360 / WHEEL_OPTIONS.length,
  WHEEL_SIZE: 400,
  CENTER_SIZE: 25,
  MIN_SPINS: 3,
  MAX_SPINS: 6,
  SPIN_DURATION: 3000, // 3 seconds
};
