"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import ModelRouter from "@/components/filter/model-router";
import { useLogitsSentenceUrlState } from "@/hooks/url-state/states";
import { useDecoderSentences } from "@/hooks/api/decoder";
import LanguageRouter from "@/components/filter/language-router";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";

const LogitsSentencesFilter = () => {
  const [logitsSentenceState, setLogitsSentenceState] =
    useLogitsSentenceUrlState();

  const { data: decoderSentences } = useDecoderSentences(
    logitsSentenceState.model,
    logitsSentenceState.source_lang,
  );

  const options = useMemo(
    () =>
      (decoderSentences?.sentences ?? []).map((s) => ({
        value: s.sentence_id,
        label: `#${s.sentence_id} — ${s.text ?? ""}`,
      })),
    [decoderSentences],
  );

  const selectedSentence =
    options.find((o) => o.value === logitsSentenceState.sentence_id) ?? null;

  return (
    <Section title="Logits Sentences Filters">
      <ModelRouter
        selectedModel={logitsSentenceState.model}
        setSelectedModel={(model) =>
          setLogitsSentenceState({
            ...logitsSentenceState,
            model,
            sentence_id: null,
          })
        }
      />
      <LanguageRouter
        label="Source Language"
        value={logitsSentenceState.source_lang}
        onChange={(source_lang) =>
          setLogitsSentenceState({
            ...logitsSentenceState,
            source_lang,
            sentence_id: null,
          })
        }
        placeholder="Select a source language"
      />
      <div className="flex flex-col w-full gap-3">
        <Label className="text-sm px-1">Sentence</Label>
        <Combobox
          items={options}
          value={selectedSentence}
          onValueChange={(option) =>
            setLogitsSentenceState({
              ...logitsSentenceState,
              sentence_id: option ? option.value : null,
            })
          }
        >
          <ComboboxInput placeholder="Select a sentence" showClear />
          <ComboboxContent>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {options.map((option) => (
                <ComboboxItem key={option.value} value={option}>
                  {option.label}
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </Section>
  );
};

export default LogitsSentencesFilter;
