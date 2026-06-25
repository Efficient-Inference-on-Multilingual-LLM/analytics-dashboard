"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import SingleLayerHeatmap from "@/components/graph/single-layer/single-layer-heatmap";
import SingleLayerDendogram from "@/components/graph/single-layer/single-layer-dendogram";
import ClusterList from "@/components/graph/single-layer/cluster-list";
import SortGroupLegend from "@/components/graph/sort-group-legend";
import { useMethods } from "@/hooks/api/methods";
import { useLanguageRegistry, useResultLanguages } from "@/hooks/api/languages";
import { applyFilters } from "@/lib/filter/language-filter";
import { useHeatmap } from "@/hooks/api/heatmap";
import { useDendogram } from "@/hooks/api/dendogram";
import { useHeatmapUrlState } from "@/hooks/url-state/states";

export const dynamic = "force-dynamic";

const HeatmapPage = () => {
  const { data: methods } = useMethods();
  const [urlState] = useHeatmapUrlState();
  const languageRegistry = useLanguageRegistry();

  const method = methods?.methods.find((m) => m.id === urlState.method);
  const colorScale = method?.colorscale || "Viridis";

  const languageReady =
    !!urlState.method && !!urlState.model && !!urlState.component;
  const languageRequest = languageReady
    ? {
        method_id: urlState.method as string,
        model_id: urlState.model as string,
        component_id: urlState.component as string,
        top_k:
          urlState.method === "lape" && urlState.top_k
            ? Number(urlState.top_k)
            : null,
      }
    : null;
  const { data: languages } = useResultLanguages(languageRequest);

  const languageFilters = useMemo(
    () => ({
      regions: urlState.regions,
      families: urlState.families,
      subfamilies: urlState.subfamilies,
      subsubfamilies: urlState.subsubfamilies,
      scripts: urlState.scripts,
      syntaxes: urlState.syntaxes,
      vocabs: urlState.vocabs,
      phonetics: urlState.phonetics,
      joshiClasses: urlState.joshiClasses,
      languages: urlState.languages,
    }),
    [urlState],
  );

  const effectiveLanguages = useMemo(() => {
    if (!languages) return [];
    return applyFilters(languages.languages, languageFilters)
      .effectiveLanguages;
  }, [languageFilters, languages]);

  const heatmapReady =
    !!urlState.method &&
    !!urlState.model &&
    !!urlState.component &&
    effectiveLanguages.length > 0;
  const request = heatmapReady
    ? {
        method_id: urlState.method as string,
        model_id: urlState.model as string,
        component_id: urlState.component as string,
        layer_indices: urlState.layer != null ? [urlState.layer] : null,
        languages: effectiveLanguages,
        top_k:
          urlState.method === "lape" && urlState.top_k
            ? Number(urlState.top_k)
            : null,
        sort_by: urlState.group_by,
      }
    : null;

  const { data: heatmapData, isLoading: isHeatmapLoading } =
    useHeatmap(request);
  const layerData = heatmapData?.layers[0];
  const sortGroups = heatmapData?.sort_groups || [];

  const dendogramReady = heatmapReady && !!urlState.linkage;
  const dendogramRequest = dendogramReady
    ? {
        method_id: urlState.method as string,
        model_id: urlState.model as string,
        component_id: urlState.component as string,
        layer: urlState.layer as number,
        languages: effectiveLanguages,
        sort_by: urlState.group_by,
        linkage_method: urlState.linkage as string,
        cluster_cutoff:
          urlState.cluster_cutoff > 0 ? urlState.cluster_cutoff / 100 : 0,
        top_k:
          urlState.method === "lape" && urlState.top_k
            ? Number(urlState.top_k)
            : null,
      }
    : null;
  const { data: dendogramData, isLoading: isDendogramLoading } =
    useDendogram(dendogramRequest);

  if (isHeatmapLoading || isDendogramLoading) {
    return (
      <Section title="Single Heatmap Analysis">
        <div>Loading...</div>
      </Section>
    );
  }

  return (
    <Section title="Single Heatmap Analysis" pageKey="heatmap" state={urlState}>
      <div className="flex justify-end">
        <SortGroupLegend groups={sortGroups} />
      </div>
      <div className="flex items-start justify-between">
        {layerData && (
          <SingleLayerHeatmap
            title={`${method?.label || urlState.method} Heatmap`}
            languageRegistry={languageRegistry}
            className="w-2/3 min-w-0"
            data={layerData}
            colorScale={colorScale}
            showAxisLabels={true}
            sortGroups={sortGroups}
          />
        )}
        {dendogramData && (
          <SingleLayerDendogram
            title={`${method?.label || urlState.method} Dendogram`}
            className="w-1/3 min-w-0"
            data={dendogramData}
            sortGroups={sortGroups}
            orientation="vertical"
            showLabels={true}
            languageRegistry={languageRegistry}
          />
        )}
      </div>
      {dendogramData?.clusters && (
        <ClusterList
          clusters={dendogramData.clusters}
          languageRegistry={languageRegistry}
        />
      )}
    </Section>
  );
};

export default HeatmapPage;
