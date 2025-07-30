import { Game } from "@/components/pages/Game";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/ui";
import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle } from "lucide-react";
import type { PuzzleManifestEntry } from "@/types/game";

interface BrowseGameViewProps {
  puzzleKey: number;
  currentPuzzleIndex: number;
  filteredPuzzles: PuzzleManifestEntry[];
  previousPuzzleEntry: PuzzleManifestEntry | null;
  nextPuzzleEntry: PuzzleManifestEntry | null;
  onBackToBrowse: () => void;
  onNavigateToPrevious: () => void;
  onNavigateToNext: () => void;
  onRandomPuzzle: () => void;
}

export function BrowseGameView({
  puzzleKey,
  currentPuzzleIndex,
  filteredPuzzles,
  previousPuzzleEntry,
  nextPuzzleEntry,
  onBackToBrowse,
  onNavigateToPrevious,
  onNavigateToNext,
  onRandomPuzzle,
}: BrowseGameViewProps) {
  return (
    <PageTransition variant="slide">
      <div className="space-y-6">
        <Card className="border-border/50">
          <CardContent className="p-4">
            {/* Mobile: Stacked layout */}
            <div className="flex flex-col gap-4 sm:hidden">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={onBackToBrowse}
                  className="gap-2 hover:gap-3 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Browse
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onRandomPuzzle}
                  className="gap-2"
                >
                  <Shuffle className="w-4 h-4" />
                  Random
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToPrevious}
                  disabled={!previousPuzzleEntry}
                  className="gap-1 flex-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md min-w-0 flex-shrink-0">
                  <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    {currentPuzzleIndex + 1} of {filteredPuzzles.length}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToNext}
                  disabled={!nextPuzzleEntry}
                  className="gap-1 flex-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Desktop: Horizontal layout */}
            <div className="hidden sm:flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={onBackToBrowse}
                className="gap-2 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Browse
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToPrevious}
                  disabled={!previousPuzzleEntry}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
                  <span className="text-sm font-medium text-muted-foreground">
                    {currentPuzzleIndex + 1} of {filteredPuzzles.length}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNavigateToNext}
                  disabled={!nextPuzzleEntry}
                  className="gap-1"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={onRandomPuzzle}
                className="gap-2"
              >
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">Random</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Game key={puzzleKey} mode="practice" autoLoad={false} />
      </div>
    </PageTransition>
  );
}
