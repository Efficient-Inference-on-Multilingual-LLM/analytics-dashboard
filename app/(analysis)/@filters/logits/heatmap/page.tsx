"use client";

import React from "react";
import Section from "@/components/filter/section";
import ModelRouter from "@/components/filter/model-router";
import { useLogitsHeatmapUrlState } from "@/hooks/url-state/states";

const LogitsHeatmapFilter = () => {
  const [logitsHeatmapState, setLogitsHeatmapState] =
    useLogitsHeatmapUrlState();

  return (
    <Section title="Logits Heatmap Filters">
      <ModelRouter
        selectedModel={logitsHeatmapState.model}
        setSelectedModel={(model) =>
          setLogitsHeatmapState({ ...logitsHeatmapState, model })
        }
      />
    </Section>
  );
};

export default LogitsHeatmapFilter;
