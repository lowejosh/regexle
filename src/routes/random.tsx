import { createFileRoute } from "@tanstack/react-router";
import { RandomPuzzle } from "@/components/pages/RandomPuzzle";

export const Route = createFileRoute("/random")({
  component: RandomPuzzle,
});
