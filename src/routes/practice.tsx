import { createFileRoute } from "@tanstack/react-router";
import { PracticePage } from "@/components/pages/Practice";

export const Route = createFileRoute("/practice")({
  component: PracticePage,
});
