"use client";

import { useIndividualHeatmapRankUrlState } from "@/hooks/url-state/states";
import Section from "@/components/filter/section";
import React from "react";
import { useIndividualHeatmap } from "@/hooks/api/heatmap";
import SortGroupLegend from "@/components/graph/sort-group-legend";
import IndividualPerLayerHeatmap from "@/components/graph/single-layer/individual-per-layer-heatmap";

const RankedHeatmapPage = () => {
  const [urlState] = useIndividualHeatmapRankUrlState();

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
        mode: "per-layer" as const,
        layer_range: urlState.layer_range as [number, number],
        rank_range: urlState.rank_range as [number, number],
        top_k: urlState.top_k ? Number(urlState.top_k) : null,
      }
    : null;

  const { data: individualHeatmapRankData } = useIndividualHeatmap(request);
  const sortGroups = individualHeatmapRankData?.sort_groups ?? [];

  return (
    <Section
      title="Ranked Heatmap"
      pageKey="individualHeatmapRank"
      state={urlState}
    >
      <div className="flex justify-end">
        <SortGroupLegend groups={sortGroups} />
      </div>
      {individualHeatmapRankData && (
        <IndividualPerLayerHeatmap data={individualHeatmapRankData} />
      )}
    </Section>
  );
};

export default RankedHeatmapPage;
