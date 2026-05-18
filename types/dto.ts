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

export type MethodDto = z.infer<typeof MethodDtoSchema>;
export type ModelDto = z.infer<typeof ModelDtoSchema>;
export type ComponentDto = z.infer<typeof ComponentDtoSchema>;
export type LanguageDto = z.infer<typeof LanguageDtoSchema>;
export type LanguageGroupDto = z.infer<typeof LanguageGroupDtoSchema>;
export type LayerHeatmapDto = z.infer<typeof LayerHeatmapDtoSchema>;
export type ClusterDto = z.infer<typeof ClusterDtoSchema>;
