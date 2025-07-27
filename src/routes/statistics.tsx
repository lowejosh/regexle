import { createFileRoute } from "@tanstack/react-router";
import { Statistics } from "../components/pages";

export const Route = createFileRoute("/statistics")({
  component: () => <Statistics />,
});
