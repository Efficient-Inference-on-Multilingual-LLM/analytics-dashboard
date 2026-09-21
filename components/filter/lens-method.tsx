import React from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Label } from "../ui/label";
import { LENS_METHODS } from "@/types/constant";

type LensMethodValue = (typeof LENS_METHODS)[number]["value"];

interface LensMethodProps {
  value: LensMethodValue;
  onChange: (value: LensMethodValue) => void;
}

const LensMethodSelection = ({ value, onChange }: LensMethodProps) => {
  type LensMethod = (typeof LENS_METHODS)[number];
  const lensMethodObj =
    LENS_METHODS.find((option) => option.value === value) ?? null;

  const handleLensMethodChange = (option: LensMethod | null) => {
    onChange(option ? option.value : "logit_lens");
  };
  return (
    <div className="flex flex-col w-full gap-3">
      <Label className="text-sm px-1">Lens Method</Label>
      <Combobox
        items={LENS_METHODS}
        value={lensMethodObj}
        onValueChange={handleLensMethodChange}
      >
        <ComboboxInput placeholder="Select a lens method" />
        <ComboboxContent>
          <ComboboxEmpty>No lens methods found.</ComboboxEmpty>
          <ComboboxList>
            {(item: LensMethod) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default LensMethodSelection;
