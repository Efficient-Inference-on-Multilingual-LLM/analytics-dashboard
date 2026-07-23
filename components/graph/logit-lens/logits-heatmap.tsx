"use client";

import React from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface Props {
  z: number[][];
  sources: string[];
  pivots: string[];
  height?: number;
}

const PivotMatrixChart = ({ z, sources, pivots, height = 420 }: Props) => (
  <Plot
    data={[
      {
        type: "heatmap",
        z,
        x: pivots,
        y: sources,
        zmin: 0,
        zmax: 1,
        colorscale: [
          [0, "#f1efe8"],
          [1, "#0f6e56"],
        ],
        hovertemplate: "%{y} → %{x}<br>rate %{z:.3f}<extra></extra>",
      },
    ]}
    layout={{
      margin: { t: 10, l: 90, r: 10, b: 90 },
      height,
      xaxis: {
        title: { text: "decoded (pivot) language" },
        tickangle: -40,
        automargin: true,
      },
      yaxis: {
        title: { text: "source language", standoff: 20 },
        autorange: "reversed",
        automargin: true,
      },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    }}
    config={{ displayModeBar: false, responsive: true }}
    style={{ width: "100%" }}
  />
);

export default PivotMatrixChart;
