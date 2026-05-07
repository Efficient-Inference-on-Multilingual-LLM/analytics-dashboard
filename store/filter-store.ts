import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  groupBy: string;
  pivotLanguage: string | null;

  selectedMethod: string | null;
  selectedModels: string[];
  selectedComponents: string[];
  selectedLayers: number[];
  layerPercentage: number;

  setGroupBy: (groupBy: string) => void;
  setPivotLanguage: (language: string | null) => void;

  setSelectedMethod: (method: string | null) => void;
  setSelectedModels: (models: string[]) => void;
  setSelectedComponents: (components: string[]) => void;
  setSelectedLayers: (layers: number[]) => void;
  setLayerPercentage: (percentage: number) => void;
}

const defaultState = {
  groupBy: "family",
  pivotLanguage: null,

  selectedMethod: null as string | null,
  selectedModels: [] as string[],
  selectedComponents: [] as string[],
  selectedLayers: [] as number[],
  layerPercentage: 50,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...defaultState,
      setGroupBy: (groupBy: string) => set({ groupBy }),
      setPivotLanguage: (pivotLanguage: string | null) =>
        set({ pivotLanguage }),

      setSelectedMethod: (selectedMethod: string | null) =>
        set({ selectedMethod }),
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
