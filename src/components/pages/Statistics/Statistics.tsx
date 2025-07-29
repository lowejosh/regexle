import {
  StatsOverview,
  DifficultyBreakdown,
  PerformanceChart,
  RecentActivity,
  AchievementHighlights,
  DifficultyRadar,
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
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <AchievementHighlights />
      </div>
      <DifficultyRadar />
    </PageLayout>
  );
}
