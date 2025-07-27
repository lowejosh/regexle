import {
  StatsOverview,
  DifficultyBreakdown,
  PerformanceChart,
} from "./components";

export function Statistics() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Your Statistics
        </h1>
        <p className="text-muted-foreground">
          Track your regex puzzle solving progress and achievements
        </p>
      </div>

      {/* Overview Cards */}
      <StatsOverview />

      {/* Charts and Detailed Breakdowns */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DifficultyBreakdown />
        <PerformanceChart />
      </div>
    </div>
  );
}
