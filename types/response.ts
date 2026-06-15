import {
  ComponentDtoSchema,
  ModelDtoSchema,
  LanguageDtoSchema,
  MethodDtoSchema,
  LayerHeatmapDtoSchema,
  LanguageGroupDtoSchema,
  ClusterDtoSchema,
  ModelComponentSeriesSchema,
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
