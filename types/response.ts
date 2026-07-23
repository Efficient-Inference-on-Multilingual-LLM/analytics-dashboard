import {
  ComponentDtoSchema,
  ModelDtoSchema,
  LanguageDtoSchema,
  MethodDtoSchema,
  LayerHeatmapDtoSchema,
  LanguageGroupDtoSchema,
  ClusterDtoSchema,
  ModelComponentSeriesSchema,
  LayerTrendSchema,
  LanguageCellSchema,
  PerLayerResponseSchema,
  DynamicTrajectoryDtoSchema,
  DifferenceEndpointDtoSchema,
  RoutingDtoSchema,
  SentenceDtoSchema,
  DecoderDtoSchema,
} from "./dto";
import { z } from "zod";

export const ModelResponseSchema = z.object({
  models: z.array(ModelDtoSchema),
});

export const MethodResponseSchema = z.object({
  methods: z.array(MethodDtoSchema),
});

export const ComponentResponseSchema = z.object({
  components: z.array(ComponentDtoSchema),
});

export const LanguageResponseSchema = z.object({
  languages: z.array(LanguageDtoSchema),
  total: z.number(),
});

export const LayerHeatmapResponseSchema = z.object({
  method: z.string(),
  model_id: z.string(),
  component_id: z.string(),
  num_layers_total: z.number(),
  sort_groups: z.array(LanguageGroupDtoSchema).nullable().optional(),
  layers: z.array(LayerHeatmapDtoSchema),
});

export const DendogramResponseSchema = z.object({
  method: z.string(),
  model_id: z.string(),
  component_id: z.string(),
  layer: z.number().int(),
  languages: z.array(z.string()),
  linkage_matrices: z.array(z.array(z.number())),
  leaf_order: z.array(z.number()),
  max_distance: z.number(),
  clusters: z.array(ClusterDtoSchema),
});

export const TrajectoryLanguageResponseSchema = z.object({
  intersection: z.array(z.string()),
  union: z.array(z.string()),
  per_model: z.record(z.string(), z.array(z.string())),
  missing: z.array(
    z.object({
      model_id: z.string(),
      component_id: z.string(),
    }),
  ),
});

export const TrajectoryResponseSchema = z.object({
  method: z.string(),
  pivot_lang: z.string().nullable().optional(),
  languages: z.array(z.string()),
  sort_groups: z.array(LanguageGroupDtoSchema).nullable().optional(),
  data: z.array(ModelComponentSeriesSchema),
  missing: z.array(
    z.object({
      model_id: z.string(),
      component_id: z.string(),
    }),
  ),
});

export const LayerTrendResponseSchema = z.object({
  lines: z.array(LayerTrendSchema),
});

export const IndividualHeatmapResponseSchema = z.object({
  method: z.string(),
  model_id: z.string(),
  component_id: z.string(),
  main_language: z.string(),
  layers: z.array(z.number().int()),
  num_layers_total: z.number().int(),
  sort_groups: z.array(LanguageGroupDtoSchema).nullish(),
  rows: z.array(LanguageCellSchema).nullish(),
  grid: z.array(z.array(PerLayerResponseSchema)).nullish(),
  value_range: z.tuple([z.number(), z.number()]),
});

export const DynamicTrajectoryResponseSchema = z.object({
  method: z.string(),
  model_id: z.string(),
  metric_label: z.string(),
  y_axis_label: z.string(),
  pivot_language: z.string().nullable().optional(),
  x_labels: z.array(z.string()),
  markers: z.array(z.string()),
  series: z.array(DynamicTrajectoryDtoSchema),
  groups: z.array(LanguageGroupDtoSchema),
});

export const DifferenceResponseSchema = z.object({
  method: z.string(),
  model_id: z.string(),
  metric_label: z.string(),
  languages: z.array(z.string()),
  matrix: z.array(z.array(z.number().nullable())),
  value_range: z.tuple([z.number(), z.number()]),
  sort_groups: z.array(LanguageGroupDtoSchema),
  source: DifferenceEndpointDtoSchema,
  target: DifferenceEndpointDtoSchema,
});

// RoutingsResponse Schema
export const RoutingsResponseSchema = z.object({
  models: z.array(z.string()),
  layers: z.array(z.number().int()),
  rows: z.array(RoutingDtoSchema),
});

export const SentenceDecoderResponseSchema = z.object({
  model_id: z.string(),
  lang_code: z.string(),
  sentences: z.array(SentenceDtoSchema),
});

export const DecoderResponseSchema = z.object({
  model_id: z.string(),
  lang_code: z.string(),
  sentence_id: z.number().int(),
  layers: z.array(z.number().int()),
  positions: z.array(z.number().int()),
  input_tokens: z.array(z.string()),
  cells: z.array(DecoderDtoSchema),
});

export type RoutingsResponse = z.infer<typeof RoutingsResponseSchema>;
export type ModelResponse = z.infer<typeof ModelResponseSchema>;
export type MethodResponse = z.infer<typeof MethodResponseSchema>;
export type ComponentResponse = z.infer<typeof ComponentResponseSchema>;
export type LanguageResponse = z.infer<typeof LanguageResponseSchema>;
export type LayerHeatmapResponse = z.infer<typeof LayerHeatmapResponseSchema>;
export type DendogramResponse = z.infer<typeof DendogramResponseSchema>;
export type TrajectoryLanguageResponse = z.infer<
  typeof TrajectoryLanguageResponseSchema
>;
export type TrajectoryResponse = z.infer<typeof TrajectoryResponseSchema>;
export type LayerTrendResponse = z.infer<typeof LayerTrendResponseSchema>;
export type IndividualHeatmapResponse = z.infer<
  typeof IndividualHeatmapResponseSchema
>;
export type DynamicTrajectoryResponse = z.infer<
  typeof DynamicTrajectoryResponseSchema
>;
export type DifferenceResponse = z.infer<typeof DifferenceResponseSchema>;
export type SentenceDecoderResponse = z.infer<
  typeof SentenceDecoderResponseSchema
>;
export type DecoderResponse = z.infer<typeof DecoderResponseSchema>;
