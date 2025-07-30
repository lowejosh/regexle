import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface BrowseOverallProgressCardProps {
  completed: number;
  total: number;
}

export function BrowseOverallProgressCard({ completed, total }: BrowseOverallProgressCardProps) {
  return (
    <Card className="sm:hidden border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Overall Progress
          </span>
          <Badge variant="secondary" className="text-xs">
            {completed}/{total} completed
          </Badge>
        </div>
        <div className="mt-2 w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-700"
            style={{
              width: `${
                total > 0 ? (completed / total) * 100 : 0
              }%`,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
