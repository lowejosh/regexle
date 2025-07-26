import { useState } from "react";
import { Game } from "@/components/pages/Game";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import type { Puzzle } from "@/types/game";

export function RandomPuzzle() {
  const [difficulty, setDifficulty] = useState<
    Puzzle["difficulty"] | undefined
  >(undefined);
  const [key, setKey] = useState(0); // Force re-render when loading new puzzle

  const handleLoadNew = () => {
    setKey((prev) => prev + 1);
  };

  const difficulties: Array<{
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

  const selectedDifficulty = difficulty || "any";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Difficulty Selection */}
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
              const isSelected = selectedDifficulty === value;

              return (
                <button
                  key={value}
                  onClick={() =>
                    setDifficulty(
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
                onClick={handleLoadNew}
                size="lg"
                className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Load New Puzzle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Game key={key} mode="random" difficulty={difficulty} />
    </div>
  );
}
