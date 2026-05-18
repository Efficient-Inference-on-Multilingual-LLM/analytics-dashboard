"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import SingleLayerHeatmap from "@/components/graph/single-layer-heatmap";
import Dendogram from "@/components/visualization/dendogram";
import { useFilterStore } from "@/store/filter-store";
import { useMethods } from "@/hooks/api/methods";
import { useLanguages } from "@/hooks/api/languages";
import { applyFilters } from "@/lib/filter/language-filter";
import { useHeatmap } from "@/hooks/api/heatmap";

const HeatmapPage = () => {
  const { data: methods } = useMethods();
  const { data: languages } = useLanguages();

  const selectedModel = useFilterStore((state) => state.selectedModelA);
  const selectedMethod = useFilterStore((state) => state.selectedMethod);
  const selectedTopK = useFilterStore((state) => state.topK);
  const selectedComponent = useFilterStore((state) => state.selectedComponentA);
  const layer = useFilterStore((state) => state.selectedLayerA);
  const languageFilters = useFilterStore((state) => state.languageFilters);
  const method = methods?.methods.find((m) => m.id === selectedMethod);
  const groupBy = useFilterStore((state) => state.groupBy);

  const languageRegistry = useMemo(() => {
    if (!languages) return new Map<string, string>();
    const map = new Map<string, string>();
    languages.languages.forEach((lang) => {
      map.set(lang.code, lang.name);
    });
    return map;
  }, [languages]);

  const effectiveLanguages = useMemo(() => {
    if (!languages) return [];
    return applyFilters(languages.languages, languageFilters)
      .effectiveLanguages;
  }, [languageFilters, languages]);

  const colorscale =
    methods?.methods.find((m) => m.id === selectedMethod)?.colorscale ||
    "Viridis";
  const ready =
    !!selectedModel &&
    !!selectedMethod &&
    !!selectedComponent &&
    effectiveLanguages.length > 0;
  const request = ready
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

  const { data, isLoading, error } = useHeatmap(request);
  const layerData = data?.layers[0];
  const sortGroups = data?.sort_groups || [];

  return (
    <Section title="Single Heatmap Analysis">
      <div className="flex gap-3 items-center justify-between">
        {layerData && (
          <SingleLayerHeatmap
            title={`${method?.label || selectedMethod} Heatmap`}
            languageRegistry={languageRegistry}
            className="w-1/2"
            data={layerData}
            colorScale={colorscale}
            showAxisLabels={true}
            sortGroups={sortGroups}
            height={800}
          />
        )}
        <Dendogram
          title={`${method?.label || selectedMethod} Dendogram`}
          className="w-1/2"
        />
      </div>
    </Section>
  );
};

export default HeatmapPage;
