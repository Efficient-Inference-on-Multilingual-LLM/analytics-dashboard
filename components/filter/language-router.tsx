"use client";

import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useRoutingLanguage } from "@/hooks/api/languages";

interface LanguageRouterProps {
  label: string;
  value?: string | null;
  onChange: (code: string | null) => void;
  placeholder?: string;
}

const LanguageRouter = ({
  label,
  value,
  onChange,
  placeholder,
}: LanguageRouterProps) => {
  const { data } = useRoutingLanguage();

  const options = useMemo(
    () =>
      (data?.languages ?? [])
        .map((l) => ({ id: l.code, label: l.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [data],
  );

  const selected = options.find((o) => o.id === value) ?? null;

  return (
    <div className="flex flex-col w-full gap-3">
      <Label className="text-sm px-1">{label}</Label>
      <Combobox
        items={options}
        value={selected}
        onValueChange={(item) => onChange(item?.id ?? null)}
      >
        <ComboboxInput placeholder={placeholder} showClear />
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

export default LanguageRouter;
