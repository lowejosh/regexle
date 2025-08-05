import { useState, useMemo } from "react";
import { puzzleLoader } from "@/data/puzzleLoader";
import { useStatisticsStore } from "@/store/statisticsStore";
import { useGameStore } from "@/store/gameStore";
import type { Puzzle, PuzzleManifestEntry } from "@/types/game";
import { DIFFICULTY_ORDER } from "./BrowsePractice.consts";

export function usePuzzleBrowsing() {
  const [expandedDifficulties, setExpandedDifficulties] = useState<Set<string>>(
    new Set(["easy"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { isPuzzleSolved } = useStatisticsStore();
  const { getCurrentDailyPuzzleId } = useGameStore();

  // Get current daily puzzle ID for filtering
  const currentDailyPuzzleId = getCurrentDailyPuzzleId();

  // Get all puzzle entries from manifest, excluding current daily puzzle
  const puzzleEntries = useMemo(() => {
    const allEntries =
      puzzleLoader.getPuzzleManifestEntries() as PuzzleManifestEntry[];
    return allEntries.filter((entry) => entry.id !== currentDailyPuzzleId);
  }, [currentDailyPuzzleId]);

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

  // Group puzzles by difficulty
  const groupedPuzzles = useMemo(() => {
    return DIFFICULTY_ORDER.reduce((acc, difficulty) => {
      acc[difficulty] = filteredPuzzles.filter(
        (p) => p.difficulty === difficulty
      );
      return acc;
    }, {} as Record<Puzzle["difficulty"], PuzzleManifestEntry[]>);
  }, [filteredPuzzles]);

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

  return {
    puzzleEntries,
    categories,
    filteredPuzzles,
    groupedPuzzles,
    expandedDifficulties,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    toggleDifficulty,
    isPuzzleSolved,
    DIFFICULTY_ORDER,
  };
}

export function usePuzzleProgress() {
  const { isPuzzleSolved, getTotalPuzzlesByDifficulty } = useStatisticsStore();
  const { getCurrentDailyPuzzleId } = useGameStore();

  // Get current daily puzzle ID for filtering
  const currentDailyPuzzleId = getCurrentDailyPuzzleId();

  const puzzleEntries = useMemo(() => {
    const allEntries =
      puzzleLoader.getPuzzleManifestEntries() as PuzzleManifestEntry[];
    return allEntries.filter((entry) => entry.id !== currentDailyPuzzleId);
  }, [currentDailyPuzzleId]);

  // Overall progress calculation
  const overallProgress = useMemo(() => {
    const total = puzzleEntries.length;
    const completed = puzzleEntries.filter((p) => isPuzzleSolved(p.id)).length;
    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [puzzleEntries, isPuzzleSolved]);

  const difficultyProgress = useMemo(() => {
    const totalsByDifficulty = getTotalPuzzlesByDifficulty();

    return DIFFICULTY_ORDER.reduce((acc, difficulty) => {
      const total = totalsByDifficulty[difficulty] || 0;
      const completed = puzzleEntries
        .filter((p) => p.difficulty === difficulty)
        .filter((p) => isPuzzleSolved(p.id)).length;

      acc[difficulty] = {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
      return acc;
    }, {} as Record<string, { total: number; completed: number; percentage: number }>);
  }, [puzzleEntries, isPuzzleSolved, getTotalPuzzlesByDifficulty]);

  return {
    overallProgress,
    difficultyProgress,
  };
}

export function usePuzzleSelection(filteredPuzzles?: PuzzleManifestEntry[]) {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [selectedPuzzleEntry, setSelectedPuzzleEntry] =
    useState<PuzzleManifestEntry | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);

  const puzzleEntries = useMemo(() => {
    return (
      filteredPuzzles ||
      (puzzleLoader.getPuzzleManifestEntries() as PuzzleManifestEntry[])
    );
  }, [filteredPuzzles]);

  const currentPuzzleIndex = useMemo(() => {
    if (!selectedPuzzleEntry) return -1;
    return puzzleEntries.findIndex(
      (entry) => entry.id === selectedPuzzleEntry.id
    );
  }, [puzzleEntries, selectedPuzzleEntry]);

  const previousPuzzleEntry = useMemo(() => {
    if (currentPuzzleIndex <= 0) return null;
    return puzzleEntries[currentPuzzleIndex - 1];
  }, [puzzleEntries, currentPuzzleIndex]);

  const nextPuzzleEntry = useMemo(() => {
    if (
      currentPuzzleIndex === -1 ||
      currentPuzzleIndex >= puzzleEntries.length - 1
    )
      return null;
    return puzzleEntries[currentPuzzleIndex + 1];
  }, [puzzleEntries, currentPuzzleIndex]);

  const handlePuzzleSelect = async (puzzleEntry: PuzzleManifestEntry) => {
    try {
      const puzzle = await puzzleLoader.loadPuzzle(puzzleEntry.id);
      if (puzzle) {
        setSelectedPuzzle(puzzle);
        setSelectedPuzzleEntry(puzzleEntry);
        setPuzzleKey((prev) => prev + 1);
        return puzzle;
      }
    } catch (error) {
      console.error("Failed to load puzzle:", error);
    }
    return null;
  };

  const handleNavigateToPuzzle = async (puzzleEntry: PuzzleManifestEntry) => {
    const puzzle = await handlePuzzleSelect(puzzleEntry);
    return puzzle;
  };

  const handleBackToBrowse = () => {
    setSelectedPuzzle(null);
    setSelectedPuzzleEntry(null);
  };

  return {
    selectedPuzzle,
    selectedPuzzleEntry,
    puzzleKey,
    currentPuzzleIndex,
    previousPuzzleEntry,
    nextPuzzleEntry,
    handlePuzzleSelect,
    handleNavigateToPuzzle,
    handleBackToBrowse,
  };
}
