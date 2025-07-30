import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Search, Filter, Target, Sparkles } from "lucide-react";
import { toTitleCase } from "@/lib/utils";
import { BrowsePuzzleListSection } from "./BrowsePuzzleListSection";
import type { PuzzleManifestEntry } from "@/types/game";

interface BrowseSearchAndPuzzleListProps {
  filteredPuzzles: PuzzleManifestEntry[];
  searchQuery: string;
  selectedCategory: string | null;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onPuzzleClick: (puzzle: PuzzleManifestEntry) => void;
}

export function BrowseSearchAndPuzzleList({
  filteredPuzzles,
  searchQuery,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
  onPuzzleClick,
}: BrowseSearchAndPuzzleListProps) {
  return (
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search puzzles..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-input"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) =>
                onCategoryChange(value === "all" ? null : value)
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

        <BrowsePuzzleListSection
          onPuzzleClick={onPuzzleClick}
        />
      </CardContent>
    </Card>
  );
}
