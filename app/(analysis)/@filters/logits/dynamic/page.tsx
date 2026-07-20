"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import ModelRouter from "@/components/filter/model-router";
import { useLogitsDynamicUrlState } from "@/hooks/url-state/states";
import LanguageRouter from "@/components/filter/language-router";
import MultiPicker from "@/components/ui/multi-picker";
import { useRoutingLanguage } from "@/hooks/api/languages";

const LogitsDynamicFilter = () => {
  const [routingState, setRoutingState] = useLogitsDynamicUrlState();
  const { data: routingLanguages } = useRoutingLanguage();
  const options = useMemo(
    () =>
      (routingLanguages?.languages ?? [])
        .map((lang) => ({ value: lang.code, label: lang.name }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [routingLanguages],
  );
  return (
    <Section title="Logits Dynamic Filters">
      <ModelRouter
        selectedModel={routingState.model}
        setSelectedModel={(model) =>
          setRoutingState({ ...routingState, model })
        }
      />
      <LanguageRouter
        label="Source Language"
        value={routingState.source_lang}
        onChange={(source_lang) =>
          setRoutingState({ ...routingState, source_lang })
        }
        placeholder="Select a source language"
      />
      <MultiPicker
        label="Pivot Languages"
        selected={routingState.pivot_langs}
        options={options}
        onChange={(value) =>
          setRoutingState({ ...routingState, pivot_langs: value })
        }
      />
    </Section>
  );
};

export default LogitsDynamicFilter;
