"use client";

import { useComponents, useModels } from "@/hooks/api/models";
import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import { useLayerTrendUrlState } from "@/hooks/url-state/states";
import { useLayerTrend } from "@/hooks/api/trajectory";
import { CLUSTERING_FACTORS } from "@/types/constant";
import TrendPlot from "@/components/graph/cluster-trend/trend-plot";

const ClusterPage = () => {
  const { data: modelsData } = useModels();
  const { data: componentsData } = useComponents();
  const [urlState] = useLayerTrendUrlState();

  const trendReady =
    !!urlState.method &&
    urlState.models.length > 0 &&
    urlState.components.length > 0 &&
    urlState.factors.length > 0;

  const trendRequest = trendReady
    ? {
        method: urlState.method!,
        model_ids: urlState.models,
        component_ids: urlState.components,
        factors: urlState.factors,
      }
    : null;

  const { data, isLoading } = useLayerTrend(trendRequest);
  const traces = useMemo(() => {
    if (!data) return [];
    const modelLabel = (id: string) =>
      modelsData?.models.find((m) => m.id === id)?.label ?? id;
    const compLabel = (id: string) =>
      componentsData?.components.find((c) => c.id === id)?.label ?? id;
    const factorLabel = (v: string) =>
      CLUSTERING_FACTORS.find((f) => f.value === v)?.label ?? v;

    return data.lines.map((line) => ({
      name: `${factorLabel(line.factor)} Cluster at ${compLabel(
        line.component_id,
      )} — ${modelLabel(line.model_id)}`,
      x: line.layer_percentage,
      y: line.score,
    }));
  }, [data, modelsData, componentsData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Section
      title="Cluster Trend Analysis"
      pageKey="layerTrend"
      state={urlState}
    >
      {traces.length > 0 && (
        <>
          <TrendPlot traces={traces} />
        </>
      )}
    </Section>
  );
};

export default ClusterPage;
