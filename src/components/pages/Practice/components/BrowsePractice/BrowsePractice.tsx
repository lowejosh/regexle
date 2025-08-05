import { useNavigate } from "@tanstack/react-router";
import { BrowseDifficultyProgressCard, BrowseOverallProgressCard, BrowseSearchAndPuzzleList } from "./components";
import {
  usePuzzleBrowsing,
  usePuzzleProgress,
} from "./BrowsePractice.hooks";
import type { PuzzleManifestEntry } from "@/types/game";

export function BrowsePractice() {
  const navigate = useNavigate();

  const {
    filteredPuzzles,
    searchQuery,
    selectedCategory,
    categories,
    setSearchQuery,
    setSelectedCategory,
    DIFFICULTY_ORDER,
  } = usePuzzleBrowsing();

  const { overallProgress, difficultyProgress } = usePuzzleProgress();

  const handlePuzzleClick = (puzzleEntry: PuzzleManifestEntry) => {
    navigate({
      to: "/practice/$puzzleId",
      params: { puzzleId: puzzleEntry.id },
    });
  };

  return (
    <div className="space-y-6">
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-5 gap-4">
        {DIFFICULTY_ORDER.map((difficulty) => {
          const progress = difficultyProgress[difficulty];

          return (
            <BrowseDifficultyProgressCard
              key={difficulty}
              difficulty={difficulty}
              completed={progress.completed}
              total={progress.total}
            />
          );
        })}
      </div>

      <BrowseOverallProgressCard
        completed={overallProgress.completed}
        total={overallProgress.total}
      />

      <BrowseSearchAndPuzzleList
        filteredPuzzles={filteredPuzzles}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        categories={categories}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onPuzzleClick={handlePuzzleClick}
      />
    </div>
  );
}
