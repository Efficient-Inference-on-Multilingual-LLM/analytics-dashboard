import React, { useMemo, useEffect } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { useTrajectoryLanguages } from "@/hooks/api/trajectory";
import { useLanguages } from "@/hooks/api/languages";

interface PivotLanguageProps {
  method: string | null;
  modelIds: string[];
  componentIds: string[];
  topK?: string | null;
  value?: string | null;
  onChange?: (value: string | null) => void;
}

const PivotLanguage = ({
  value,
  onChange,
  method,
  modelIds,
  componentIds,
  topK,
}: PivotLanguageProps) => {
  const trajectoryLanguageReady =
  !!method && modelIds.length > 0 && componentIds.length > 0 && (method !== "lape" || !!topK);

  const trajectoryLanguageRequest = trajectoryLanguageReady
    ? {
        method: method as string,
        model_ids: modelIds as string[],
        component_ids: componentIds as string[],
        top_k: method === "lape" && topK ? Number(topK) : null,
      }
    : null;
  const { data: trajectoryLanguages } = useTrajectoryLanguages(
    trajectoryLanguageRequest,
  );

  const { data: languagesData } = useLanguages();
  const codeToName = useMemo(() => {
    const m: Record<string, string> = {};
    (languagesData?.languages ?? []).forEach((l) => (m[l.code] = l.name));
    return m;
  }, [languagesData]);

  const options = useMemo(
    () =>
      (trajectoryLanguages?.intersection ?? [])
        .map((code) => ({ id: code, label: codeToName[code] ?? code }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [trajectoryLanguages, codeToName],
  );

  const selected = options.find((o) => o.id === value) ?? null;

  useEffect(() => {
    if (options.length > 0 && !value && onChange) {
      onChange(options[0].id);
    }
  }, [options, value, onChange]);

  useEffect(() => {
    if (
      trajectoryLanguages &&
      value &&
      !trajectoryLanguages.intersection.includes(value) &&
      onChange
    ) {
      onChange(options[0]?.id ?? null);
    }
  }, [trajectoryLanguages, value, onChange, options]);

  return (
    <div>
      <Label className="text-sm px-1">Pivot Language</Label>
      <Combobox
        items={options}
        value={selected}
        onValueChange={(item) => onChange?.(item?.id ?? null)}
      >
        <ComboboxInput placeholder="Select a language" showClear />
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

export default PivotLanguage;
