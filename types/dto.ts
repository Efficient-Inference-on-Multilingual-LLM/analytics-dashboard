import { z } from "zod";

export const ModelDtoSchema = z.object({
  id: z.string(),
  label: z.string(),
  layerCount: z.number(),
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
});

export type MethodDto = z.infer<typeof MethodDtoSchema>;
export type ModelDto = z.infer<typeof ModelDtoSchema>;
export type ComponentDto = z.infer<typeof ComponentDtoSchema>;
export type LanguageDto = z.infer<typeof LanguageDtoSchema>;
