"use client";

import React from "react";
import Section from "@/components/filter/section";
import { useDifferenceHeatmapUrlState } from "@/hooks/url-state/states";
import { useDifferenceHeatmap } from "@/hooks/api/heatmap";
import SortGroupLegend from "@/components/graph/sort-group-legend";
import DifferenceHeatmap from "@/components/graph/single-layer/difference-heatmap";

const LayerDifferencePage = () => {
  const [urlState] = useDifferenceHeatmapUrlState();

  const ready =
    !!urlState.method &&
    !!urlState.model &&
    !!urlState.src_component &&
    !!urlState.tgt_component;

  const request = ready
    ? {
        method: urlState.method!,
        model_id: urlState.model!,
        source_component_id: urlState.src_component!,
        target_component_id: urlState.tgt_component!,
        source_layer: urlState.src_layer!,
        target_layer: urlState.tgt_layer!,
        sort_by: urlState.group_by,
        languages: urlState.languages.length ? urlState.languages : undefined,
        top_k: urlState.top_k ? Number(urlState.top_k) : null,
      }
    : null;

  const { data: differenceData } = useDifferenceHeatmap(request);
  const sortGroups = differenceData?.sort_groups ?? [];

  return (
    <Section
      title="Layer Difference"
      pageKey="differenceHeatmap"
      state={urlState}
    >
      <div className="flex justify-end">
        <SortGroupLegend groups={sortGroups} />
      </div>
      {differenceData && (
        <div className="mt-4 flex justify-center">
          <DifferenceHeatmap data={differenceData} />
        </div>
      )}
    </Section>
  );
};

export default LayerDifferencePage;
