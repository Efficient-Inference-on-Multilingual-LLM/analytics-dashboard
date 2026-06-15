"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { Data, Dash } from "plotly.js";
import { ModelComponentSeries, LanguageGroupDto } from "@/types/dto";
import { buildColorMap } from "@/lib/graph/trajectory";
import { LINE_DASHES, BASE_LAYOUT, metricLabel } from "@/lib/graph/trajectory";
import { useComponents } from "@/hooks/api/models";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const CARD_WIDTH = 600;

interface ComponentTrajectoryChartProps {
  blocks: ModelComponentSeries[];
  componentId: string;
  codes: string[];
  groups: LanguageGroupDto[] | null;
  codeToName: Record<string, string>;
  modelLabels: Record<string, string>;
  method: string;
}

function ModelChart({
  block,
  codes,
  codeToColor,
  codeToName,
  modelLabel,
  method,
  dash,
}: {
  block: ModelComponentSeries;
  codes: string[];
  codeToColor: Record<string, string>;
  codeToName: Record<string, string>;
  modelLabel: string;
  method: string;
  dash: Dash;
}) {
  const traces = useMemo<Data[]>(() => {
    return codes
      .filter((c) => block.series[c]?.some((v) => v != null))
      .map((c) => ({
        x: block.depth,
        y: block.series[c],
        type: "scatter" as const,
        mode: "lines" as const,
        name: codeToName[c] ?? c,
        line: { color: codeToColor[c], width: 1.5, dash },
        hovertemplate: `<b>${codeToName[c] ?? c}</b><br>Depth: %{x:.1f}%<br>Value: %{y:.4f}<extra></extra>`,
      }));
  }, [block, codes, codeToColor, codeToName, dash]);

  return (
    <Plot
      data={traces}
      layout={{
        ...BASE_LAYOUT,
        title: { text: `<b>${modelLabel}</b>` },
        xaxis: { title: { text: "Depth (%)" } },
        yaxis: {
          ...BASE_LAYOUT.yaxis,
          title: { text: metricLabel(method), standoff: 20 },
          automargin: true,
        },
        height: 400,
        showlegend: false,
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler
    />
  );
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

  const modelOrder = useMemo(
    () => [...new Set(blocks.map((b) => b.model_id))],
    [blocks],
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-semibold">
        Component: <span className="text-foreground">{componentLabel}</span>
      </p>

      <div className="flex gap-3 overflow-x-auto no-scrollbar rounded-lg border border-border p-2 snap-x snap-mandatory">
        {modelOrder.map((modelId) => {
          const block = blocks.find((b) => b.model_id === modelId);
          if (!block) return null;
          const globalIdx = modelOrder.indexOf(modelId);
          const dash = LINE_DASHES[globalIdx % LINE_DASHES.length];
          return (
            <div
              key={modelId}
              className="flex-none snap-start rounded-lg border border-border/60 bg-card p-3"
              style={{ width: CARD_WIDTH, height: 450 }}
            >
              <ModelChart
                block={block}
                codes={codes}
                codeToColor={codeToColor}
                codeToName={codeToName}
                modelLabel={modelLabels[modelId] ?? modelId}
                method={method}
                dash={dash}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
