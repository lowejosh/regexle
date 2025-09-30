import { Badge } from "@/components/ui/Badge";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PuzzleManifestEntry } from "@/types/game";
import { CheckCircle2, Circle, Hash, Bookmark } from "lucide-react";
interface PuzzleListItemProps {
  puzzle: PuzzleManifestEntry;
  isCompleted: boolean;
  onClick: () => void;
}

export function BrowsePuzzleListItem({
  puzzle,
  isCompleted,
  onClick,
}: PuzzleListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 sm:p-5 text-left hover:bg-accent transition-all duration-200",
        "group relative overflow-hidden",
        isCompleted && "bg-muted/30"
      )}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start gap-3 sm:gap-4">
        {/* Completion indicator */}
        <div className="pt-0.5 flex-shrink-0">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground/50" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2 min-w-0">
          {/* Title and summary */}
          <div className="space-y-1">
            <h4 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
              {puzzle.title}
            </h4>
            {puzzle.summary && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {puzzle.summary}
              </p>
            )}
          </div>

          {/* Meta information - responsive layout */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Badge variant="outline" className="text-xs gap-1 border-border/70">
              <Bookmark className="w-3 h-3" />
              {toTitleCase(puzzle.category)}
            </Badge>

            {/* Show fewer tags on mobile */}
            {puzzle.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs gap-1">
                <Hash className="w-3 h-3" />
                {toTitleCase(tag)}
              </Badge>
            ))}

            {/* Show additional tags on larger screens */}
            <div className="hidden sm:contents">
              {puzzle.tags.slice(2, 3).map((tag, index) => (
                <Badge
                  key={index + 2}
                  variant="secondary"
                  className="text-xs gap-1"
                >
                  <Hash className="w-3 h-3" />
                  {toTitleCase(tag)}
                </Badge>
              ))}
            </div>

            {puzzle.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{puzzle.tags.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Hover indicator */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
          <div className="text-sm text-muted-foreground">→</div>
        </div>
      </div>
    </button>
  );
}
