import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/pages/Game";

export const Route = createFileRoute("/")({
  component: Game,
});
