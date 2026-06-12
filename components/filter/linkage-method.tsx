"use client";

import React from "react";
import { LINKAGE_METHODS } from "@/types/constant";
import { Label } from "../ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import LayerSlider from "./layer-slider";

type LinkageMethodValue = (typeof LINKAGE_METHODS)[number]["value"];

interface LinkageMethodProps {
  value: LinkageMethodValue;
  clusterCutoff: number | null;
  onChange: (value: LinkageMethodValue) => void;
  onClusterCutoffChange: (value: number) => void;
}

const LinkageMethod = ({
  value,
  clusterCutoff,
  onChange,
  onClusterCutoffChange,
}: LinkageMethodProps) => {
  type LinkageMethodOption = (typeof LINKAGE_METHODS)[number];

  const linkageMethodObj =
    LINKAGE_METHODS.find((option) => option.value === value) ?? null;
  const handleLinkageMethodChange = (option: LinkageMethodOption | null) => {
    onChange(option ? option.value : "average");
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Label className="text-sm px-1">Linkage Method</Label>
        <Combobox
          items={LINKAGE_METHODS}
          value={linkageMethodObj}
          onValueChange={handleLinkageMethodChange}
        >
          <ComboboxInput placeholder="Select a linkage method" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item: LinkageMethodOption) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
      <div>
        <LayerSlider
          title="Cluster Cutoff Percentage"
          value={[clusterCutoff ?? 50]}
          max={100}
          step={1}
          onChange={(value) => onClusterCutoffChange(value[0])}
          showLabel
          showTooltip
          formatValue={(v) => `${v}%`}
          className="flex flex-col gap-2"
        />
      </div>
    </div>
  );
};

export default LinkageMethod;
