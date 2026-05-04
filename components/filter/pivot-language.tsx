import React from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { SAMPLE_LANGUAGES } from "@/types/constant";

const PivotLanguage = () => {
  type LanguageOption = (typeof SAMPLE_LANGUAGES)[number];
  return (
    <div>
      <Label className="text-sm px-1">Pivot Language</Label>
      <Combobox
        items={SAMPLE_LANGUAGES}
        itemToStringLabel={(item: LanguageOption) => item.name}
        itemToStringValue={(item: LanguageOption) => item.code}
      >
        <ComboboxInput placeholder="Select a language" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.code} value={item}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default PivotLanguage;
