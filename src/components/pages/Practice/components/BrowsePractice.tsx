import { useState, useMemo } from "react";
import { Game } from "@/components/pages/Game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { puzzleLoader } from "@/data/puzzleLoader";
import { useGameStore } from "@/store/gameStore";
import { useStatisticsStore } from "@/store/statisticsStore";
import type { Puzzle } from "@/types/game";
import { CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { toTitleCase } from "@/lib/utils";

interface PuzzleManifestEntry {
  id: string;
  title: string;
  difficulty: Puzzle["difficulty"];
  category: string;
  tags: string[];
  summary: string;
}

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  expert: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  nightmare:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const DIFFICULTY_ORDER = [
  "easy",
  "medium",
  "hard",
  "expert",
  "nightmare",
] as const;

export function BrowsePractice() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);
  const [expandedDifficulties, setExpandedDifficulties] = useState<Set<string>>(
    new Set(["easy"]) // Start with easy expanded
  );

  const { isPuzzleSolved } = useStatisticsStore();
  const { loadPuzzle } = useGameStore();

  const puzzleEntries = useMemo(() => {
    return puzzleLoader.getPuzzleManifestEntries() as PuzzleManifestEntry[];
  }, []);

  const groupedPuzzles = useMemo(() => {
    return DIFFICULTY_ORDER.reduce((acc, difficulty) => {
      acc[difficulty] = puzzleEntries.filter(
        (p) => p.difficulty === difficulty
      );
      return acc;
    }, {} as Record<Puzzle["difficulty"], PuzzleManifestEntry[]>);
  }, [puzzleEntries]);

  const toggleDifficulty = (difficulty: string) => {
    setExpandedDifficulties((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(difficulty)) {
        newSet.delete(difficulty);
      } else {
        newSet.add(difficulty);
      }
      return newSet;
    });
  };

  const handlePuzzleSelect = async (puzzleEntry: PuzzleManifestEntry) => {
    try {
      const puzzle = await puzzleLoader.loadPuzzle(puzzleEntry.id);
      if (puzzle) {
        setSelectedPuzzle(puzzle);
        loadPuzzle(puzzle);
        setPuzzleKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load puzzle:", error);
    }
  };

  const handleBackToBrowse = () => {
    setSelectedPuzzle(null);
  };

  if (selectedPuzzle) {
    return (
      <div className="space-y-6">
        <div className="flex items-center p-4 bg-muted/20 rounded-lg border border-border/50">
          <Button variant="outline" onClick={handleBackToBrowse}>
            ← Back to Browse
          </Button>
        </div>

        <Game key={puzzleKey} mode="random" autoLoad={false} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview - Compressed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Progress Overview</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {DIFFICULTY_ORDER.map((difficulty) => {
              const total = groupedPuzzles[difficulty].length;
              const completed = groupedPuzzles[difficulty].filter((p) =>
                isPuzzleSolved(p.id)
              ).length;
              const percentage =
                total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div
                  key={difficulty}
                  className="text-center space-y-2 p-3 rounded-lg border border-border/50 bg-muted/20"
                >
                  <div className="text-xl font-bold">{completed}</div>
                  <div className="text-xs text-muted-foreground">/ {total}</div>
                  <Badge
                    className={`${DIFFICULTY_COLORS[difficulty]} text-xs w-full justify-center py-1`}
                  >
                    {toTitleCase(difficulty)}
                  </Badge>
                  <div className="text-xs font-medium">{percentage}%</div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary rounded-full h-1.5 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Browse Puzzles - Improved layering */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Browse Puzzles</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {DIFFICULTY_ORDER.map((difficulty) => {
              const puzzles = groupedPuzzles[difficulty];
              if (puzzles.length === 0) return null;

              const isExpanded = expandedDifficulties.has(difficulty);
              const completedCount = puzzles.filter((p) =>
                isPuzzleSolved(p.id)
              ).length;

              return (
                <div
                  key={difficulty}
                  className="border border-border/70 rounded-lg bg-muted/30 shadow-sm"
                >
                  {/* Difficulty Header */}
                  <button
                    onClick={() => toggleDifficulty(difficulty)}
                    className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-t-lg"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Badge
                        className={`${DIFFICULTY_COLORS[difficulty]} text-xs font-medium px-2 py-1`}
                      >
                        {toTitleCase(difficulty)}
                      </Badge>
                      <span className="text-sm text-muted-foreground font-medium">
                        {completedCount}/{puzzles.length} completed
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {Math.round((completedCount / puzzles.length) * 100)}%
                    </div>
                  </button>

                  {/* Puzzle List - Compressed and scrollable */}
                  {isExpanded && (
                    <div className="border-t border-border/50">
                      <div className="max-h-64 overflow-y-auto">
                        {puzzles.map((puzzle, index) => {
                          const isCompleted = isPuzzleSolved(puzzle.id);

                          return (
                            <button
                              key={puzzle.id}
                              onClick={() => handlePuzzleSelect(puzzle)}
                              className={`w-full p-3 text-left hover:bg-muted/40 transition-colors ${
                                index === puzzles.length - 1
                                  ? "rounded-b-lg"
                                  : "border-b border-border/30"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0 space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium truncate">
                                      {puzzle.title}
                                    </span>
                                    {isCompleted && (
                                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-1.5 py-0.5"
                                    >
                                      {toTitleCase(puzzle.category)}
                                    </Badge>
                                    {puzzle.tags
                                      .slice(0, 2)
                                      .map((tag, tagIndex) => (
                                        <Badge
                                          key={tagIndex}
                                          variant="secondary"
                                          className="text-xs px-1.5 py-0.5"
                                        >
                                          {toTitleCase(tag)}
                                        </Badge>
                                      ))}
                                    {puzzle.tags.length > 2 && (
                                      <span className="text-xs text-muted-foreground">
                                        +{puzzle.tags.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
