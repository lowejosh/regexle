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
  Trophy,
  Target,
  Sparkles,
} from "lucide-react";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DifficultyProgressCard, PuzzleListItem } from "./components";
import {
  usePuzzleBrowsing,
  usePuzzleProgress,
  usePuzzleSelection,
  type PuzzleManifestEntry,
} from "./BrowsePractice.hooks";
import { DIFFICULTY_COLORS } from "./BrowsePractice.consts";

export function BrowsePractice() {
  const { loadPuzzle } = useGameStore();

  // Use custom hooks for state management
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

  const { selectedPuzzle, puzzleKey, handlePuzzleSelect, handleBackToBrowse } =
    usePuzzleSelection();

  const handlePuzzleClick = async (puzzleEntry: PuzzleManifestEntry) => {
    const puzzle = await handlePuzzleSelect(puzzleEntry);
    if (puzzle) {
      loadPuzzle(puzzle);
    }
  };

  if (selectedPuzzle) {
    return (
      <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-10 duration-300">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handleBackToBrowse}
                className="gap-2 hover:gap-3 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Browse
              </Button>
              <div className="flex items-center gap-2">
                <Badge
                  className={cn(
                    DIFFICULTY_COLORS[selectedPuzzle.difficulty],
                    "px-3 py-1"
                  )}
                >
                  {toTitleCase(selectedPuzzle.difficulty)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedPuzzle.title}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Game key={puzzleKey} mode="random" autoLoad={false} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      {/* Difficulty Progress Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {DIFFICULTY_ORDER.map((difficulty) => {
          const progress = difficultyProgress[difficulty];

          return (
            <DifficultyProgressCard
              key={difficulty}
              difficulty={difficulty}
              completed={progress.completed}
              total={progress.total}
              color={DIFFICULTY_COLORS[difficulty]}
            />
          );
        })}
      </div>

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
                placeholder="Search puzzles by title or tags..."
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
                <SelectTrigger className="w-48">
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
                    className="w-full p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="transition-transform duration-200">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <Badge
                        className={cn(
                          DIFFICULTY_COLORS[difficulty],
                          "text-xs font-semibold px-3 py-1"
                        )}
                      >
                        {toTitleCase(difficulty)}
                      </Badge>
                      <span className="text-sm font-medium">
                        {puzzles.length} puzzles
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4" />
                        {completedCount} completed
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">
                        {Math.round((completedCount / puzzles.length) * 100)}%
                      </div>
                      <div className="w-24 bg-secondary rounded-full h-2 overflow-hidden">
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
                      <div className="max-h-96 overflow-y-auto">
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
