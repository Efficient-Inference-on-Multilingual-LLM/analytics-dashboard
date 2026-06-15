"use client";

import Section from "@/components/filter/section";
import MethodSelector from "@/components/filter/method-selector";
import React from "react";
import GroupBy from "@/components/filter/group-by";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { AGGREGATION_OPTIONS } from "@/types/constant";
import MultiModelGroup from "@/components/filter/multimodel-group";
import LayerSlider from "@/components/filter/layer-slider";
import PivotLanguage from "@/components/filter/pivot-language";
// import LanguageFilters from "@/components/filter/language-filters";
import { useCrossModelUrlState } from "@/hooks/url-state/states";

const CrossModelFilters = () => {
  const [crossModelState, setCrossModelState] = useCrossModelUrlState();
  type AggregationOption = (typeof AGGREGATION_OPTIONS)[number];

  const aggregationObj =
    AGGREGATION_OPTIONS.find(
      (option) => option.value === crossModelState.aggregation,
    ) ?? null;
  const handleAggregationChange = (option: AggregationOption | null) => {
    setCrossModelState({
      ...crossModelState,
      aggregation: option ? option.value : null,
    });
  };

  return (
    <Section title="Cross-Model Filters">
      <MethodSelector
        selectedMethod={crossModelState.method ?? null}
        onMethodChange={(method) =>
          setCrossModelState({
            ...crossModelState,
            method: method as typeof crossModelState.method,
          })
        }
        selectedTopK={crossModelState.top_k ?? null}
        onTopKChange={(topK) =>
          setCrossModelState({ ...crossModelState, top_k: topK })
        }
      />
      <MultiModelGroup
        label="Models & Components"
        methodId={crossModelState.method ?? null}
        selectedModels={crossModelState.models ?? []}
        setSelectedModels={(models) =>
          setCrossModelState({ ...crossModelState, models })
        }
        selectedComponents={crossModelState.components ?? []}
        setSelectedComponents={(components) =>
          setCrossModelState({ ...crossModelState, components })
        }
      />
      <GroupBy
        value={crossModelState.group_by ?? null}
        onChange={(groupBy) =>
          setCrossModelState({ ...crossModelState, group_by: groupBy })
        }
      />

      <div>
        <Label className="text-sm px-1">Aggregation</Label>
        <Combobox
          items={AGGREGATION_OPTIONS}
          value={aggregationObj}
          onValueChange={handleAggregationChange}
        >
          <ComboboxInput placeholder="Select an aggregation" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item: AggregationOption) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <PivotLanguage
        method={(crossModelState.method ?? undefined) as string}
        modelIds={crossModelState.models ?? []}
        componentIds={crossModelState.components ?? []}
        topK={crossModelState.top_k ?? null}
        value={crossModelState.pivot_language ?? undefined}
        onChange={(pivot_language) =>
          setCrossModelState({ ...crossModelState, pivot_language })
        }
      />

      <LayerSlider
        title="Layer Percentage"
        value={[crossModelState.layer_percentage ?? 0]}
        max={100}
        step={1}
        onChange={(value) =>
          setCrossModelState({
            ...crossModelState,
            layer_percentage: value[0],
          })
        }
        showLabel
        showTooltip
        formatValue={(v) => `${v}%`}
        className="flex flex-col gap-2"
      />

      {/* <LanguageFilters 
        label="Language" 
        method={(crossModelState.method ?? undefined) as string | null}
        
      /> */}
    </Section>
  );
};

export default CrossModelFilters;
