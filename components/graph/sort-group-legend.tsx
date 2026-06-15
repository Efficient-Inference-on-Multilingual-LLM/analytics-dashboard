import React from "react";
import { LanguageGroupDto } from "@/types/dto";
import FloatingWindow from "@/components/ui/floating-window";
import { useComponents } from "@/hooks/api/models";
import { COMPONENT_COLORS } from "@/lib/graph/trajectory";

interface SortGroupLegendProps {
  groups: LanguageGroupDto[] | null;
  showComponentLegend?: boolean;
  width?: number;
  height?: number;
}

const SortGroupLegend = ({
  groups,
  showComponentLegend,
  width = 320,
  height = 260,
}: SortGroupLegendProps) => {
  const { data: componentData } = useComponents();
  return (
    <FloatingWindow
      title="Grouping Legend"
      triggerLabel="Show legend"
      defaultSize={{ width, height }}
    >
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {groups?.map((group, i) => (
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
      {showComponentLegend && componentData && (
        <>
          {groups && groups.length > 0 && (
            <div className="my-3 border-t border-border" />
          )}
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Components
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {componentData.components.map((component) => (
              <div
                key={component.id}
                className="flex items-center gap-2 text-xs overflow-hidden"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm shrink-0"
                  style={{
                    backgroundColor: COMPONENT_COLORS[component.id] ?? "#888",
                  }}
                />
                <span className="truncate text-foreground">
                  {component.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </FloatingWindow>
  );
};

export default SortGroupLegend;
