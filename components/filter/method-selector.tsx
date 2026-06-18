"use client";

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
import { useMethods } from "@/hooks/api/methods";
import { MethodDto } from "@/types/dto";
import { cn } from "@/lib/utils";

interface MethodSelectorProps {
  selectedMethod?: string | null;
  onMethodChange?: (method: string | null) => void;
  selectedTopK?: string | null;
  onTopKChange?: (topK: string | null) => void;
  locked?: string;
}

const MethodSelector = ({
  selectedMethod,
  onMethodChange,
  selectedTopK,
  onTopKChange,
  locked,
}: MethodSelectorProps) => {
  const { data: methodsResponse } = useMethods();
  const methods = methodsResponse?.methods || [];

  const selectedMethodObj =
    methods.find((method) => method.id === selectedMethod) ?? null;
  const handleChange = (method: MethodDto | null) => {
    onMethodChange?.(method ? method.id : null);
  };

  const topK = selectedMethodObj?.required_top_k;
  const topKVisible = typeof topK === "object";

  const selectedTopKObj =
    topK && typeof topK !== "boolean"
      ? ((topK as { id: string; label: string }[]).find(
          (k) => k.id === selectedTopK,
        ) ?? null)
      : null;
  const handleTopKChange = (k: { id: string; label: string } | null) => {
    onTopKChange?.(k ? k.id : null);
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <div className="flex flex-col">
        <Label className="text-sm px-1">Method</Label>
        {locked ? (
          <div className="flex h-8 w-full items-center rounded-md border border-input bg-muted/50 px-3 text-sm text-muted-foreground cursor-not-allowed">
            {selectedMethodObj?.label ?? locked}
          </div>
        ) : (
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
        )}
      </div>
      <div
        className={cn(
          "relative transition-[height] duration-300",
          topKVisible ? "h-13" : "h-0 overflow-hidden",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            topKVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
        >
          <Label className="text-sm px-1">Top Activations</Label>
          <Combobox
            items={typeof topK === "object" ? topK : []}
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
      </div>
    </div>
  );
};

export default MethodSelector;
