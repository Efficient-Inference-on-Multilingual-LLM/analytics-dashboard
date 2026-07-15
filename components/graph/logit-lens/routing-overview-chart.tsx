"use client";

import React from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export interface RoutingBar {
  code: string;
  label: string;
  joshi: number;
  rate: number;
  n: number;
}

interface RoutingOverviewChartProps {
  bars: RoutingBar[];
  height?: number;
}

const RoutingOverviewChart = ({ bars, height = 360 }: RoutingOverviewChartProps) => (
  <Plot
    data={[
      {
        type: "bar",
        x: bars.map((b) => b.label),
        y: bars.map((b) => b.rate),
        marker: { color: "#0f6e56" },
        customdata: bars.map((b) => [b.joshi, b.n]),
        hovertemplate:
          "<b>%{x}</b><br>rate %{y:.3f}<br>joshi class %{customdata[0]}" +
          "<br>%{customdata[1]} positions<extra></extra>",
      },
    ]}
    layout={{
      margin: { t: 10, l: 52, r: 10, b: 90 },
      height,
      yaxis: { title: { text: "routing rate" }, rangemode: "tozero" },
      xaxis: { tickangle: -40 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    }}
    config={{ displayModeBar: false, responsive: true }}
    style={{ width: "100%" }}
  />
);

export default RoutingOverviewChart;