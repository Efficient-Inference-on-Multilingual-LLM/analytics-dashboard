"use client";

import React from "react";
import Section from "@/components/filter/section";
import ModelRouter from "@/components/filter/model-router";
import { useLogitsSentenceUrlState } from "@/hooks/url-state/states";

const LogitsSentencesFilter = () => {
  const [logitsSentenceState, setLogitsSentenceState] =
    useLogitsSentenceUrlState();

  return (
    <Section title="Logits Sentences Filters">
      <ModelRouter
        selectedModel={logitsSentenceState.model}
        setSelectedModel={(model) =>
          setLogitsSentenceState({ ...logitsSentenceState, model })
        }
      />
    </Section>
  );
};

export default LogitsSentencesFilter;
