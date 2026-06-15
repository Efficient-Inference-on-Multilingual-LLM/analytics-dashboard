import { z } from "zod";

export const LayerHeatmapRequestSchema = z.object({
  method_id: z.string(),
  model_id: z.string(),
  component_id: z.string(),
  layer_range: z
    .tuple([z.number().int(), z.number().int()])
    .nullable()
    .optional(),
  layer_indices: z.array(z.number().int()).nullable().optional(),
  sort_by: z.string(),
  languages: z.array(z.string()).nullable().optional(),
  top_k: z.number().nullable().optional(),
});

export const DendogramRequestSchema = z.object({
  method_id: z.string(),
  model_id: z.string(),
  component_id: z.string(),
  layer: z.number().int(),
  languages: z.array(z.string()).nullable().optional(),
  sort_by: z.string(),
  linkage_method: z.string().nullable().optional(),
  cluster_cutoff: z.number(),
  top_k: z.number().nullable().optional(),
});

export const LanguageResultRequestSchema = z.object({
  method_id: z.string(),
  model_id: z.string(),
  component_id: z.string(),
  top_k: z.number().nullable().optional(),
});

export const TrajectoryLanguageRequestSchema = z.object({
  method: z.string(),
  model_ids: z.array(z.string()),
  component_ids: z.array(z.string()),
  top_k: z.number().nullable().optional(),
});

export const TrajectoryRequest = z.object({
  method_id: z.string(),
  model_ids: z.array(z.string()),
  component_ids: z.array(z.string()),
  languages: z.array(z.string()).nullable().optional(),
  top_k: z.number().nullable().optional(),
  main_language: z.string().nullable().optional(),
  sort_by: z.string().nullable().optional(),
  depth_range: z.tuple([z.number().int(), z.number().int()]),
});

export type LayerHeatmapRequest = z.infer<typeof LayerHeatmapRequestSchema>;
export type DendogramRequest = z.infer<typeof DendogramRequestSchema>;
export type LanguageResultRequest = z.infer<typeof LanguageResultRequestSchema>;
export type TrajectoryLanguageRequest = z.infer<
  typeof TrajectoryLanguageRequestSchema
>;
export type TrajectoryRequest = z.infer<typeof TrajectoryRequest>;
