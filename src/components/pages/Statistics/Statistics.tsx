import {
  StatsOverview,
  DifficultyBreakdown,
  PerformanceChart,
  RecentActivity,
  AchievementHighlights,
  DifficultyRadar,
} from "./components";

export function Statistics() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
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
    </div>
  );
}
