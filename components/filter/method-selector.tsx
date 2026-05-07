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
import { useFilterStore } from "@/store/filter-store";
import { useMethods } from "@/hooks/api/methods";

const MethodSelector = () => {
  const { data: methodsResponse } = useMethods();
  const methods = methodsResponse?.methods || [];
  const selectedMethod = useFilterStore((state) => state.selectedMethod);
  const setSelectedMethod = useFilterStore((state) => state.setSelectedMethod);

  return (
    <div className="flex flex-col w-full">
      <Label className="text-sm px-1">Method</Label>
      <Combobox
        items={methods}
        value={selectedMethod}
        onValueChange={setSelectedMethod}
      >
        <ComboboxInput placeholder="Select a method" showClear />
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
  );
};

export default MethodSelector;
