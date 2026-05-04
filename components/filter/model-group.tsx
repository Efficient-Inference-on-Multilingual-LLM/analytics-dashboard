"use client";

import React from "react";
import { Label } from "../ui/label";
import { MODELS, COMPONENTS } from "@/types/constant";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";

interface ModelGroupProps {
  label: string;
}

const ModelGroup = ({ label }: ModelGroupProps) => {
  type ModelOptions = (typeof MODELS)[number];
  type ComponentOptions = (typeof COMPONENTS)[number];
  return (
    <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
      <div className="text-sm font-semibold uppercase tracking-wide">
        {label}
      </div>
      <div>
        <Label className="text-sm px-1">Model</Label>
        <Combobox
          items={MODELS}
          itemToStringLabel={(item: ModelOptions) => item.label}
          itemToStringValue={(item: ModelOptions) => item.value}
        >
          <ComboboxInput placeholder="Select a model" showClear />
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
      <div>
        <Combobox
          items={COMPONENTS}
          itemToStringLabel={(item: ComponentOptions) => item.label}
          itemToStringValue={(item: ComponentOptions) => item.value}
        >
          <ComboboxInput placeholder="Select a component" showClear />
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
    </div>
  );
};

export default ModelGroup;
