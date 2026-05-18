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
import { MethodDto } from "@/types/dto";

const MethodSelector = () => {
  const { data: methodsResponse } = useMethods();
  const methods = methodsResponse?.methods || [];
  const selectedMethod = useFilterStore((state) => state.selectedMethod);
  const setSelectedMethod = useFilterStore((state) => state.setSelectedMethod);

  const selectedMethodObj =
    methods.find((method) => method.id === selectedMethod) ?? null;
  const handleChange = (method: MethodDto | null) => {
    setSelectedMethod(method ? method.id : null);
  };

  const topK = selectedMethodObj?.required_top_k;
  const selectedTopK = useFilterStore((state) => state.topK);
  const setSelectedTopK = useFilterStore((state) => state.setTopK);

  const selectedTopKObj =
    topK && typeof topK !== "boolean"
      ? ((topK as { id: string; label: string }[]).find(
          (k) => k.id === selectedTopK,
        ) ?? null)
      : null;
  const handleTopKChange = (k: { id: string; label: string } | null) => {
    setSelectedTopK(k ? k.id : null);
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex flex-col">
        <Label className="text-sm px-1">Method</Label>
        <Combobox
          items={methods}
          value={selectedMethodObj}
          onValueChange={handleChange}
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
      {selectedMethod === "lape" && typeof topK === "object" && (
        <div className="flex flex-col">
          <Label className="text-sm px-1">Top Activations</Label>
          <Combobox
            items={topK}
            value={selectedTopKObj}
            onValueChange={handleTopKChange}
          >
            <ComboboxInput placeholder="Select top k" showClear />
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
      )}
    </div>
  );
};

export default MethodSelector;
