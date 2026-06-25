"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import MethodSelector from "@/components/filter/method-selector";
import { useDifferenceHeatmapUrlState } from "@/hooks/url-state/states";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useComponents, useModels } from "@/hooks/api/models";
import { useMethods } from "@/hooks/api/methods";
import {
  DEFAULT_FILTERS,
  LanguageFilters as LangFilters,
} from "@/lib/filter/language-filter";
import { ModelDto } from "@/types/dto";
import LanguageFilters from "@/components/filter/language-filters";
import GroupBy from "@/components/filter/group-by";
import LayerSlider from "@/components/filter/layer-slider";

const LayerDifferenceFilter = () => {
  const [urlState, setUrlState] = useDifferenceHeatmapUrlState();
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

  const selectedSourceComponentObj =
    allComponents.find((comp) => comp.id === urlState.src_component) ?? null;

  const selectedTargetComponentObj =
    allComponents.find((comp) => comp.id === urlState.tgt_component) ?? null;

  const handleModelChange = (model: ModelDto | null) => {
    setUrlState({
      ...urlState,
      model: model ? model.id : null,
      src_layer: null,
      tgt_layer: null,
    });
  };

  const handleSourceComponentChange = (comp: { id: string } | null) => {
    setUrlState({ ...urlState, src_component: comp ? comp.id : null });
  };

  const handleTargetComponentChange = (comp: { id: string } | null) => {
    setUrlState({ ...urlState, tgt_component: comp ? comp.id : null });
  };

  return (
    <Section title="Layer Difference Filter">
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
      <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
        <Label className="text-sm px-1">Components</Label>
        <div>
          <Label className="text-sm px-1">Source Component</Label>
          <Combobox
            items={allComponents}
            value={selectedSourceComponentObj}
            onValueChange={handleSourceComponentChange}
          >
            <ComboboxInput placeholder="Select a component" showClear />
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
        <div>
          <Label className="text-sm px-1">Target Component</Label>
          <Combobox
            items={allComponents}
            value={selectedTargetComponentObj}
            onValueChange={handleTargetComponentChange}
          >
            <ComboboxInput placeholder="Select a component" showClear />
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
      </div>
      <GroupBy
        value={urlState.group_by ?? null}
        onChange={(groupBy) => setUrlState({ ...urlState, group_by: groupBy })}
      />
      <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
        <Label className="text-sm px-1">Layers</Label>
        <LayerSlider
          title="Source layer"
          value={[urlState.src_layer ?? 0]}
          max={maxLayer}
          min={0}
          step={1}
          onChange={(value) =>
            setUrlState({
              ...urlState,
              src_layer: value[0],
            })
          }
          showLabel
          showTooltip
          formatValue={(v) => `${v}`}
          className="flex flex-col gap-2"
        />
        <LayerSlider
          title="Target layer"
          value={[urlState.tgt_layer ?? 0]}
          max={maxLayer}
          min={0}
          step={1}
          onChange={(value) =>
            setUrlState({
              ...urlState,
              tgt_layer: value[0],
            })
          }
          showLabel
          showTooltip
          formatValue={(v) => `${v}`}
          className="flex flex-col gap-2"
        />
      </div>
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

export default LayerDifferenceFilter;
