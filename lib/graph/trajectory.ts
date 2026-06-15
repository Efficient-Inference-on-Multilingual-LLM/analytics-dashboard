import { LanguageGroupDto } from "@/types/dto";
import type { Layout, Dash } from "plotly.js";

const TAB10 = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

export function buildColorMap(
  codes: string[],
  groups: LanguageGroupDto[] | null,
): {
  codeToColor: Record<string, string>;
  codeToGroup: Record<string, string>;
} {
  const codeToColor: Record<string, string> = {};
  const codeToGroup: Record<string, string> = {};

  if (groups) {
    for (const g of groups) {
      for (const code of g.languages) {
        codeToColor[code] = g.color;
        codeToGroup[code] = g.name;
      }
    }
  } else {
    codes.forEach((code, i) => {
      codeToColor[code] = TAB10[i % TAB10.length];
      codeToGroup[code] = code;
    });
  }
  return { codeToColor, codeToGroup };
}

export const BASE_LAYOUT: Partial<Layout> = {
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  hovermode: "closest",
  margin: { l: 70, r: 20, t: 50, b: 50 },
  yaxis: { tickformat: ".2e" },
  font: { color: "currentColor" },
};

export const LINE_DASHES: Dash[] = [
  "solid",
  "dash",
  "dot",
  "dashdot",
  "longdash",
];

export function metricLabel(method: string): string {
  switch (method) {
    case "lape":
      return "Overlap of Language-specific Neurons / #Neurons";
    case "silhouette":
      return "Silhouette Score";
    default:
      return `${method.toUpperCase()} Similarity`;
  }
}

export const COMPONENT_COLORS: Record<string, string> = {
  "residual-preattn": "#1f77b4",
  "residual-postattn": "#ff7f0e",
  "residual-postmlp": "#2ca02c",
  "attn-output": "#d62728",
  "mlp-output": "#9467bd",
};
