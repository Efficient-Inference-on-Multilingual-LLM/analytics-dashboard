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
import { METHODS } from "@/types/constant";

const MethodSelector = () => {
  type MethodOption = (typeof METHODS)[number];
  return (
    <div className="flex flex-col w-full">
      <Label className="text-sm px-1">Method</Label>
      <Combobox
        items={METHODS}
        itemToStringLabel={(item: MethodOption) => item.label}
        itemToStringValue={(item: MethodOption) => item.value}
      >
        <ComboboxInput placeholder="Select a method" showClear />
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
  );
};

export default MethodSelector;
