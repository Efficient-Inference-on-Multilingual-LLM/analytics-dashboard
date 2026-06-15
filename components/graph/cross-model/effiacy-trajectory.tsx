"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Data } from "plotly.js";
import { ModelComponentSeries } from "@/types/dto";
import {
  BASE_LAYOUT,
  metricLabel,
  COMPONENT_COLORS,
} from "@/lib/graph/trajectory";
import { mean } from "lodash";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface EfficacyTrajectoryChartProps {
  blocks: ModelComponentSeries[];
  modelId: string;
  modelLabel: string;
  codes: string[];
  method: string;
}

export default function EfficacyChart({
  blocks,
  modelId,
  modelLabel,
  codes,
  method,
}: EfficacyTrajectoryChartProps) {
  const traces = useMemo<Data[]>(() => {
    return blocks.flatMap((block) => {
      const color = COMPONENT_COLORS[block.component_id] ?? "#888";
      const x = block.depth;

      const meanY = x.map((_, i) => {
        const vals = codes
          .map((c) => block.series[c]?.[i])
          .filter((v): v is number => v != null && !Number.isNaN(v));
        return vals.length ? mean(vals) : null;
      });

      const stdY = x.map((_, i) => {
        const vals = codes
          .map((c) => block.series[c]?.[i])
          .filter((v): v is number => v != null && !Number.isNaN(v));
        if (vals.length < 2) return 0;
        const mean_val = mean(vals);
        return Math.sqrt(mean(vals.map((v) => (v - mean_val) ** 2)));
      });

      const upper = meanY.map((m, i) => (m != null ? m + stdY[i] : null));
      const lower = meanY.map((m, i) => (m != null ? m - stdY[i] : null));
      const xRev = [...x].reverse();
      const lowerRev = [...lower].reverse();

      return [
        {
          x,
          y: meanY,
          type: "scatter" as const,
          mode: "lines" as const,
          name: block.component_id,
          line: { color, width: 2 },
          legendgroup: block.component_id,
          hovertemplate: `<b>${block.component_id}</b><br>${modelId}<br>Depth: %{x:.1f}%<br>Mean: %{y:.4f}<extra></extra>`,
        },
        {
          x: [...x, ...xRev],
          y: [...upper, ...lowerRev],
          type: "scatter" as const,
          mode: "lines" as const,
          fill: "toself" as const,
          fillcolor: color,
          opacity: 0.1,
          line: { width: 0 },
          showlegend: false,
          hoverinfo: "skip" as const,
          legendgroup: block.component_id,
        },
      ] as Data[];
    });
  }, [blocks, codes, modelId]);

  return (
    <Plot
      data={traces}
      layout={{
        ...BASE_LAYOUT,
        title: { text: `<b>${modelLabel}</b>: Extraction Point Efficacy` },
        xaxis: { title: { text: "Depth (%)" } },
        yaxis: {
          ...BASE_LAYOUT.yaxis,
          title: { text: `Average ${metricLabel(method)}` },
        },
        height: 450,
        showlegend: false,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%" }}
    />
  );
}
