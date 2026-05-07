import React from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "./combobox";
import { Label } from "./label";

interface MultiSelectProps<T extends { value: string; label: string }> {
  frameworks: T[];
  value: string[];
  className?: string;
  label?: string;
  placeholder?: string;
  onValueChange?: (items: T[]) => void;
}

function MultiSelect<T extends { value: string; label: string }>({
  frameworks,
  value,
  className,
  label,
  placeholder,
  onValueChange,
}: MultiSelectProps<T>) {
  const anchor = useComboboxAnchor();
  const placeholderText = placeholder || "Select items to compare";
  const selectedItems = frameworks.filter((f) => value.includes(f.value));

  return (
    <div className={className}>
      {label && <Label className="text-sm px-1">{label}</Label>}
      <Combobox
        multiple
        autoHighlight
        items={frameworks}
        value={selectedItems}
        onValueChange={onValueChange}
      >
        <ComboboxChips ref={anchor} className="w-full">
          <ComboboxValue>
            {(items: T[]) => {
              return (
                <React.Fragment>
                  {items.map((item: T) => (
                    <ComboboxChip key={item.value}>{item.label}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    placeholder={items.length === 0 ? placeholderText : ""}
                  />
                </React.Fragment>
              );
            }}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            {(item: T) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export default MultiSelect;
