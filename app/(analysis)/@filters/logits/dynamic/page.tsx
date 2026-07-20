"use client";

import React from "react";
import Section from "@/components/filter/section";
import ModelRouter from "@/components/filter/model-router";
import { useRoutingOverviewUrlState } from "@/hooks/url-state/states";

const LogitsDynamicFilter = () => {
  const [routingState, setRoutingState] = useRoutingOverviewUrlState();
  return (
    <Section title="Logits Dynamic Filters">
      <ModelRouter
        selectedModel={routingState.model}
        setSelectedModel={(model) =>
          setRoutingState({ ...routingState, model })
        }
      />
    </Section>
  );
};

export default LogitsDynamicFilter;
