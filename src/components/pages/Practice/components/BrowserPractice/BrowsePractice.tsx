import { useState, useMemo } from "react";
import { Game } from "@/components/pages/Game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { puzzleLoader } from "@/data/puzzleLoader";
import { useGameStore } from "@/store/gameStore";
import { useStatisticsStore } from "@/store/statisticsStore";
import type { Puzzle } from "@/types/game";
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
    new Set(["easy"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { isPuzzleSolved } = useStatisticsStore();
  const { loadPuzzle } = useGameStore();

  const puzzleEntries = useMemo(() => {
    return puzzleLoader.getPuzzleManifestEntries() as PuzzleManifestEntry[];
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const categorySet = new Set(puzzleEntries.map((p) => p.category));
    return Array.from(categorySet).sort();
  }, [puzzleEntries]);

  // Filter puzzles based on search and category
  const filteredPuzzles = useMemo(() => {
    return puzzleEntries.filter((puzzle) => {
      const matchesSearch =
        searchQuery === "" ||
        puzzle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        puzzle.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        !selectedCategory || puzzle.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [puzzleEntries, searchQuery, selectedCategory]);

  const groupedPuzzles = useMemo(() => {
    return DIFFICULTY_ORDER.reduce((acc, difficulty) => {
      acc[difficulty] = filteredPuzzles.filter(
        (p) => p.difficulty === difficulty
      );
      return acc;
    }, {} as Record<Puzzle["difficulty"], PuzzleManifestEntry[]>);
  }, [filteredPuzzles]);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const total = puzzleEntries.length;
    const completed = puzzleEntries.filter((p) => isPuzzleSolved(p.id)).length;
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [puzzleEntries, isPuzzleSolved]);

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
      {/* Overall Progress Card - Compressed */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Trophy className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Your Progress</h2>
                <p className="text-sm text-muted-foreground">
                  {overallProgress.completed} of {overallProgress.total} puzzles
                  completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {overallProgress.percentage}%
                </div>
                <div className="text-xs text-muted-foreground">Complete</div>
              </div>
              <div className="w-32">
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${overallProgress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Progress Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {DIFFICULTY_ORDER.map((difficulty) => {
          const total = groupedPuzzles[difficulty].length;
          const completed = groupedPuzzles[difficulty].filter((p) =>
            isPuzzleSolved(p.id)
          ).length;

          return (
            <DifficultyProgressCard
              key={difficulty}
              difficulty={difficulty}
              completed={completed}
              total={total}
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
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {toTitleCase(cat)}
                  </option>
                ))}
              </select>
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
                              onClick={() => handlePuzzleSelect(puzzle)}
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
