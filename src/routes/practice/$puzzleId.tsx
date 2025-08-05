import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useGameStore } from "@/store/gameStore";
import { puzzleLoader } from "@/data/puzzleLoader";
import { useEffect, useState, useMemo } from "react";
import { PageLayout } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { BrowseGameView } from "@/components/pages/Practice/components/BrowsePractice/components/BrowseGameView";
import type { PuzzleManifestEntry } from "@/types/game";

function PracticePuzzlePage() {
  const params = Route.useParams();
  const puzzleId = params.puzzleId;
  const navigate = useNavigate();
  const { loadPuzzle, currentPuzzle, currentMode, getCurrentDailyPuzzleId } =
    useGameStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);

  // Get all practice puzzles (excluding daily puzzle)
  const practiceEntries = useMemo(() => {
    const currentDailyPuzzleId = getCurrentDailyPuzzleId();
    const allEntries =
      puzzleLoader.getPuzzleManifestEntries() as PuzzleManifestEntry[];
    return allEntries.filter((entry) => entry.id !== currentDailyPuzzleId);
  }, [getCurrentDailyPuzzleId]);

  // Find current puzzle in the list
  const currentPuzzleIndex = useMemo(() => {
    return practiceEntries.findIndex((entry) => entry.id === puzzleId);
  }, [practiceEntries, puzzleId]);

  // Get previous and next puzzle entries
  const previousPuzzleEntry = useMemo(() => {
    if (currentPuzzleIndex <= 0) return null;
    return practiceEntries[currentPuzzleIndex - 1];
  }, [practiceEntries, currentPuzzleIndex]);

  const nextPuzzleEntry = useMemo(() => {
    if (
      currentPuzzleIndex === -1 ||
      currentPuzzleIndex >= practiceEntries.length - 1
    )
      return null;
    return practiceEntries[currentPuzzleIndex + 1];
  }, [practiceEntries, currentPuzzleIndex]);

  const handleBackToPractice = () => {
    navigate({ to: "/practice" });
  };

  const handleNavigateToPrevious = () => {
    if (previousPuzzleEntry) {
      navigate({
        to: "/practice/$puzzleId",
        params: { puzzleId: previousPuzzleEntry.id },
      });
    }
  };

  const handleNavigateToNext = () => {
    if (nextPuzzleEntry) {
      navigate({
        to: "/practice/$puzzleId",
        params: { puzzleId: nextPuzzleEntry.id },
      });
    }
  };

  const handleRandomPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * practiceEntries.length);
    const randomPuzzle = practiceEntries[randomIndex];
    if (randomPuzzle && randomPuzzle.id !== puzzleId) {
      navigate({
        to: "/practice/$puzzleId",
        params: { puzzleId: randomPuzzle.id },
      });
    }
  };

  useEffect(() => {
    const loadPuzzleFromUrl = async () => {
      if (!puzzleId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Check if this is the current daily puzzle (anti-cheat)
        const currentDailyPuzzleId = puzzleLoader.getCurrentDailyPuzzleId();
        if (puzzleId === currentDailyPuzzleId) {
          setError(
            "This puzzle is today's daily puzzle. Please play it in the Daily section!"
          );
          setIsLoading(false);
          return;
        }

        // Load the puzzle if it's not already loaded or if it's a different puzzle
        if (
          !currentPuzzle ||
          currentPuzzle.id !== puzzleId ||
          currentMode !== "practice"
        ) {
          const puzzle = await puzzleLoader.loadPuzzle(puzzleId);
          if (puzzle) {
            loadPuzzle(puzzle);
            setPuzzleKey((prev) => prev + 1); // Force re-render of Game component
          } else {
            setError(`Puzzle "${puzzleId}" not found.`);
          }
        }
      } catch (err) {
        console.error("Failed to load puzzle:", err);
        setError("Failed to load puzzle. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPuzzleFromUrl();
  }, [puzzleId, loadPuzzle, currentPuzzle, currentMode]);

  if (isLoading) {
    return (
      <PageLayout
        title="Loading Puzzle..."
        description="Loading your regex puzzle"
      >
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading puzzle...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !currentPuzzle) {
    return (
      <PageLayout title="Puzzle Error" description="Unable to load puzzle">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={handleBackToPractice}>
              ← Back to Practice
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showHeader={false}>
      <BrowseGameView
        puzzleKey={puzzleKey}
        currentPuzzleIndex={currentPuzzleIndex}
        filteredPuzzles={practiceEntries}
        previousPuzzleEntry={previousPuzzleEntry}
        nextPuzzleEntry={nextPuzzleEntry}
        onBackToBrowse={handleBackToPractice}
        onNavigateToPrevious={handleNavigateToPrevious}
        onNavigateToNext={handleNavigateToNext}
        onRandomPuzzle={handleRandomPuzzle}
      />
    </PageLayout>
  );
}

export const Route = createFileRoute("/practice/$puzzleId")({
  component: PracticePuzzlePage,
});
