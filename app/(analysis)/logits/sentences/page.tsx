"use client";

import React from "react";
import Section from "@/components/filter/section";
import { useLogitsSentenceUrlState } from "@/hooks/url-state/states";
import { useDecoder, useDecoderSentences } from "@/hooks/api/decoder";
import { DecoderRequest } from "@/types/request";
import PerExampleGrid from "@/components/graph/logit-lens/per-example-grid";
import Loading from "./loading";

const LogitsSentences = () => {
  const [logitsSentenceState] = useLogitsSentenceUrlState();

  const ready =
    !!logitsSentenceState.model &&
    !!logitsSentenceState.source_lang &&
    logitsSentenceState.sentence_id !== null;

  const { data: decoderSentences } = useDecoderSentences(
    logitsSentenceState.model,
    logitsSentenceState.source_lang,
  );

  console.log("model", logitsSentenceState.model);
  console.log("source_lang", logitsSentenceState.source_lang);
  console.log("sentence_id", logitsSentenceState.sentence_id);
  console.log("ready", ready);

  const request: DecoderRequest | null = ready
    ? {
        model_id: logitsSentenceState.model as string,
        lang_code: logitsSentenceState.source_lang as string,
        sentence_id: logitsSentenceState.sentence_id as number,
      }
    : null;

  console.log("request", request);

  const { data: decoderData, isLoading } = useDecoder(request);

  console.log("decoderData", decoderData);

  const selectedSentence =
    decoderSentences?.sentences.find(
      (s) => s.sentence_id === logitsSentenceState.sentence_id,
    ) ?? null;

  return (
    <Section
      title="Logits Sentences"
      pageKey="logitsSentence"
      state={logitsSentenceState}
    >
      <div>
        {selectedSentence && (
          <div>
            Sentences: {selectedSentence.sentence_id} - {selectedSentence.text}
          </div>
        )}
      </div>
      {isLoading ? (
        <Loading />
      ) : decoderData ? (
        <PerExampleGrid data={decoderData} />
      ) : null}
    </Section>
  );
};

export default LogitsSentences;
