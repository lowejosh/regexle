import { useGameStore } from "@/store/gameStore";
import { BrowseDifficultyProgressCard, BrowseGameView, BrowseOverallProgressCard, BrowseSearchAndPuzzleList } from "./components";
import {
  usePuzzleBrowsing,
  usePuzzleProgress,
  usePuzzleSelection,
} from "./BrowsePractice.hooks";
import type { PuzzleManifestEntry } from "@/types/game";

export function BrowsePractice() {
  const { loadPuzzle } = useGameStore();

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

  const {
    selectedPuzzle,
    puzzleKey,
    currentPuzzleIndex,
    previousPuzzleEntry,
    nextPuzzleEntry,
    handlePuzzleSelect,
    handleNavigateToPuzzle,
    handleBackToBrowse,
  } = usePuzzleSelection(filteredPuzzles);

  const handlePuzzleClick = async (puzzleEntry: PuzzleManifestEntry) => {
    const puzzle = await handlePuzzleSelect(puzzleEntry);
    if (puzzle) {
      loadPuzzle(puzzle);
    }
  };

  const handleNavigateToNext = async () => {
    if (nextPuzzleEntry) {
      const puzzle = await handleNavigateToPuzzle(nextPuzzleEntry);
      if (puzzle) {
        loadPuzzle(puzzle);
      }
    }
  };

  const handleNavigateToPrevious = async () => {
    if (previousPuzzleEntry) {
      const puzzle = await handleNavigateToPuzzle(previousPuzzleEntry);
      if (puzzle) {
        loadPuzzle(puzzle);
      }
    }
  };

  const handleRandomPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
    const randomPuzzle = filteredPuzzles[randomIndex];
    if (randomPuzzle && randomPuzzle.id !== selectedPuzzle?.id) {
      handlePuzzleClick(randomPuzzle);
    }
  };

  if (selectedPuzzle) {
    return (
      <BrowseGameView
        puzzleKey={puzzleKey}
        currentPuzzleIndex={currentPuzzleIndex}
        filteredPuzzles={filteredPuzzles}
        previousPuzzleEntry={previousPuzzleEntry}
        nextPuzzleEntry={nextPuzzleEntry}
        onBackToBrowse={handleBackToBrowse}
        onNavigateToPrevious={handleNavigateToPrevious}
        onNavigateToNext={handleNavigateToNext}
        onRandomPuzzle={handleRandomPuzzle}
      />
    );
  }

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
