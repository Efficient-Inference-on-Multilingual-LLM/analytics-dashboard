import React from "react";
import { LanguageGroupDto } from "@/types/dto";
import FloatingWindow from "@/components/ui/floating-window";
import { COMPONENT_COLORS, LINE_DASHES } from "@/lib/graph/trajectory";
import { useComponents } from "@/hooks/api/models";

interface SortGroupLegendProps {
  groups: LanguageGroupDto[] | null;
  showComponentLegend?: boolean;
  models?: { id: string; label: string }[];
  width?: number;
  height?: number;
}

const DASH_PATTERN: Record<string, string> = {
  solid: "",
  dash: "6 4",
  dot: "1 4",
  dashdot: "6 4 1 4",
  longdash: "10 4",
};

const SortGroupLegend = ({
  groups,
  showComponentLegend = false,
  models,
  width = 320,
  height = 320,
}: SortGroupLegendProps) => {
  const { data: componentData } = useComponents();

  return (
    <FloatingWindow
      title="Grouping Legend"
      triggerLabel="Show legend"
      defaultSize={{ width: width, height: height }}
    >
      {groups && groups.length > 0 && (
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
      )}

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

      {models && models.length > 0 && (
        <>
          <div className="my-3 border-t border-border" />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Models
          </p>
          <div className="grid grid-cols-1 gap-y-1.5">
            {models.map((model, i) => {
              const dash = LINE_DASHES[i % LINE_DASHES.length];
              return (
                <div
                  key={model.id}
                  className="flex items-center gap-2 text-xs overflow-hidden"
                >
                  {/* line-style swatch */}
                  <svg width="28" height="8" className="shrink-0" aria-hidden>
                    <line
                      x1="0"
                      y1="4"
                      x2="28"
                      y2="4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={DASH_PATTERN[dash] ?? ""}
                      className="text-foreground"
                    />
                  </svg>
                  <span className="truncate text-foreground">
                    {model.label}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </FloatingWindow>
  );
};

export default SortGroupLegend;
