"use client";

import React, { useMemo } from "react";
import Section from "@/components/filter/section";
import { useCrossModelUrlState } from "@/hooks/url-state/states";
import SortGroupLegend from "@/components/graph/sort-group-legend";
import { useModels } from "@/hooks/api/models";
import { useLanguageRegistry } from "@/hooks/api/languages";
import {
  useCrossModelTrajectoryLanguages,
  useTrajectory,
} from "@/hooks/api/trajectory";
import { applyFilters, DEFAULT_FILTERS } from "@/lib/filter/language-filter";
import ComponentTrajectoryChart from "@/components/graph/cross-model/component-trajectory";
import EfficacyChart from "@/components/graph/cross-model/effiacy-trajectory";
import CombinedChart from "@/components/graph/cross-model/combined-trajectory";
import { TrajectoryRequest } from "@/types/request";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CrossModelPage = () => {
  const [urlState] = useCrossModelUrlState();
  const { data: modelsData } = useModels();
  const languageRegistry = useLanguageRegistry();

  const modelLabels = useMemo(() => {
    const m: Record<string, string> = {};
    (modelsData?.models ?? []).forEach((model) => (m[model.id] = model.label));
    return m;
  }, [modelsData]);

  const codeToName = useMemo(() => {
    const m: Record<string, string> = {};
    languageRegistry?.forEach((name, code) => (m[code] = name));
    return m;
  }, [languageRegistry]);

  const poolReady =
    !!urlState.method &&
    urlState.models.length > 0 &&
    urlState.components.length > 0;

  const languagePool = useCrossModelTrajectoryLanguages(
    poolReady
      ? {
          method: urlState.method!,
          model_ids: urlState.models,
          component_ids: urlState.components,
          top_k: urlState.top_k ? parseInt(urlState.top_k, 10) : null,
        }
      : null,
  );

  const langFilters = useMemo(
    () => ({
      regions: urlState.regions ?? DEFAULT_FILTERS.regions,
      families: urlState.families ?? DEFAULT_FILTERS.families,
      subfamilies: urlState.subfamilies ?? DEFAULT_FILTERS.subfamilies,
      subsubfamilies: urlState.subsubfamilies ?? DEFAULT_FILTERS.subsubfamilies,
      scripts: urlState.scripts ?? DEFAULT_FILTERS.scripts,
      syntaxes: urlState.syntaxes ?? DEFAULT_FILTERS.syntaxes,
      vocabs: urlState.vocabs ?? DEFAULT_FILTERS.vocabs,
      phonetics: urlState.phonetics ?? DEFAULT_FILTERS.phonetics,
      joshiClasses: urlState.joshiClasses ?? DEFAULT_FILTERS.joshiClasses,
      languages: urlState.languages ?? DEFAULT_FILTERS.languages,
    }),
    [urlState],
  );

  const effectiveLanguages = useMemo(() => {
    if (!languagePool?.languages) return [];
    return applyFilters(languagePool.languages, langFilters).effectiveLanguages;
  }, [languagePool, langFilters]);

  const trajectoryReady = poolReady && effectiveLanguages.length >= 2;

  const trajectoryRequest = useMemo<TrajectoryRequest | null>(() => {
    if (!trajectoryReady) return null;
    return {
      method_id: urlState.method!,
      model_ids: urlState.models,
      component_ids: urlState.components,
      languages: effectiveLanguages,
      main_language:
        urlState.aggregation === "mean"
          ? (urlState.pivot_language ?? null)
          : null,
      sort_by: urlState.group_by,
      depth_range: (urlState.depth_range as [number, number]) ?? [0, 100],
      top_k: urlState.top_k ? parseInt(urlState.top_k, 10) : null,
    };
  }, [trajectoryReady, urlState, effectiveLanguages]);

  const { data: trajectory, isLoading } = useTrajectory(trajectoryRequest!);

  const codes = trajectory?.languages ?? [];
  const groups = trajectory?.sort_groups ?? null;

  const componentIds = useMemo(
    () => [...new Set(trajectory?.data.map((b) => b.component_id) ?? [])],
    [trajectory],
  );
  const modelIds = useMemo(
    () => [...new Set(trajectory?.data.map((b) => b.model_id) ?? [])],
    [trajectory],
  );

  const orderedModels = useMemo(
    () => modelIds.map((id) => ({ id, label: modelLabels[id] ?? id })),
    [modelIds, modelLabels],
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Section
      title="Cross-Model Comparison"
      pageKey="crossModel"
      state={urlState}
    >
      <div className="flex justify-end">
        <SortGroupLegend
          groups={groups}
          showComponentLegend
          models={orderedModels}
          width={350}
          height={520}
        />
      </div>
      {trajectory && (
        <>
          {trajectory.missing.length > 0 && (
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
              No data for:{" "}
              {trajectory.missing
                .map(
                  (m) =>
                    `${modelLabels[m.model_id] ?? m.model_id} / ${m.component_id}`,
                )
                .join(", ")}
            </div>
          )}

          {componentIds.map((componentId) => {
            const blocks = trajectory.data.filter(
              (b) => b.component_id === componentId,
            );
            return blocks.length > 0 ? (
              <div
                key={componentId}
                className="rounded-lg border border-border p-4"
              >
                <ComponentTrajectoryChart
                  blocks={blocks}
                  componentId={componentId}
                  codes={codes}
                  groups={groups}
                  codeToName={codeToName}
                  modelLabels={modelLabels}
                  method={urlState.method ?? "cka"}
                />
              </div>
            ) : null;
          })}

          <div
            className={cn(
              "grid grid-cols-1 gap-4",
              modelIds.length > 1 ? "xl:grid-cols-2" : "",
            )}
          >
            {modelIds.map((modelId) => {
              const blocks = trajectory.data.filter(
                (b) => b.model_id === modelId,
              );
              return blocks.length > 0 ? (
                <div
                  key={modelId}
                  className="rounded-lg border border-border p-4"
                >
                  <EfficacyChart
                    blocks={blocks}
                    modelId={modelId}
                    modelLabel={modelLabels[modelId] ?? modelId}
                    codes={codes}
                    method={urlState.method ?? "cka"}
                  />
                </div>
              ) : null;
            })}
          </div>

          {trajectory.data.length > 0 && modelIds.length > 1 && (
            <div className="rounded-lg border border-border p-4">
              <CombinedChart
                data={trajectory.data}
                codes={codes}
                modelLabels={modelLabels}
                method={urlState.method ?? "cka"}
              />
            </div>
          )}
        </>
      )}
    </Section>
  );
};

export default CrossModelPage;
