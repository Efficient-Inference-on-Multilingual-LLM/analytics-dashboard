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

const LinkageMethod = () => {
  type LinkageMethodOption = (typeof LINKAGE_METHODS)[number];
  return (
    <div>
      <Label className="text-sm px-1">Linkage Method</Label>
      <Combobox
        items={LINKAGE_METHODS}
        itemToStringLabel={(item: LinkageMethodOption) => item.label}
        itemToStringValue={(item: LinkageMethodOption) => item.value}
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
  );
};

export default LinkageMethod;
