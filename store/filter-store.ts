import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LanguageFilters, DEFAULT_FILTERS } from "@/lib/filter/language-filter";

interface FilterState {
  groupBy: string;
  pivotLanguage: string | null;
  selectedMethod: string | null;
  topK: string | null;

  selectedModelA: string | null;
  selectedComponentA: string | null;
  selectedLayerA: number | null;

  selectedModelB: string | null;
  selectedComponentB: string | null;
  selectedLayerB: number | null;

  selectedModels: string[];
  selectedComponents: string[];
  selectedLayers: number[];
  layerPercentage: number;

  languageFilters: LanguageFilters;

  setGroupBy: (groupBy: string) => void;
  setPivotLanguage: (language: string | null) => void;

  setSelectedMethod: (method: string | null) => void;
  setTopK: (topK: string | null) => void;

  setSelectedModelA: (model: string | null) => void;
  setSelectedComponentA: (component: string | null) => void;
  setSelectedLayerA: (layer: number | null) => void;

  setSelectedModelB: (model: string | null) => void;
  setSelectedComponentB: (component: string | null) => void;
  setSelectedLayerB: (layer: number | null) => void;

  setSelectedModels: (models: string[]) => void;
  setSelectedComponents: (components: string[]) => void;
  setSelectedLayers: (layers: number[]) => void;
  setLayerPercentage: (percentage: number) => void;

  setLanguageFilters: (filters: Partial<LanguageFilters>) => void;
  resetLanguageFilters: () => void;
}

const defaultState = {
  groupBy: "family",
  pivotLanguage: null,

  selectedMethod: null as string | null,
  topK: null as string | null,

  selectedModelA: null as string | null,
  selectedComponentA: null as string | null,
  selectedLayerA: null as number | null,

  selectedModelB: null as string | null,
  selectedComponentB: null as string | null,
  selectedLayerB: null as number | null,

  selectedModels: [] as string[],
  selectedComponents: [] as string[],
  selectedLayers: [] as number[],
  layerPercentage: 50,

  languageFilters: DEFAULT_FILTERS,
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
      setTopK: (topK: string | null) => set({ topK }),
      setSelectedModels: (selectedModels: string[]) => set({ selectedModels }),
      setSelectedComponents: (selectedComponents: string[]) =>
        set({ selectedComponents }),
      setSelectedLayers: (selectedLayers: number[]) => set({ selectedLayers }),
      setLayerPercentage: (layerPercentage: number) => set({ layerPercentage }),
      setSelectedModelA: (selectedModelA: string | null) =>
        set({ selectedModelA }),
      setSelectedComponentA: (selectedComponentA: string | null) =>
        set({ selectedComponentA }),
      setSelectedLayerA: (selectedLayerA: number | null) =>
        set({ selectedLayerA }),
      setSelectedModelB: (selectedModelB: string | null) =>
        set({ selectedModelB }),
      setSelectedComponentB: (selectedComponentB: string | null) =>
        set({ selectedComponentB }),
      setSelectedLayerB: (selectedLayerB: number | null) =>
        set({ selectedLayerB }),

      setLanguageFilters: (filters: Partial<LanguageFilters>) =>
        set((state) => ({
          languageFilters: { ...state.languageFilters, ...filters },
        })),
      resetLanguageFilters: () => set({ languageFilters: DEFAULT_FILTERS }),
    }),
    {
      name: "filter-store",
    },
  ),
);
