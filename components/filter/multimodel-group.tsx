import React from "react";
import MultiSelect from "../ui/multi-select";
import { useModels, useComponents } from "@/hooks/api/models";
import { useFilterStore } from "@/store/filter-store";

interface MultiModelGroupProps {
  label: string;
}

const MultiModelGroup = ({ label }: MultiModelGroupProps) => {
  const { data: modelsData } = useModels();
  const { data: componentsData } = useComponents();

  const allModels = modelsData?.models.map((model) => model.label) || [];
  const allComponents =
    componentsData?.components.map((comp) => comp.label) || [];

  const selectedModelIds = useFilterStore((state) => state.selectedModels);
  const selectedComponentIds = useFilterStore(
    (state) => state.selectedComponents,
  );
  const setModels = useFilterStore((state) => state.setSelectedModels);
  const setComponents = useFilterStore((state) => state.setSelectedComponents);

  return (
    <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
      <div className="text-sm font-semibold uppercase tracking-wide">
        {label}
      </div>
      <MultiSelect
        frameworks={allModels.map((model) => ({ value: model, label: model }))}
        label="Models to Compare"
        placeholder="Select models to compare"
        onValueChange={(items) => setModels(items.map((item) => item.value))}
        value={selectedModelIds}
      />
      <MultiSelect
        frameworks={allComponents.map((comp) => ({ value: comp, label: comp }))}
        label="Components to Compare"
        placeholder="Select components to compare"
        onValueChange={(items) =>
          setComponents(items.map((item) => item.value))
        }
        value={selectedComponentIds}
      />
    </div>
  );
};

export default MultiModelGroup;
