import {
  StatsOverview,
  DifficultyBreakdown,
  PerformanceChart,
  RecentActivity,
  AchievementHighlights,
  CompletionTimeline,
  DifficultyRadar,
} from "./components";

export function Statistics() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          Your Statistics
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Track your regex mastery journey with detailed insights and
          performance metrics
        </p>
      </div>

      {/* Overview Cards */}
      <StatsOverview />

      {/* Timeline */}
      <CompletionTimeline />

      {/* Charts and Detailed Breakdowns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DifficultyBreakdown />
        <PerformanceChart />
      </div>

      {/* Skill Visualization */}
      <DifficultyRadar />

      {/* Additional Stats Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity />
        <AchievementHighlights />
      </div>
    </div>
  );
}
