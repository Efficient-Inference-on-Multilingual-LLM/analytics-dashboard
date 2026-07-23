"use client";

import React, { useMemo, useState } from "react";
import Section from "@/components/filter/section";
import { useLogitsHeatmapUrlState } from "@/hooks/url-state/states";
import { useRoutingLanguage } from "@/hooks/api/languages";
import { RoutingsRequest } from "@/types/request";
import { useRoutingsOverview } from "@/hooks/api/routing";
import PivotMatrixChart from "@/components/graph/logit-lens/logits-heatmap";

const LogitsHeatmap = () => {
  const [logitsHeatmapState] = useLogitsHeatmapUrlState();
  const { data: routingLanguages } = useRoutingLanguage();
  const [excludeHomographs] = useState<boolean>(false);

  const ready = !!logitsHeatmapState.model && logitsHeatmapState.layer !== null;

  const request: RoutingsRequest | null = ready
    ? {
        model_id: logitsHeatmapState.model as string,
        source_lang: null,
        pivot_lang: null,
        layer: logitsHeatmapState.layer as number,
      }
    : null;

  const { data } = useRoutingsOverview(request);

  const meta = useMemo(() => {
    const m: Record<string, { name: string; joshi: number }> = {};
    (routingLanguages?.languages ?? []).forEach((l) => {
      m[l.code] = { name: l.name, joshi: l.joshi_class };
    });
    return m;
  }, [routingLanguages]);

  const rateKey = excludeHomographs ? "routing_rate_unamb" : "routing_rate";

  const { z, sources, pivots } = useMemo(() => {
    const rows = data?.rows ?? [];
    const order = (codes: string[]) =>
      [...new Set(codes)].sort(
        (a, b) =>
          (meta[b]?.joshi ?? 0) - (meta[a]?.joshi ?? 0) ||
          (meta[a]?.name ?? a).localeCompare(meta[b]?.name ?? b),
      );
    const srcCodes = order(rows.map((r) => r.source_lang));
    const pivCodes = order(rows.map((r) => r.pivot_lang));
    const lut: Record<string, number> = {};
    rows.forEach((r) => (lut[`${r.source_lang}|${r.pivot_lang}`] = r[rateKey]));
    const grid = srcCodes.map((s) =>
      pivCodes.map((p) => lut[`${s}|${p}`] ?? 0),
    );
    return {
      z: grid,
      sources: srcCodes.map((c) => meta[c]?.name ?? c),
      pivots: pivCodes.map((c) => meta[c]?.name ?? c),
    };
  }, [data, meta, rateKey]);
  return (
    <Section
      title="Logits Heatmap"
      pageKey="logitsHeatmap"
      state={logitsHeatmapState}
    >
      <div>
        Bright column = a language the model routes through. Diagonal = stays in
        its own language.
      </div>
      {data && (
        <PivotMatrixChart
          z={z}
          sources={sources}
          pivots={pivots}
          height={420}
        />
      )}
    </Section>
  );
};

export default LogitsHeatmap;
