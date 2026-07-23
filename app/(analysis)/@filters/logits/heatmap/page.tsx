"use client";

import React from "react";
import Section from "@/components/filter/section";
import ModelRouter from "@/components/filter/model-router";
import { useLogitsHeatmapUrlState } from "@/hooks/url-state/states";
import LayerSlider from "@/components/filter/layer-slider";
import { useModelsRouter } from "@/hooks/api/models";

const LogitsHeatmapFilter = () => {
  const [logitsHeatmapState, setLogitsHeatmapState] =
    useLogitsHeatmapUrlState();
  const { data: modelsData } = useModelsRouter();
  const selectedModel = modelsData?.models.find(
    (m) => m.id === logitsHeatmapState.model,
  );
  const maxLayer = selectedModel ? selectedModel.layer_count - 1 : 0;

  return (
    <Section title="Logits Heatmap Filters">
      <ModelRouter
        selectedModel={logitsHeatmapState.model}
        setSelectedModel={(model) =>
          setLogitsHeatmapState({ ...logitsHeatmapState, model })
        }
      />
      <LayerSlider
        title="Layer"
        value={[logitsHeatmapState.layer ?? 0]}
        max={maxLayer}
        step={1}
        onChange={(value) =>
          setLogitsHeatmapState({ ...logitsHeatmapState, layer: value[0] })
        }
        showLabel
        showTooltip
        formatValue={(v) => `${v}`}
        className="flex flex-col gap-2"
      />
    </Section>
  );
};

export default LogitsHeatmapFilter;
