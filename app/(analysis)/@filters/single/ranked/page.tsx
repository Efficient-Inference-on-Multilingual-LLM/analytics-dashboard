"use client";

import { useIndividualHeatmapRankUrlState } from "@/hooks/url-state/states";
import { useModels } from "@/hooks/api/models";
import {
  DEFAULT_FILTERS,
  LanguageFilters as LangFilters,
} from "@/lib/filter/language-filter";
import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import MethodSelector from "@/components/filter/method-selector";
import ModelSelector from "@/components/filter/model-group";
import GroupBy from "@/components/filter/group-by";
import PivotLanguage from "@/components/filter/pivot-language";
import LanguageFilters from "@/components/filter/language-filters";
import LayerSlider from "@/components/filter/layer-slider";
import { useResultLanguages } from "@/hooks/api/languages";

const RankedHeatmapFilter = () => {
  const [urlState, setUrlState] = useIndividualHeatmapRankUrlState();
  const { data: modelsData } = useModels();
  const model = modelsData?.models.find((m) => m.id === urlState.model);
  const maxLayer = model?.layer_count ? model.layer_count - 1 : 0;

  const ready = !!urlState.method && !!urlState.model && !!urlState.component;
  const request = ready
    ? {
        method_id: urlState.method!,
        model_id: urlState.model!,
        component_id: urlState.component!,
      }
    : null;
  const { data: languageData } = useResultLanguages(request);
  const languageCount = languageData?.total ?? 0;

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
    <Section title="Ranked Heatmap Filter">
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
        methodId={urlState.method ?? null}
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
      <PivotLanguage
        method={urlState.method ?? null}
        modelIds={urlState.model ? [urlState.model] : []}
        componentIds={urlState.component ? [urlState.component] : []}
        topK={urlState.top_k ?? null}
        value={urlState.mainLanguage ?? null}
        onChange={(mainLanguage) => setUrlState({ ...urlState, mainLanguage })}
      />

      <LayerSlider
        title="Rank Range"
        value={urlState.rank_range ?? [1, languageCount]}
        max={languageCount}
        min={1}
        step={1}
        onChange={(value) =>
          setUrlState({
            ...urlState,
            rank_range: value,
          })
        }
        showLabel
        showTooltip
        formatValue={(v) => `${v}`}
        className="flex flex-col gap-2"
      />

      <LayerSlider
        title="Layer Range"
        value={urlState.layer_range ?? [0, maxLayer]}
        max={maxLayer}
        min={0}
        step={1}
        onChange={(value) =>
          setUrlState({
            ...urlState,
            layer_range: value,
          })
        }
        showLabel
        showTooltip
        formatValue={(v) => `${v}`}
        className="flex flex-col gap-2"
      />

      <LanguageFilters
        label="Language"
        model={null}
        component={null}
        method={(urlState.method ?? undefined) as string | null}
        filters={langFilters}
        onChange={(patch) => setUrlState({ ...urlState, ...patch })}
        onReset={() => setUrlState({ ...urlState, ...DEFAULT_FILTERS })}
      />
    </Section>
  );
};

export default RankedHeatmapFilter;
