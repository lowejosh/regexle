import { useState, useMemo } from "react";
import { puzzleLoader } from "@/data/puzzleLoader";
import { useStatisticsStore } from "@/store/statisticsStore";
import type { Puzzle } from "@/types/game";
import { DIFFICULTY_ORDER } from "./BrowsePractice.consts";

export interface PuzzleManifestEntry {
  id: string;
  title: string;
  difficulty: Puzzle["difficulty"];
  category: string;
  tags: string[];
  summary: string;
}

export function usePuzzleBrowsing() {
  const [expandedDifficulties, setExpandedDifficulties] = useState<Set<string>>(
    new Set(["easy"])
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { isPuzzleSolved } = useStatisticsStore();

  // Get all puzzle entries from manifest
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
  const puzzleEntries = useMemo(() => {
    return puzzleLoader.getPuzzleManifestEntries() as PuzzleManifestEntry[];
  }, []);

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

  // Difficulty-based progress using statistics store
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

export function usePuzzleSelection() {
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null);
  const [puzzleKey, setPuzzleKey] = useState(0);

  const handlePuzzleSelect = async (puzzleEntry: PuzzleManifestEntry) => {
    try {
      const puzzle = await puzzleLoader.loadPuzzle(puzzleEntry.id);
      if (puzzle) {
        setSelectedPuzzle(puzzle);
        setPuzzleKey((prev) => prev + 1);
        return puzzle;
      }
    } catch (error) {
      console.error("Failed to load puzzle:", error);
    }
    return null;
  };

  const handleBackToBrowse = () => {
    setSelectedPuzzle(null);
  };

  return {
    selectedPuzzle,
    puzzleKey,
    handlePuzzleSelect,
    handleBackToBrowse,
  };
}
