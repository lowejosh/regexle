import { useState } from "react";
import { Game } from "@/components/pages/Game";
import { Button } from "@/components/ui/Button";
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

  const difficulties: (Puzzle["difficulty"] | "any")[] = [
    "any",
    "easy",
    "medium",
    "hard",
    "expert",
    "nightmare",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Random Puzzle</h1>
        <p className="text-muted-foreground">
          Challenge yourself with a random puzzle. Select a difficulty or leave
          it as "any" for a surprise!
        </p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardDescription>
            Choose your difficulty level and load a new puzzle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {difficulties.map((diff) => (
              <Button
                key={diff}
                variant={
                  difficulty === (diff === "any" ? undefined : diff)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setDifficulty(diff === "any" ? undefined : diff)}
              >
                {diff === "any"
                  ? "Any Difficulty"
                  : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </Button>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={handleLoadNew}>Load New Puzzle</Button>
          </div>
        </CardContent>
      </Card>

      <Game key={key} mode="random" difficulty={difficulty} />
    </div>
  );
}
