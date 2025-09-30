import {
  StatsOverview,
  DifficultyBreakdown,
  PerformanceChart,
} from "./components";
import { PageLayout } from "@/components/ui";

export function Statistics() {
  return (
    <PageLayout showHeader={false} spacing="normal">
      <StatsOverview />
      <div className="grid gap-6 lg:grid-cols-2">
        <DifficultyBreakdown />
        <PerformanceChart />
      </div>
    </PageLayout>
  );
}
