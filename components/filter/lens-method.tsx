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

const LENS_METHODS = [{ id: "logit_lens", label: "Logit Lens" }];

// this is the locked lens method for now, since we only have one lens method implemented
const LOCKED = LENS_METHODS[0];

const LensMethodSelection = () => {
  return (
    <div className="flex flex-col w-full gap-3">
      <Label className="text-sm px-1">Lens Method</Label>
      <Combobox items={LENS_METHODS} value={LOCKED} disabled>
        <ComboboxInput placeholder="Select a lens method" />
        <ComboboxContent>
          <ComboboxEmpty>No lens methods found.</ComboboxEmpty>
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

export default LensMethodSelection;
