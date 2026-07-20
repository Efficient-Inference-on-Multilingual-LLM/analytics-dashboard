"use client";

import React from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export interface LayerSeries {
  label: string;
  layers: number[];
  rates: number[];
}

interface Props {
  series: LayerSeries[];
  height?: number;
}

const LayerDynamicsChart = ({ series, height = 380 }: Props) => (
  <Plot
    data={series.map((s) => ({
      type: "scatter",
      mode: "lines",
      name: s.label,
      x: s.layers,
      y: s.rates,
      hovertemplate: `${s.label}<br>layer %{x}<br>rate %{y:.3f}<extra></extra>`,
    }))}
    layout={{
      margin: { t: 10, l: 52, r: 10, b: 44 },
      height,
      xaxis: { title: { text: "layer" } },
      yaxis: { title: { text: "routing rate" }, rangemode: "tozero" },
      legend: { font: { size: 11 } },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
    }}
    config={{ displayModeBar: false, responsive: true }}
    style={{ width: "100%" }}
  />
);

export default LayerDynamicsChart;
