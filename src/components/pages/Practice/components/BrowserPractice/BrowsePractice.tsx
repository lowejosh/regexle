import { Game } from "@/components/pages/Game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useGameStore } from "@/store/gameStore";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  ArrowLeft,
  Target,
  Sparkles,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Shuffle,
} from "lucide-react";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DifficultyProgressCard, PuzzleListItem } from "./components";
import { PageTransition } from "@/components/ui";
import {
  usePuzzleBrowsing,
  usePuzzleProgress,
  usePuzzleSelection,
} from "./BrowsePractice.hooks";
import { DIFFICULTY_COLORS } from "./BrowsePractice.consts";
import type { PuzzleManifestEntry } from "@/types/game";

export function BrowsePractice() {
  const { loadPuzzle } = useGameStore();

  const {
    filteredPuzzles,
    groupedPuzzles,
    expandedDifficulties,
    searchQuery,
    selectedCategory,
    categories,
    setSearchQuery,
    setSelectedCategory,
    toggleDifficulty,
    isPuzzleSolved,
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

  if (selectedPuzzle) {
    return (
      <PageTransition variant="slide">
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* Left: Back button */}
                <Button
                  variant="ghost"
                  onClick={handleBackToBrowse}
                  className="gap-2 hover:gap-3 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Browse
                </Button>

                {/* Center: Navigation controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNavigateToPrevious}
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
                    onClick={handleNavigateToNext}
                    disabled={!nextPuzzleEntry}
                    className="gap-1"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                </div>

                {/* Right: Random puzzle button */}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const randomIndex = Math.floor(
                      Math.random() * filteredPuzzles.length
                    );
                    const randomPuzzle = filteredPuzzles[randomIndex];
                    if (randomPuzzle && randomPuzzle.id !== selectedPuzzle.id) {
                      handlePuzzleClick(randomPuzzle);
                    }
                  }}
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

  return (
    <div className="space-y-6">
      {/* Difficulty Progress Grid - Hidden on mobile, compact on tablet */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-5 gap-4">
        {DIFFICULTY_ORDER.map((difficulty) => {
          const progress = difficultyProgress[difficulty];

          return (
            <DifficultyProgressCard
              key={difficulty}
              difficulty={difficulty}
              completed={progress.completed}
              total={progress.total}
            />
          );
        })}
      </div>

      {/* Mobile Progress Summary - Compact overview for mobile only */}
      <Card className="sm:hidden border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </span>
            <Badge variant="secondary" className="text-xs">
              {overallProgress.completed}/{overallProgress.total} completed
            </Badge>
          </div>
          <div className="mt-2 w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700"
              style={{
                width: `${
                  overallProgress.total > 0
                    ? (overallProgress.completed / overallProgress.total) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-5 h-5" />
              Browse Puzzles
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              {filteredPuzzles.length} puzzles
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search puzzles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value) =>
                  setSelectedCategory(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {toTitleCase(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Puzzle List */}
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

                      {/* Mobile: Show condensed info */}
                      <div className="sm:hidden flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                        <span className="truncate">
                          {completedCount}/{puzzles.length}
                        </span>
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
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
                  {isExpanded && (
                    <CardContent className="!p-0 border-t border-border/50">
                      <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                        <div className="divide-y divide-border/50">
                          {puzzles.map((puzzle) => (
                            <PuzzleListItem
                              key={puzzle.id}
                              puzzle={puzzle}
                              isCompleted={isPuzzleSolved(puzzle.id)}
                              onClick={() => handlePuzzleClick(puzzle)}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
