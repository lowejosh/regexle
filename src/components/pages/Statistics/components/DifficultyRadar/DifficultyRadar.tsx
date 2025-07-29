import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useStatisticsStore } from "@/store/statisticsStore";
import { Card } from "@/components/ui/Card";
import { Radar } from "lucide-react";

export function DifficultyRadar() {
  const svgRef = useRef<SVGSVGElement>(null);
  const getCompletionRateByDifficulty = useStatisticsStore(
    (state) => state.getCompletionRateByDifficulty
  );

  useEffect(() => {
    if (!svgRef.current) return;

    const completionRates = getCompletionRateByDifficulty();

    const data = [
      { axis: "Easy", value: completionRates.easy / 100 },
      { axis: "Medium", value: completionRates.medium / 100 },
      { axis: "Hard", value: completionRates.hard / 100 },
      { axis: "Expert", value: completionRates.expert / 100 },
      { axis: "Nightmare", value: completionRates.nightmare / 100 },
    ];

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;
    const angleSlice = (Math.PI * 2) / data.length;

    const svg = d3.select(svgRef.current).attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Scales
    const rScale = d3.scaleLinear().domain([0, 1]).range([0, radius]);

    // Draw grid circles
    const levels = 5;
    for (let level = 0; level < levels; level++) {
      const levelFactor = radius * ((level + 1) / levels);

      g.append("circle")
        .attr("r", levelFactor)
        .style("stroke", "hsl(var(--border))")
        .style("fill", "none")
        .style("stroke-opacity", 0.5);
    }

    // Draw axes
    const axis = g
      .selectAll(".axis")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (_, i) => rScale(1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (_, i) => rScale(1) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "hsl(var(--border))")
      .style("stroke-width", "1px");

    axis
      .append("text")
      .attr("x", (_, i) => rScale(1.2) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (_, i) => rScale(1.2) * Math.sin(angleSlice * i - Math.PI / 2))
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("class", "text-sm fill-foreground")
      .text((d) => d.axis);

    // Draw data polygon
    const radarLine = d3
      .lineRadial<{ axis: string; value: number }>()
      .radius((d) => rScale(d.value))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(data)
      .attr("d", radarLine)
      .style("stroke", "hsl(var(--primary))")
      .style("stroke-width", 2)
      .style("fill", "hsl(var(--primary))")
      .style("fill-opacity", 0.2);

    // Draw data points
    g.selectAll(".radar-point")
      .data(data)
      .enter()
      .append("circle")
      .attr(
        "cx",
        (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
      )
      .attr("r", 4)
      .style("fill", "hsl(var(--primary))");
  }, [getCompletionRateByDifficulty]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Skill Radar</h2>
        <Radar className="h-5 w-5 text-muted-foreground" />
      </div>

      <svg ref={svgRef} className="w-full" />

      <p className="text-sm text-muted-foreground mt-4">
        Your completion rate across all difficulty levels
      </p>
    </Card>
  );
}
