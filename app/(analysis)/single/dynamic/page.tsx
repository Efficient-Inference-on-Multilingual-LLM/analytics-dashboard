"use client";

import React from "react";
import { useDynamicTrajectoryUrlState } from "@/hooks/url-state/states";
import Section from "@/components/filter/section";
import SortGroupLegend from "@/components/graph/sort-group-legend";
import { useDynamicTrajectory } from "@/hooks/api/trajectory";
import DynamicLinesChart from "@/components/graph/single-layer/dynamic-line-chart";

const DynamicHeatmapPage = () => {
  const [urlState] = useDynamicTrajectoryUrlState();

  const ready =
    !!urlState.method && !!urlState.model && urlState.components.length > 0;

  const request = ready
    ? {
        method: urlState.method!,
        model_id: urlState.model!,
        component_ids: urlState.components,
        languages: urlState.languages.length ? urlState.languages : undefined,
        layer_range: urlState.layer_range as [number, number],
        top_k: urlState.top_k ? Number(urlState.top_k) : null,
        sort_by: urlState.group_by,
      }
    : null;

  const { data: dynamicTrajectoryData } = useDynamicTrajectory(request);
  const sortGroups = dynamicTrajectoryData?.groups ?? [];

  return (
    <Section
      title="Dynamic Heatmap"
      pageKey="dynamicTrajectory"
      state={urlState}
    >
      <div className="flex justify-end">
        <SortGroupLegend groups={sortGroups} />
      </div>
      {dynamicTrajectoryData && (
        <div className="mt-4">
          <DynamicLinesChart data={dynamicTrajectoryData} />
        </div>
      )}
    </Section>
  );
};

export default DynamicHeatmapPage;
