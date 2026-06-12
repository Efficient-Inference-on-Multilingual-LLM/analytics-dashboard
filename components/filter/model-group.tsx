"use client";

import React from "react";
import { Label } from "../ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { useModels, useComponents } from "@/hooks/api/models";
import { ModelDto } from "@/types/dto";
import { ComponentDto } from "@/types/dto";

interface ModelGroupProps {
  label: string;
  selectedModel: string | null;
  setSelectedModel: (model: string | null) => void;
  selectedComponent: string | null;
  setSelectedComponent: (component: string | null) => void;
}

const ModelGroup = ({
  label,
  selectedModel,
  setSelectedModel,
  selectedComponent,
  setSelectedComponent,
}: ModelGroupProps) => {
  const { data: modelsData } = useModels();
  const { data: componentsData } = useComponents();

  const allModels = modelsData?.models ?? [];
  const allComponents = componentsData?.components ?? [];

  const selectedModelObj =
    allModels.find((model) => model.id === selectedModel) ?? null;
  const selectedComponentObj =
    allComponents.find((comp) => comp.id === selectedComponent) ?? null;

  const handleModelChange = (model: ModelDto | null) => {
    setSelectedModel(model ? model.id : null);
  };
  const handleComponentChange = (comp: ComponentDto | null) => {
    setSelectedComponent(comp ? comp.id : null);
  };
  return (
    <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
      <div className="text-sm font-semibold uppercase tracking-wide">
        {label}
      </div>
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
      <div>
        <Label className="text-sm px-1">Component</Label>
        <Combobox
          items={allComponents}
          value={selectedComponentObj}
          onValueChange={handleComponentChange}
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
  );
};

export default ModelGroup;
