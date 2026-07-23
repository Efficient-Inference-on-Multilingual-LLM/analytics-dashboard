"use client";

import React, { useMemo } from "react";
import { useLogitsDynamicUrlState } from "@/hooks/url-state/states";
import Section from "@/components/filter/section";
import LayerDynamicsChart, {
  LayerSeries,
} from "@/components/graph/logit-lens/logits-dynamic-chart";
import { useRoutingLanguage } from "@/hooks/api/languages";
import { RoutingsRequest } from "@/types/request";
import { useRoutingsOverview } from "@/hooks/api/routing";

const LogitsDynamic = () => {
  const [routingState] = useLogitsDynamicUrlState();
  const { data: routingLanguages } = useRoutingLanguage();

  const ready =
    !!routingState.model &&
    !!routingState.source_lang &&
    routingState.pivot_langs.length > 0;

  const request: RoutingsRequest | null = ready
    ? {
        model_id: routingState.model as string,
        source_lang: [routingState.source_lang as string],
        pivot_lang: routingState.pivot_langs as string[],
        layer: null,
      }
    : null;
  const { data } = useRoutingsOverview(request);

  const nameOf = useMemo(() => {
    const m: Record<string, string> = {};
    (routingLanguages?.languages ?? []).forEach((l) => (m[l.code] = l.name));
    return m;
  }, [routingLanguages]);

  const series: LayerSeries[] = useMemo(() => {
    const byPivot: Record<string, { layer: number; rate: number }[]> = {};
    (data?.rows ?? []).forEach((r) => {
      (byPivot[r.pivot_lang] ??= []).push({
        layer: r.layer,
        rate: r.routing_rate,
      });
    });
    return Object.entries(byPivot).map(([code, pts]) => {
      const sorted = pts.sort((a, b) => a.layer - b.layer);
      return {
        label: nameOf[code] ?? code,
        layers: sorted.map((p) => p.layer),
        rates: sorted.map((p) => p.rate),
      };
    });
  }, [data, nameOf]);
  return (
    <Section
      title="Logits Dynamic"
      pageKey="logitsDynamic"
      state={routingState}
    >
      <p>
        The rise is where the concept forms, the fall is where it translates
        out.
      </p>
      {series.length > 0 && <LayerDynamicsChart series={series} />}
    </Section>
  );
};

export default LogitsDynamic;
