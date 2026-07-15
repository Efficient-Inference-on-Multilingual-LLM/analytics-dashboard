"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import { RoutingsRequest } from "@/types/request";
import { useRoutingOverviewUrlState } from "@/hooks/url-state/states";
import { useRoutingsOverview } from "@/hooks/api/routing";
import { useRoutingLanguage } from "@/hooks/api/languages";
import RoutingOverviewChart, {
  RoutingBar,
} from "@/components/graph/logit-lens/routing-overview-chart";

const LogitsRouting = () => {
  const [routingState] = useRoutingOverviewUrlState();
  const { data: routingLanguages } = useRoutingLanguage();

  const ready =
    !!routingState.model &&
    routingState.source_langs.length > 0 &&
    !!routingState.pivot_lang;

  const request: RoutingsRequest | null = ready
    ? {
        model_id: routingState.model as string,
        source_lang: routingState.source_langs as string[],
        pivot_lang: routingState.pivot_lang as string,
        layer: routingState.layer ? Number(routingState.layer) : null,
      }
    : null;

  const {
    data: routingData,
    isLoading,
    isError,
  } = useRoutingsOverview(request);
  const meta = useMemo(() => {
    const m: Record<string, { name: string; joshi: number }> = {};
    (routingLanguages?.languages ?? []).forEach((l) => {
      m[l.code] = { name: l.name, joshi: l.joshi_class };
    });
    return m;
  }, [routingLanguages]);

  const rateKey = routingState.exclude_homographs
    ? "routing_rate_unamb"
    : "routing_rate";

  const bars: RoutingBar[] = useMemo(() => {
    const rows = (routingData?.rows ?? []).filter(
      (r) => r.source_lang !== r.pivot_lang, // drop the self-cell
    );
    return rows
      .map((r) => ({
        code: r.source_lang,
        label: meta[r.source_lang]?.name ?? r.source_lang,
        joshi: meta[r.source_lang]?.joshi ?? r.resource_class,
        rate: r[rateKey],
        n: r.n_position,
      }))
      .sort((a, b) => b.joshi - a.joshi || a.label.localeCompare(b.label));
  }, [routingData, meta, rateKey]);

  // const pivotName =
  //   meta[routingState.pivot_lang as string]?.name ?? routingState.pivot_lang;

  if (!ready) return <div>Select a model, pivot language, and layer.</div>;
  if (isLoading) return <div>Loading…</div>;
  if (isError) return <div>Could not load routing data.</div>;
  if (!bars.length) return <div>No rows for this selection.</div>;

  return (
    <Section
      title="Logits Routing Overview"
      pageKey="routingOverview"
      state={routingState}
    >
      <RoutingOverviewChart bars={bars} />
    </Section>
  );
};

export default LogitsRouting;
