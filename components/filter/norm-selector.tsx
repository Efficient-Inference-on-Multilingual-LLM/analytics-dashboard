import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface NormalizedSelectorProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const NormalizedSelector = ({ checked, onChange }: NormalizedSelectorProps) => {
  return (
    <div className="flex items-center space-x-2 rounded-2xl border border-input bg-background px-3 py-2">
      <Checkbox id="normalized" checked={checked} onCheckedChange={onChange} />
      <label
        htmlFor="normalized"
        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Normalized
      </label>
    </div>
  );
};

export default NormalizedSelector;
