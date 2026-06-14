"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import MethodSelector from "@/components/filter/method-selector";
import ModelSelector from "@/components/filter/model-group";
import GroupBy from "@/components/filter/group-by";
import LinkageMethod from "@/components/filter/linkage-method";
import LayerSlider from "@/components/filter/layer-slider";
import LanguageFilters from "@/components/filter/language-filters";
import { useModels } from "@/hooks/api/models";
import {
  DEFAULT_FILTERS,
  LanguageFilters as LangFilters,
} from "@/lib/filter/language-filter";
import { useHeatmapUrlState } from "@/hooks/url-state/states";

export const dynamic = "force-dynamic";

const HeatmapFilter = () => {
  const [urlState, setUrlState] = useHeatmapUrlState();
  const { data } = useModels();
  const model = data?.models.find((m) => m.id === urlState.model);
  const maxLayer = model?.layer_count ? model.layer_count - 1 : 0;

  const langFilters: LangFilters = useMemo(
    () => ({
      regions: urlState.regions ?? DEFAULT_FILTERS.regions,
      families: urlState.families ?? DEFAULT_FILTERS.families,
      subfamilies: urlState.subfamilies ?? DEFAULT_FILTERS.subfamilies,
      subsubfamilies: urlState.subsubfamilies ?? DEFAULT_FILTERS.subsubfamilies,
      scripts: urlState.scripts ?? DEFAULT_FILTERS.scripts,
      syntaxes: urlState.syntaxes ?? DEFAULT_FILTERS.syntaxes,
      vocabs: urlState.vocabs ?? DEFAULT_FILTERS.vocabs,
      phonetics: urlState.phonetics ?? DEFAULT_FILTERS.phonetics,
      joshiClasses: urlState.joshiClasses ?? DEFAULT_FILTERS.joshiClasses,
      languages: urlState.languages ?? DEFAULT_FILTERS.languages,
    }),
    [urlState],
  );

  return (
    <Section title="Single Heatmap Filter">
      <MethodSelector
        selectedMethod={urlState.method ?? null}
        onMethodChange={(method) =>
          setUrlState({ ...urlState, method: method as typeof urlState.method })
        }
        selectedTopK={urlState.top_k ?? null}
        onTopKChange={(topK) => setUrlState({ ...urlState, top_k: topK })}
      />
      <ModelSelector
        label="Model"
        selectedModel={urlState.model ?? null}
        setSelectedModel={(model) => setUrlState({ ...urlState, model: model })}
        selectedComponent={urlState.component ?? null}
        setSelectedComponent={(component) =>
          setUrlState({ ...urlState, component: component })
        }
      />
      <GroupBy
        value={urlState.group_by ?? null}
        onChange={(groupBy) => setUrlState({ ...urlState, group_by: groupBy })}
      />
      <LinkageMethod
        value={urlState.linkage ?? null}
        clusterCutoff={urlState.cluster_cutoff ?? null}
        onChange={(linkageMethod) =>
          setUrlState({ ...urlState, linkage: linkageMethod })
        }
        onClusterCutoffChange={(cutoff) =>
          setUrlState({ ...urlState, cluster_cutoff: cutoff })
        }
      />
      <LayerSlider
        title="Layer"
        value={[urlState.layer ?? 0]}
        max={maxLayer}
        step={1}
        onChange={(value) => setUrlState({ ...urlState, layer: value[0] })}
        showLabel
        showTooltip
        formatValue={(v) => `${v}`}
        className="flex flex-col gap-2"
      />
      <LanguageFilters
        label="Language"
        method={(urlState.method ?? undefined) as string | null}
        model={urlState.model ?? undefined}
        component={urlState.component ?? undefined}
        filters={langFilters}
        onChange={(patch) => setUrlState({ ...urlState, ...patch })}
        onReset={() => setUrlState({ ...urlState, ...DEFAULT_FILTERS })}
      />
    </Section>
  );
};

export default HeatmapFilter;
