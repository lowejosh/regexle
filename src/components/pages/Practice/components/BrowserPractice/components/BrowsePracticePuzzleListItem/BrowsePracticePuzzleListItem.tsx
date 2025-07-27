import { Badge } from "@/components/ui/Badge";
import { toTitleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Hash, Bookmark } from "lucide-react";

interface PuzzleManifestEntry {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  tags: string[];
  summary: string;
}

interface PuzzleListItemProps {
  puzzle: PuzzleManifestEntry;
  isCompleted: boolean;
  onClick: () => void;
}

export function PuzzleListItem({
  puzzle,
  isCompleted,
  onClick,
}: PuzzleListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-5 text-left hover:bg-accent transition-all duration-200",
        "group relative overflow-hidden",
        isCompleted && "bg-muted/30"
      )}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start gap-4">
        {/* Completion indicator */}
        <div className="pt-0.5">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground/50" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Title and summary */}
          <div className="space-y-1">
            <h4
              className={cn(
                "font-semibold text-base group-hover:text-primary transition-colors",
                isCompleted && "text-muted-foreground"
              )}
            >
              {puzzle.title}
            </h4>
            {puzzle.summary && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {puzzle.summary}
              </p>
            )}
          </div>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs gap-1 border-border/70">
              <Bookmark className="w-3 h-3" />
              {toTitleCase(puzzle.category)}
            </Badge>

            {puzzle.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs gap-1">
                <Hash className="w-3 h-3" />
                {toTitleCase(tag)}
              </Badge>
            ))}

            {puzzle.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{puzzle.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Hover indicator */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="text-sm text-muted-foreground">→</div>
        </div>
      </div>
    </button>
  );
}
