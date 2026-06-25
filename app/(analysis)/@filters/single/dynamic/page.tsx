"use client";

import React, { useMemo } from "react";
import { useDynamicTrajectoryUrlState } from "@/hooks/url-state/states";
import { useModels } from "@/hooks/api/models";
import {
  DEFAULT_FILTERS,
  LanguageFilters as LangFilters,
} from "@/lib/filter/language-filter";
import Section from "@/components/filter/section";
import MethodSelector from "@/components/filter/method-selector";
import LanguageFilters from "@/components/filter/language-filters";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useMethods } from "@/hooks/api/methods";
import { useComponents } from "@/hooks/api/models";
import { ModelDto } from "@/types/dto";
import GroupBy from "@/components/filter/group-by";
import MultiSelect from "@/components/ui/multi-select";
import LayerSlider from "@/components/filter/layer-slider";
import PivotLanguage from "@/components/filter/pivot-language";

const DynamicPageFilter = () => {
  const [urlState, setUrlState] = useDynamicTrajectoryUrlState();
  const { data: modelsData } = useModels();
  const { data: methodsData } = useMethods();
  const { data: componentsData } = useComponents();
  const selectedMethodObj =
    methodsData?.methods.find((method) => method.id === urlState.method) ??
    null;

  const allowed_models = new Set(
    (selectedMethodObj?.models ?? []).map((model) => model.id),
  );
  const allModels = (modelsData?.models ?? []).filter((model) =>
    allowed_models.has(model.id),
  );

  const allowed_comp = new Set(
    (selectedMethodObj?.components ?? []).map((component) => component.id),
  );
  const allComponents = (componentsData?.components ?? []).filter((comp) =>
    allowed_comp.has(comp.id),
  );
  const model = modelsData?.models.find((m) => m.id === urlState.model);
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

  const selectedModelObj =
    allModels.find((model) => model.id === urlState.model) ?? null;

  const handleModelChange = (model: ModelDto | null) => {
    setUrlState({
      ...urlState,
      model: model ? model.id : null,
      layer_range: null,
    });
  };

  return (
    <Section title="Dynamic Trajectory Filter">
      <MethodSelector
        selectedMethod={urlState.method ?? null}
        onMethodChange={(method) =>
          setUrlState({ ...urlState, method: method as typeof urlState.method })
        }
        selectedTopK={urlState.top_k ?? null}
        onTopKChange={(topK) => setUrlState({ ...urlState, top_k: topK })}
      />
      <div>
        <Label className="text-sm px-1">Model</Label>
        <Combobox
          items={allModels}
          value={selectedModelObj}
          onValueChange={handleModelChange}
        >
          <ComboboxInput placeholder="Select a model" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.id} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <MultiSelect
        frameworks={allComponents.map((comp) => ({
          value: comp.id,
          label: comp.label,
        }))}
        label="Components to Compare"
        placeholder="Select components to compare"
        onValueChange={(items) =>
          setUrlState({
            ...urlState,
            components: items.map((item) => item.value),
          })
        }
        value={urlState.components ?? []}
      />
      <PivotLanguage
        method={urlState.method ?? null}
        modelIds={urlState.model ? [urlState.model] : []}
        componentIds={urlState.components ?? []}
        topK={urlState.top_k ?? null}
        value={urlState.mainLanguage ?? null}
        onChange={(mainLanguage) => setUrlState({ ...urlState, mainLanguage })}
      />
      <LayerSlider
        title="Rank Range"
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

      <GroupBy
        value={urlState.group_by ?? null}
        onChange={(groupBy) => setUrlState({ ...urlState, group_by: groupBy })}
      />
      <LanguageFilters
        label="Language"
        model={null}
        component={null}
        method={(urlState.method ?? undefined) as string | null}
        topK={urlState.top_k ?? null}
        filters={langFilters}
        onChange={(patch) => setUrlState({ ...urlState, ...patch })}
        onReset={() => setUrlState({ ...urlState, ...DEFAULT_FILTERS })}
      />
    </Section>
  );
};

export default DynamicPageFilter;
