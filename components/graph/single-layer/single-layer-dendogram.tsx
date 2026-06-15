import React, { useMemo } from "react";
import Dendogram from "@/components/visualization/dendogram";
import { DendogramResponse } from "@/types/response";
import { LanguageGroupDto } from "@/types/dto";

interface SingleLayerDendogramProps {
  title: string;
  className?: string;
  data: DendogramResponse;
  sortGroups: LanguageGroupDto[];
  orientation: "vertical" | "horizontal";
  showLabels?: boolean;
  languageRegistry?: Map<string, string>;
}

function buildSegments(Z: number[][], leaf_order: number[]) {
  const n = leaf_order.length;
  const positions = new Map<number, { x: number; y: number }>();
  leaf_order.forEach((leafIdx, i) => {
    positions.set(leafIdx, { x: i, y: 0 });
  });

  const segments: { x: number[]; y: number[] }[] = [];
  Z.forEach(([idx1, idx2, dist], i) => {
    const newIdx = n + i;
    const pos1 = positions.get(idx1);
    const pos2 = positions.get(idx2);
    if (!pos1 || !pos2) return;

    segments.push({
      x: [pos1.x, pos1.x, pos2.x, pos2.x],
      y: [pos1.y, dist, dist, pos2.y],
    });

    positions.set(newIdx, { x: (pos1.x + pos2.x) / 2, y: dist });
  });

  return segments;
}

function buildLeafColorMap(
  sortGroups: LanguageGroupDto[],
): Map<string, string> {
  const map = new Map<string, string>();
  if (!sortGroups) return map;
  for (const group of sortGroups) {
    for (const lang of group.languages) {
      map.set(lang, group.color);
    }
  }
  return map;
}

const SingleLayerDendogram = ({
  title,
  className,
  data,
  sortGroups,
  orientation = "horizontal",
  showLabels = false,
  languageRegistry,
}: SingleLayerDendogramProps) => {
  const isHorizontal = orientation === "horizontal";

  const segments = useMemo(() => {
    return buildSegments(data.linkage_matrices, data.leaf_order);
  }, [data.linkage_matrices, data.leaf_order]);

  const leafColorMap = useMemo(() => {
    return buildLeafColorMap(sortGroups);
  }, [sortGroups]);

  const orderedLanguages = useMemo(() => {
    return data.leaf_order.map((idx) => data.languages[idx]);
  }, [data.languages, data.leaf_order]);

  const colotedLabels = useMemo(() => {
    return orderedLanguages.map((lang) => {
      const color = leafColorMap.get(lang);
      const displayName = languageRegistry?.get(lang) || lang;
      if (!color) return lang;
      return `<span style="color:${color}"><b>${displayName}</b></span>`;
    });
  }, [orderedLanguages, leafColorMap, languageRegistry]);

  const dendogramData = useMemo(() => {
    return segments.map((seg) => ({
      type: "scatter" as const,
      x: isHorizontal ? seg.x : seg.y,
      y: isHorizontal ? seg.y : seg.x,
      mode: "lines" as const,
      line: { color: "currentColor", width: 1 },
      hoverinfo: "none" as const,
      showLegend: false,
    }));
  }, [segments, isHorizontal]);

  const n = orderedLanguages.length;
  const leafAxis = {
    tickmode: "array" as const,
    tickvals: orderedLanguages.map((_, i) => i),
    ticktext: showLabels ? colotedLabels : [],
    tickfont: { size: 8, family: "monospace" },
    range: [-0.25, n - 0.25] as [number, number],
    showgrid: false,
    autorange: false,
  };

  return (
    <div className={className}>
      <Dendogram
        title={title}
        data={dendogramData}
        leafAxis={leafAxis}
        orientation={orientation}
      />
    </div>
  );
};

export default SingleLayerDendogram;
