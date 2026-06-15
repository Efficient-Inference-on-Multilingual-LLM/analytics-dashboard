import React from "react";
import MultiSelect from "../ui/multi-select";
import { useModels, useComponents } from "@/hooks/api/models";
import { useMethods } from "@/hooks/api/methods";

interface MultiModelGroupProps {
  label: string;
  methodId: string | null;
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
  selectedComponents: string[];
  setSelectedComponents: (components: string[]) => void;
}

const MultiModelGroup = ({
  label,
  methodId,
  selectedModels,
  setSelectedModels,
  selectedComponents,
  setSelectedComponents,
}: MultiModelGroupProps) => {
  const { data: modelsData } = useModels();
  const { data: methodsData } = useMethods();
  const { data: componentsData } = useComponents();

  const allModels = modelsData?.models.map((model) => model.label) || [];

  const selectedMethodObj =
    methodsData?.methods.find((method) => method.id === methodId) ?? null;
  const allowed = new Set(
    (selectedMethodObj?.components ?? []).map((component) => component.id),
  );
  const allComponents =
    componentsData?.components
      .filter((comp) => allowed.has(comp.id))
      .map((comp) => comp.label) || [];

  return (
    <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
      <div className="text-sm font-semibold uppercase tracking-wide">
        {label}
      </div>
      <MultiSelect
        frameworks={allModels.map((model) => ({ value: model, label: model }))}
        label="Models to Compare"
        placeholder="Select models to compare"
        onValueChange={(items) =>
          setSelectedModels(items.map((item) => item.value))
        }
        value={selectedModels}
      />
      <MultiSelect
        frameworks={allComponents.map((comp) => ({ value: comp, label: comp }))}
        label="Components to Compare"
        placeholder="Select components to compare"
        onValueChange={(items) =>
          setSelectedComponents(items.map((item) => item.value))
        }
        value={selectedComponents}
      />
    </div>
  );
};

export default MultiModelGroup;
