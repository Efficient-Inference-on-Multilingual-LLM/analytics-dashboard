"use client";

import React from "react";
import Section from "@/components/filter/section";
import MethodSelector from "@/components/filter/method-selector";
import ModelSelector from "@/components/filter/model-group";
import GroupBy from "@/components/filter/group-by";
import LinkageMethod from "@/components/filter/linkage-method";
import LayerSlider from "@/components/filter/layer-slider";
import LanguageFilters from "@/components/filter/language-filters";
import { useFilterStore } from "@/store/filter-store";
import { useModels } from "@/hooks/api/models";

const HeatmapFilter = () => {
  const layer = useFilterStore((state) => state.selectedLayerA);
  const setLayer = useFilterStore((state) => state.setSelectedLayerA);
  const selected_model = useFilterStore((state) => state.selectedModelA);
  const { data } = useModels();
  const model = data?.models.find((m) => m.id === selected_model);
  const maxLayer = model?.layer_count ? model.layer_count - 1 : 0;

  return (
    <Section title="Single Heatmap Filter">
      <MethodSelector />
      <ModelSelector label="Model" type="A" />
      <GroupBy />
      <LinkageMethod />
      <LayerSlider
        title="Layer"
        value={[layer ?? 0]}
        max={maxLayer}
        step={1}
        onChange={(value) => setLayer(value[0])}
        showLabel
        showTooltip
        formatValue={(v) => `${v}`}
        className="flex flex-col gap-2"
      />
      <LanguageFilters label="Language" />
    </Section>
  );
};

export default HeatmapFilter;
