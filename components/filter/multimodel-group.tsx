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

  const selectedMethodObj =
    methodsData?.methods.find((method) => method.id === methodId) ?? null;

  const allowed_models = new Set(
    (selectedMethodObj?.models ?? []).map((model) => model.id),
  );
  const allModels = (modelsData?.models ?? []).filter((model) =>
    allowed_models.has(model.id),
  );

  const allowed_comp = new Set(
    (selectedMethodObj?.components ?? []).map((component) => component.id),
  );
  const allComponents = (componentsData?.components ?? []).filter((comp) =>
    allowed_comp.has(comp.id),
  );

  return (
    <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
      <div className="text-sm font-semibold uppercase tracking-wide">
        {label}
      </div>
      <MultiSelect
        frameworks={allModels.map((model) => ({
          value: model.id,
          label: model.label,
        }))}
        label="Models to Compare"
        placeholder="Select models to compare"
        onValueChange={(items) =>
          setSelectedModels(items.map((item) => item.value))
        }
        value={selectedModels}
      />
      <MultiSelect
        frameworks={allComponents.map((comp) => ({
          value: comp.id,
          label: comp.label,
        }))}
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
