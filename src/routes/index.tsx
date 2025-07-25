import { createFileRoute } from "@tanstack/react-router";
import { DailyPuzzle } from "@/components/pages/DailyPuzzle";

export const Route = createFileRoute("/")({
  component: DailyPuzzle,
});
