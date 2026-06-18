"use client";

import React from "react";
import Section from "@/components/filter/section";
import MethodSelector from "@/components/filter/method-selector";
import { useLayerTrendUrlState } from "@/hooks/url-state/states";
import MultiModelGroup from "@/components/filter/multimodel-group";
import MultiSelect from "@/components/ui/multi-select";
import { CLUSTERING_FACTORS } from "@/types/constant";

export const dynamic = "force-dynamic";

const ClusterPageFilter = () => {
  const [urlState, setUrlState] = useLayerTrendUrlState();
  return (
    <Section title="Cluster Trend Filter">
      <MethodSelector locked="Silhouette Score" />
      <MultiModelGroup
        label="Models & Components"
        methodId={urlState.method ?? null}
        selectedModels={urlState.models ?? []}
        setSelectedModels={(models) => setUrlState({ ...urlState, models })}
        selectedComponents={urlState.components ?? []}
        setSelectedComponents={(components) =>
          setUrlState({ ...urlState, components })
        }
      />
      <MultiSelect
        frameworks={CLUSTERING_FACTORS}
        label="Clustering Factors"
        placeholder="Select clustering factors"
        onValueChange={(items) =>
          setUrlState({ ...urlState, factor: items.map((item) => item.value) })
        }
        value={urlState.factor ?? []}
      />
    </Section>
  );
};

export default ClusterPageFilter;
