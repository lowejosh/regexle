import type { Puzzle } from "@/types/game";

export const difficulties: Array<{
  value: Puzzle["difficulty"] | "any";
  label: string;
  description: string;
}> = [
  { value: "any", label: "Surprise Me", description: "Random difficulty" },
  { value: "easy", label: "Easy", description: "For beginners" },
  { value: "medium", label: "Medium", description: "Getting interesting" },
  { value: "hard", label: "Hard", description: "Real challenge" },
  { value: "expert", label: "Expert", description: "Advanced patterns" },
  { value: "nightmare", label: "Nightmare", description: "Good luck!" },
];
