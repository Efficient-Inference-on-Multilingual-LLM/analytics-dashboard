"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import SingleLayerHeatmap from "@/components/graph/single-layer-heatmap";
import SingleLayerDendogram from "@/components/graph/single-layer-dendogram";
import { useFilterStore } from "@/store/filter-store";
import { useMethods } from "@/hooks/api/methods";
import { useLanguageRegistry, useResultLanguages } from "@/hooks/api/languages";
import { applyFilters } from "@/lib/filter/language-filter";
import { useHeatmap } from "@/hooks/api/heatmap";
import { useDendogram } from "@/hooks/api/dendogram";

const HeatmapPage = () => {
  const { data: methods } = useMethods();

  const selectedModel = useFilterStore((state) => state.selectedModelA);
  const selectedMethod = useFilterStore((state) => state.selectedMethod);
  const selectedTopK = useFilterStore((state) => state.topK);
  const selectedComponent = useFilterStore((state) => state.selectedComponentA);
  const layer = useFilterStore((state) => state.selectedLayerA);
  const languageFilters = useFilterStore((state) => state.languageFilters);
  const method = methods?.methods.find((m) => m.id === selectedMethod);
  const groupBy = useFilterStore((state) => state.groupBy);
  const linkageMethod = useFilterStore((state) => state.selectedLinkageMethod);
  const clusterCutoff = useFilterStore((state) => state.selectedClusterCutoff);

  const languageRegistry = useLanguageRegistry();

  const languageReady =
    !!selectedMethod && !!selectedModel && !!selectedComponent;
  const languageRequest = languageReady
    ? {
        method_id: selectedMethod,
        model_id: selectedModel,
        component_id: selectedComponent,
      }
    : null;

  const { data: languages } = useResultLanguages(languageRequest);

  const effectiveLanguages = useMemo(() => {
    if (!languages) return [];
    return applyFilters(languages.languages, languageFilters)
      .effectiveLanguages;
  }, [languageFilters, languages]);

  const colorscale =
    methods?.methods.find((m) => m.id === selectedMethod)?.colorscale ||
    "Viridis";
  const heatmapReady =
    !!selectedModel &&
    !!selectedMethod &&
    !!selectedComponent &&
    effectiveLanguages.length > 0;
  const request = heatmapReady
    ? {
        method_id: selectedMethod,
        model_id: selectedModel,
        component_id: selectedComponent,
        layer_indices: layer != null ? [layer] : null,
        languages: effectiveLanguages,
        top_k: selectedTopK ? Number(selectedTopK) : null,
        sort_by: groupBy,
      }
    : null;

  const { data: heatmapData, isLoading: isHeatmapLoading } =
    useHeatmap(request);
  const layerData = heatmapData?.layers[0];
  const sortGroups = heatmapData?.sort_groups || [];

  const dendogramReady = heatmapReady && !!linkageMethod;
  const dendogramRequest = dendogramReady
    ? {
        method_id: selectedMethod!,
        model_id: selectedModel!,
        component_id: selectedComponent!,
        layer: layer!,
        languages: effectiveLanguages,
        sort_by: groupBy,
        linkage_method: linkageMethod,
        cluster_cutoff: clusterCutoff > 0 ? clusterCutoff / 100 : 0,
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
    <Section title="Single Heatmap Analysis">
      <div className="flex items-start justify-between">
        {layerData && (
          <SingleLayerHeatmap
            title={`${method?.label || selectedMethod} Heatmap`}
            languageRegistry={languageRegistry}
            className="w-2/3 min-w-0"
            data={layerData}
            colorScale={colorscale}
            showAxisLabels={true}
            sortGroups={sortGroups}
          />
        )}
        {dendogramData && (
          <SingleLayerDendogram
            title={`${method?.label || selectedMethod} Dendogram`}
            className="w-1/3 min-w-0"
            data={dendogramData}
            sortGroups={sortGroups}
            orientation="vertical"
            showLabels={true}
            languageRegistry={languageRegistry}
          />
        )}
      </div>
    </Section>
  );
};

export default HeatmapPage;
