import React from "react";
import { Label } from "../ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { GROUP_BY_OPTIONS } from "@/types/constant";
import { useFilterStore } from "@/store/filter-store";

const GroupBy = () => {
  type GroupByOption = (typeof GROUP_BY_OPTIONS)[number];
  const groupBy = useFilterStore((state) => state.groupBy);
  const setGroupBy = useFilterStore((state) => state.setGroupBy);

  const groupByObj =
    GROUP_BY_OPTIONS.find((option) => option.value === groupBy) ?? null;
  const handleChange = (option: GroupByOption | null) => {
    setGroupBy(option ? option.value : "family");
  };

  return (
    <div>
      <Label className="text-sm px-1">Group By</Label>
      <Combobox
        items={GROUP_BY_OPTIONS}
        onValueChange={handleChange}
        value={groupByObj}
      >
        <ComboboxInput placeholder="Select grouping" showClear />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
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

export default GroupBy;
