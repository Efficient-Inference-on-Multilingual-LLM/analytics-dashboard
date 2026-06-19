"use client";

import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import React from "react";

interface TrendPlotProps {
  traces: {
    name: string;
    x: number[];
    y: number[];
  }[];
  height?: number;
}

const TrendPlot = ({ traces, height = 500 }: TrendPlotProps) => {
  return (
    <Plot
      data={traces.map((t) => ({
        type: "scatter",
        mode: "lines+markers",
        name: t.name,
        x: t.x,
        y: t.y,
        line: { width: 2 },
        marker: { size: 6 },
        hovertemplate:
          `${t.name}` +
          "<br>Layer %{x:.1f}%" +
          "<br>Score: %{y:.4f}<extra></extra>",
      }))}
      layout={{
        title: {
          text: "Cluster Representation Performance Across Layers",
          x: 0.5,
          xanchor: "center",
        },
        xaxis: { title: { text: "Processing Phase (Layer Normalized) (%)" } },
        yaxis: { title: { text: "Silhouette Score" } },
        height,
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: { color: "currentColor" },
        legend: {
          orientation: "v",
          x: 1.02,
          y: 1,
          xanchor: "left",
          bgcolor: "rgba(0,0,0,0)",
          bordercolor: "var(--border)",
          borderwidth: 1,
          font: { size: 11 },
        },
        margin: { l: 60, r: 220, t: 60, b: 60 },
      }}
      useResizeHandler
      style={{ width: "100%" }}
      config={{ displaylogo: false, responsive: true }}
    />
  );
};

export default TrendPlot;
