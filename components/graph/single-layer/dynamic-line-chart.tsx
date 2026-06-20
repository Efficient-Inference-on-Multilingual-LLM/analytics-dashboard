"use client";
import { useMemo } from "react";
import type { Data, Layout } from "plotly.js";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import type { DynamicTrajectoryResponse } from "@/types/response";

interface Props {
  data: DynamicTrajectoryResponse;
}

const DynamicLinesChart = ({ data }: Props) => {
  const traces = useMemo<Data[]>(() => {
    return data.series.map((s) => ({
      type: "scatter",
      mode: "lines+markers",
      name: s.name,
      x: data.x_labels,
      y: s.values,
      connectgaps: false,
      line: { color: s.color, width: 1 },
      marker: {
        symbol: data.markers,
        size: 7,
        color: s.color,
        line: { width: 0.5, color: "white" },
      },
      legendgroup: s.group,
      hovertemplate: `<b>${s.name}</b><br>%{x}<br>Value: %{y:.4f}<extra></extra>`,
    }));
  }, [data]);

  const isLape = data.method === "lape";

  const layout = useMemo<Partial<Layout>>(
    () => ({
      title: {
        text: `${data.metric_label} Trajectory`,
        x: 0.5,
        xanchor: "center",
      },
      height: 700,
      showlegend: false,
      hovermode: "closest",
      xaxis: {
        title: { text: "Network Depth" },
        tickangle: -90,
        tickmode: "array",
        tickvals: data.x_labels.map((_, i) => i),
        ticktext: data.x_labels,
        tickfont: {
          size: Math.max(
            5,
            Math.min(20, Math.round(20 - data.x_labels.length / 20)),
          ),
        },
      },
      yaxis: {
        title: { text: data.y_axis_label },
        tickformat: isLape ? ".2e" : undefined,
      },
      margin: { l: 60, r: 20, t: 50, b: 120 },
    }),
    [data, isLape],
  );

  return (
    <Plot
      data={traces}
      layout={layout}
      useResizeHandler
      style={{ width: "100%" }}
      config={{ displaylogo: false, displayModeBar: true }}
    />
  );
};

export default DynamicLinesChart;
