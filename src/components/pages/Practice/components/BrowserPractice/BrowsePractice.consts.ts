import type { Puzzle } from "@/types/game";

export const DIFFICULTY_COLORS: Record<Puzzle["difficulty"], string> = {
  easy: "bg-easy-100 text-easy-800 dark:bg-easy-900 dark:text-easy-200",
  medium: "bg-medium-100 text-medium-800 dark:bg-medium-900 dark:text-medium-200",
  hard: "bg-hard-100 text-hard-800 dark:bg-hard-900 dark:text-hard-200",
  expert: "bg-expert-100 text-expert-800 dark:bg-expert-900 dark:text-expert-200",
  nightmare: "bg-nightmare-100 text-nightmare-800 dark:bg-nightmare-900 dark:text-nightmare-200",
};

export const DIFFICULTY_ORDER = [
  "easy",
  "medium",
  "hard",
  "expert",
  "nightmare",
] as const;
