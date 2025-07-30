import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, ChevronDown, ChevronRight } from "lucide-react";
import { toTitleCase, cn } from "@/lib/utils";
import { BrowsePuzzleListItem } from "../BrowsePuzzleListItem";
import { DIFFICULTY_COLORS } from "../../BrowsePractice.consts";
import {
  usePuzzleBrowsing,
} from "../../BrowsePractice.hooks";
import type { PuzzleManifestEntry } from "@/types/game";

interface BrowsePuzzleListSectionProps {
  onPuzzleClick: (puzzle: PuzzleManifestEntry) => void;
}

export function BrowsePuzzleListSection({
  onPuzzleClick,
}: BrowsePuzzleListSectionProps) {
  const {
    groupedPuzzles,
    expandedDifficulties,
    toggleDifficulty,
    isPuzzleSolved,
    DIFFICULTY_ORDER,
  } = usePuzzleBrowsing();

  return (
    <div className="space-y-3">
      {DIFFICULTY_ORDER.map((difficulty) => {
        const puzzles = groupedPuzzles[difficulty];
        if (puzzles.length === 0) return null;

        const isExpanded = expandedDifficulties.has(difficulty);
        const completedCount = puzzles.filter((p) =>
          isPuzzleSolved(p.id)
        ).length;

        return (
          <Card
            key={difficulty}
            className="border-border/70 overflow-hidden"
          >
            {/* Difficulty Header */}
            <button
              onClick={() => toggleDifficulty(difficulty)}
              className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="transition-transform duration-200 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <Badge
                  className={cn(
                    DIFFICULTY_COLORS[difficulty],
                    "text-xs font-semibold px-3 py-1 flex-shrink-0"
                  )}
                >
                  {toTitleCase(difficulty)}
                </Badge>

                {/* Desktop: Show full info */}
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <span className="font-medium">
                    {puzzles.length} puzzles
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4" />
                    {completedCount} completed
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-sm font-semibold">
                  {Math.round((completedCount / puzzles.length) * 100)}%
                </div>
                <div className="w-16 sm:w-24 bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (completedCount / puzzles.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </button>

            {/* Puzzle List */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out border-t border-border/50",
                isExpanded
                  ? "max-h-[28rem] sm:max-h-[32rem] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <CardContent className="!p-0">
                <div className="max-h-[28rem] sm:max-h-[32rem] overflow-y-auto">
                  <div className="divide-y divide-border/50">
                    {puzzles.map((puzzle, index) => (
                      <div
                        key={puzzle.id}
                        className="animate-in slide-in-from-top-2 fade-in-0"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationDuration: "300ms",
                          animationFillMode: "both",
                        }}
                      >
                        <BrowsePuzzleListItem
                          puzzle={puzzle}
                          isCompleted={isPuzzleSolved(puzzle.id)}
                          onClick={() => onPuzzleClick(puzzle)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
