"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Data } from "plotly.js";
import { ModelComponentSeries, LanguageGroupDto } from "@/types/dto";
import { buildColorMap } from "@/lib/graph/trajectory";
import { LINE_DASHES, BASE_LAYOUT, metricLabel } from "@/lib/graph/trajectory";
import { useComponents } from "@/hooks/api/models";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface ComponentTrajectoryChartProps {
  blocks: ModelComponentSeries[];
  componentId: string;
  codes: string[];
  groups: LanguageGroupDto[] | null;
  codeToName: Record<string, string>;
  modelLabels: Record<string, string>;
  method: string;
}

export default function ComponentTrajectoryChart({
  blocks,
  componentId,
  codes,
  groups,
  codeToName,
  modelLabels,
  method,
}: ComponentTrajectoryChartProps) {
  const { data: componentData } = useComponents();
  const { codeToColor } = useMemo(
    () => buildColorMap(codes, groups),
    [codes, groups],
  );

  const componentLabel =
    componentData?.components.find((c) => c.id === componentId)?.label ??
    componentId;

  const traces = useMemo<Data[]>(() => {
    return blocks.flatMap((block, modelIdx) => {
      const dash = LINE_DASHES[modelIdx % LINE_DASHES.length];
      return codes
        .filter((c) => block.series[c]?.some((v) => v != null))
        .map((c) => ({
          x: block.depth,
          y: block.series[c],
          type: "scatter" as const,
          mode: "lines" as const,
          name: `${codeToName[c] ?? c} (${modelLabels[block.model_id] ?? block.model_id})`,
          line: { color: codeToColor[c], width: 1.5, dash },
          hovertemplate: `<b>${codeToName[c] ?? c}</b><br>${modelLabels[block.model_id]}<br>Depth: %{x:.1f}%<br>Value: %{y:.4f}<extra></extra>`,
        }));
    });
  }, [blocks, codes, codeToColor, codeToName, modelLabels]);

  return (
    <Plot
      data={traces}
      layout={{
        ...BASE_LAYOUT,
        title: { text: `<b>Component: ${componentLabel}</b>` },
        xaxis: { title: { text: "Depth (%)" } },
        yaxis: { ...BASE_LAYOUT.yaxis, title: { text: metricLabel(method) } },
        height: 400,
        showlegend: false,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%" }}
    />
  );
}