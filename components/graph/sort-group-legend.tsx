import React from "react";
import { LanguageGroupDto } from "@/types/dto";
import FloatingWindow from "@/components/ui/floating-window";

interface SortGroupLegendProps {
  groups: LanguageGroupDto[];
}

const SortGroupLegend = ({ groups }: SortGroupLegendProps) => {
  return (
    <FloatingWindow
      title="Grouping Legend"
      triggerLabel="Show legend"
      defaultSize={{ width: 320, height: 260 }}
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {groups.map((group, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs overflow-hidden"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: group.color }}
            />
            <span className="truncate text-foreground">
              {group.name}
              <span className="ml-1 font-mono text-muted-foreground">
                ({group.languages.length})
              </span>
            </span>
          </div>
        ))}
      </div>
    </FloatingWindow>
  );
};

export default SortGroupLegend;
