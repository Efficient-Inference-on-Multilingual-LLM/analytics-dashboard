import { z } from "zod";

export const ModelDtoSchema = z.object({
  id: z.string(),
  label: z.string(),
  layer_count: z.number(),
});

export const ComponentDtoSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const LanguageDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
  region: z.string(),
  family: z.string(),
  subfamily: z.string(),
  subsubfamily: z.string(),
  script: z.string(),
  joshi_class: z.number(),
  syntax: z.string(),
  phonetics: z.string(),
  vocab: z.string(),
});

export const MethodDtoSchema = z.object({
  id: z.string(),
  label: z.string(),
  colorscale: z.string().nullable().optional(),
  required_top_k: z.union([
    z.array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    ),
    z.boolean(),
  ]),
  components: z.array(ComponentDtoSchema),
  models: z.array(ModelDtoSchema),
});

export const LanguageGroupDtoSchema = z.object({
  name: z.string(),
  color: z.string(),
  languages: z.array(z.string()),
});

export const LayerHeatmapDtoSchema = z.object({
  layer: z.number().int(),
  languages: z.array(z.string()),
  matrix: z.array(z.array(z.number())),
  value_range: z.tuple([z.number(), z.number()]),
});

export const ClusterDtoSchema = z.object({
  id: z.string(),
  languages: z.array(z.string()),
});

export const ModelComponentSeriesSchema = z.object({
  model_id: z.string(),
  component_id: z.string(),
  num_layers: z.number().int(),
  depth: z.array(z.number().int()),
  series: z.record(z.string(), z.array(z.number().nullable())),
});

export const LayerTrendSchema = z.object({
  model_id: z.string(),
  component_id: z.string(),
  factor: z.string(),
  layer: z.array(z.number().int()),
  layer_percentage: z.array(z.number()),
  score: z.array(z.number()),
});

export const LanguageCellSchema = z.object({
  language: z.string(),
  family: z.string(),
  color: z.string(),
  values: z.array(z.number()),
});

export const PerLayerResponseSchema = z.object({
  rank: z.number().int(),
  language: z.string(),
  score: z.number(),
  family: z.string(),
  color: z.string(),
});

export const DynamicTrajectoryDtoSchema = z.object({
  code: z.string(),
  name: z.string(),
  group: z.string(),
  color: z.string(),
  values: z.array(z.number()),
});

export const DifferenceEndpointDtoSchema = z.object({
  layer: z.number().int(),
  component: z.string(),
});

export const RoutingDtoSchema = z.object({
  model_id: z.string(),
  source_lang: z.string(),
  pivot_lang: z.string(),
  resource_class: z.number().int(),
  layer: z.number().int(),
  n_position: z.number().int(),
  n_match: z.number().int(),
  routing_rate: z.number(), // handles float/double
  n_match_unamb: z.number().int(),
  routing_rate_unamb: z.number(),
});

export const SentenceDtoSchema = z.object({
  sentence_id: z.number().int(),
  text: z.string(),
});

export const DecoderDtoSchema = z.object({
  layer: z.number().int(),
  position: z.number().int(),
  input_token_str: z.string(),
  token: z.string(),
  prob: z.number(),
});

export type MethodDto = z.infer<typeof MethodDtoSchema>;
export type ModelDto = z.infer<typeof ModelDtoSchema>;
export type ComponentDto = z.infer<typeof ComponentDtoSchema>;
export type LanguageDto = z.infer<typeof LanguageDtoSchema>;
export type LanguageGroupDto = z.infer<typeof LanguageGroupDtoSchema>;
export type LayerHeatmapDto = z.infer<typeof LayerHeatmapDtoSchema>;
export type ClusterDto = z.infer<typeof ClusterDtoSchema>;
export type ModelComponentSeries = z.infer<typeof ModelComponentSeriesSchema>;
export type LayerTrendDto = z.infer<typeof LayerTrendSchema>;
export type LanguageCell = z.infer<typeof LanguageCellSchema>;
export type PerLayerResponse = z.infer<typeof PerLayerResponseSchema>;
export type DynamicTrajectoryDto = z.infer<typeof DynamicTrajectoryDtoSchema>;
export type DifferenceEndpointDto = z.infer<typeof DifferenceEndpointDtoSchema>;
export type RoutingDto = z.infer<typeof RoutingDtoSchema>;
export type SentenceDto = z.infer<typeof SentenceDtoSchema>;
export type DecoderDto = z.infer<typeof DecoderDtoSchema>;
