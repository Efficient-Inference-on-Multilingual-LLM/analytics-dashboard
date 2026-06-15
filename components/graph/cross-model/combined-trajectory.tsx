"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Data } from "plotly.js";
import { ModelComponentSeries } from "@/types/dto";
import { COMPONENT_COLORS } from "@/lib/graph/trajectory";
import { LINE_DASHES, BASE_LAYOUT, metricLabel } from "@/lib/graph/trajectory";
import { mean } from "lodash";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

export default function CombinedChart({
  data,
  codes,
  modelLabels,
  method,
}: {
  data: ModelComponentSeries[];
  codes: string[];
  modelLabels: Record<string, string>;
  method: string;
}) {
  const modelOrder = useMemo(
    () => [...new Set(data.map((b) => b.model_id))],
    [data],
  );

  const traces = useMemo<Data[]>(() => {
    return data.flatMap((block) => {
      const color = COMPONENT_COLORS[block.component_id] ?? "#888";
      const dash =
        LINE_DASHES[modelOrder.indexOf(block.model_id) % LINE_DASHES.length];
      const x = block.depth;
      const traceName = `${modelLabels[block.model_id] ?? block.model_id} — ${block.component_id}`;

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
        const mean_value = mean(vals);
        return Math.sqrt(mean(vals.map((v) => (v - mean_value) ** 2)));
      });

      const upper = meanY.map((m, i) => (m != null ? m + stdY[i] : null));
      const lower = meanY.map((m, i) => (m != null ? m - stdY[i] : null));
      const xRev = [...x].reverse();

      return [
        {
          x,
          y: meanY,
          type: "scatter" as const,
          mode: "lines" as const,
          name: traceName,
          line: { color, width: 2, dash },
          legendgroup: traceName,
          hovertemplate: `<b>${traceName}</b><br>Depth: %{x:.1f}%<br>Mean: %{y:.4f}<extra></extra>`,
        },
        {
          x: [...x, ...xRev],
          y: [...upper, ...lower.reverse()],
          type: "scatter" as const,
          mode: "lines" as const,
          fill: "toself" as const,
          fillcolor: color,
          opacity: 0.05,
          line: { width: 0 },
          showlegend: false,
          hoverinfo: "skip" as const,
          legendgroup: traceName,
        },
      ] as Data[];
    });
  }, [data, codes, modelOrder, modelLabels]);

  return (
    <Plot
      data={traces}
      layout={{
        ...BASE_LAYOUT,
        title: { text: "<b>Combined Extraction Point Efficacy</b>" },
        xaxis: { title: { text: "Depth (%)" } },
        yaxis: {
          ...BASE_LAYOUT.yaxis,
          title: { text: `Average ${metricLabel(method)}`, standoff: 20 },
          automargin: true,
        },
        height: 550,
        showlegend: false,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%" }}
    />
  );
}
