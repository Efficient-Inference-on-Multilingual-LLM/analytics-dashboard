"use client";

import React from "react";
import Section from "@/components/filter/section";
import ModelRouter from "@/components/filter/model-router";
import { useLogitsSentenceUrlState } from "@/hooks/url-state/states";
import LanguageRouter from "@/components/filter/language-router";

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
      <LanguageRouter
        label="Source Language"
        value={logitsSentenceState.source_lang}
        onChange={(source_lang) =>
          setLogitsSentenceState({ ...logitsSentenceState, source_lang })
        }
        placeholder="Select a source language"
      />
    </Section>
  );
};

export default LogitsSentencesFilter;
