import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  method: string;
  groupBy: string;
  pivotLanguage: string | null;

  selectedModels: string[];
  selectedComponents: string[];
  selectedLayers: number[];
  layerPercentage: number;

  setMethod: (method: string) => void;
  setGroupBy: (groupBy: string) => void;
  setPivotLanguage: (language: string | null) => void;

  setSelectedModels: (models: string[]) => void;
  setSelectedComponents: (components: string[]) => void;
  setSelectedLayers: (layers: number[]) => void;
  setLayerPercentage: (percentage: number) => void;
}

const defaultState = {
  method: "cka",
  groupBy: "family",
  pivotLanguage: null,

  selectedModels: [] as string[],
  selectedComponents: [] as string[],
  selectedLayers: [] as number[],
  layerPercentage: 50,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...defaultState,

      setMethod: (method: string) => set({ method }),
      setGroupBy: (groupBy: string) => set({ groupBy }),
      setPivotLanguage: (pivotLanguage: string | null) =>
        set({ pivotLanguage }),

      setSelectedModels: (selectedModels: string[]) => set({ selectedModels }),
      setSelectedComponents: (selectedComponents: string[]) =>
        set({ selectedComponents }),
      setSelectedLayers: (selectedLayers: number[]) => set({ selectedLayers }),
      setLayerPercentage: (layerPercentage: number) => set({ layerPercentage }),
    }),
    {
      name: "filter-store",
    },
  ),
);
