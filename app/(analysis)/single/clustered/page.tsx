"use client";

import React from "react";
import Section from "@/components/filter/section";
import { useIndividualHeatmapUrlState } from "@/hooks/url-state/states";
import SortGroupLegend from "@/components/graph/sort-group-legend";
import { useIndividualHeatmap } from "@/hooks/api/heatmap";
import IndividualLanguagesHeatmap from "@/components/graph/single-layer/individual-language-heatmap";

const ClusteredHeatmapPage = () => {
  const [urlState] = useIndividualHeatmapUrlState();

  const ready =
    !!urlState.method &&
    !!urlState.model &&
    !!urlState.component &&
    !!urlState.mainLanguage;

  const request = ready
    ? {
        method: urlState.method!,
        model_id: urlState.model!,
        component_id: urlState.component!,
        main_language: urlState.mainLanguage!,
        languages: urlState.languages.length ? urlState.languages : undefined,
        sort_by: urlState.group_by,
        mode: "languages" as const,
        layer_range: urlState.layer_range as [number, number],
        top_k: urlState.top_k ? Number(urlState.top_k) : null,
      }
    : null;

  const { data: individualHeatmapData } = useIndividualHeatmap(request);
  const sortGroups = individualHeatmapData?.sort_groups ?? [];

  return (
    <Section
      title="Clustered Heatmap"
      pageKey="individualHeatmap"
      state={urlState}
    >
      <div className="flex justify-end">
        <SortGroupLegend groups={sortGroups} />
      </div>
      {individualHeatmapData && (
        <IndividualLanguagesHeatmap data={individualHeatmapData} />
      )}
    </Section>
  );
};

export default ClusteredHeatmapPage;
