"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import ModelRouter from "@/components/filter/model-router";
import MultiPicker from "@/components/ui/multi-picker";
import { useRoutingOverviewUrlState } from "@/hooks/url-state/states";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useRoutingLanguage } from "@/hooks/api/languages";
import { useModelsRouter } from "@/hooks/api/models";
import LayerSlider from "@/components/filter/layer-slider";

const LogitsRoutingFilter = () => {
  const [routingState, setRoutingState] = useRoutingOverviewUrlState();
  const { data: modelsData } = useModelsRouter();
  const { data: routingLanguages } = useRoutingLanguage();
  const selectedModel = modelsData?.models.find(
    (m) => m.id === routingState.model,
  );
  const maxLayer = selectedModel ? selectedModel.layer_count - 1 : 0;
  const options = useMemo(
    () =>
      (routingLanguages?.languages ?? [])
        .map((lang) => ({ value: lang.code, label: lang.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [routingLanguages],
  );

  const selectedPivotLanguage =
    options.find((obj) => obj.value === routingState.pivot_lang) ?? null;
  return (
    <Section title="Logits Routing Filters">
      <ModelRouter
        selectedModel={routingState.model}
        setSelectedModel={(model) =>
          setRoutingState({ ...routingState, model })
        }
      />
      <div className="flex flex-col w-full gap-3">
        <Label className="text-sm px-1">Pivot Language</Label>
        <Combobox
          items={options}
          value={selectedPivotLanguage}
          onValueChange={(value) =>
            setRoutingState({ ...routingState, pivot_lang: value?.value })
          }
        >
          <ComboboxInput placeholder="Select a language" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <MultiPicker
        label="Source Languages"
        selected={routingState.source_langs}
        options={options}
        onChange={(value) =>
          setRoutingState({ ...routingState, source_langs: value })
        }
      />
      <LayerSlider
        title="Layer"
        value={[routingState.layer ?? 0]}
        max={maxLayer}
        step={1}
        onChange={(value) =>
          setRoutingState({ ...routingState, layer: value[0] })
        }
        showLabel
        showTooltip
        formatValue={(v) => `${v}`}
        className="flex flex-col gap-2"
      />
    </Section>
  );
};

export default LogitsRoutingFilter;
