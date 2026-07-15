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
import { useModelsRouter } from "@/hooks/api/models";

interface ModelRouterProps {
  selectedModel?: string | null;
  setSelectedModel?: (model: string | null) => void;
}

const ModelRouter = ({ selectedModel, setSelectedModel }: ModelRouterProps) => {
  const { data: modelsRouterData } = useModelsRouter();
  const modelsRouter = modelsRouterData?.models ?? [];

  const selected = modelsRouter.find((m) => m.id === selectedModel) ?? null;

  return (
    <div className="flex flex-col w-full gap-3">
      <Label className="text-sm px-1">Model</Label>
      <Combobox
        items={modelsRouter}
        value={selected}
        onValueChange={(item) => setSelectedModel?.(item?.id ?? null)}
      >
        <ComboboxInput placeholder="Select a model" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item: { id: string; label: string }) => (
              <ComboboxItem key={item.id} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default ModelRouter;
