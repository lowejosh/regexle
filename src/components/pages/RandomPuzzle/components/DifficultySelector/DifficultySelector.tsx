import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { Puzzle } from "@/types/game";
import { difficulties } from "./DifficultySelector.consts";

interface DifficultySelectorProps {
  selectedDifficulty: Puzzle["difficulty"] | undefined;
  onDifficultyChange: (difficulty: Puzzle["difficulty"] | undefined) => void;
  onLoadPuzzle: () => void;
}

export function DifficultySelector({
  selectedDifficulty,
  onDifficultyChange,
  onLoadPuzzle,
}: DifficultySelectorProps) {
  const displayDifficulty = selectedDifficulty || "any";

  return (
    <Card>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl">Choose Your Challenge</CardTitle>
        <CardDescription className="text-base">
          Select a difficulty level to match your regex expertise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Difficulty Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {difficulties.map(({ value, label, description }) => {
            const isSelected = displayDifficulty === value;

            return (
              <button
                key={value}
                onClick={() =>
                  onDifficultyChange(
                    value === "any"
                      ? undefined
                      : (value as Puzzle["difficulty"])
                  )
                }
                className={`
                  group relative p-4 rounded-xl border-2 transition-all duration-200 
                  ${
                    isSelected
                      ? "border-primary bg-accent shadow-md scale-105"
                      : "border-border bg-secondary hover:bg-accent hover:border-primary/50 hover:shadow-sm hover:scale-102"
                  }
                `}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Badge
                      variant={
                        value === "any"
                          ? "default"
                          : (value as
                              | "easy"
                              | "medium"
                              | "hard"
                              | "expert"
                              | "nightmare")
                      }
                      className={`
                        transition-all duration-200 
                        ${isSelected ? "scale-110" : "group-hover:scale-105"}
                      `}
                    >
                      {label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Load Button */}
        <div className="pt-4 border-t border-border/50">
          <div className="text-center space-y-3">
            <Button
              onClick={onLoadPuzzle}
              size="lg"
              className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Load New Puzzle
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
