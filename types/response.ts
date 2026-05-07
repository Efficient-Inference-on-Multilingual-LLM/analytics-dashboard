import { ComponentDtoSchema, ModelDtoSchema, LanguageDtoSchema } from "./dto";
import { z } from "zod";

export const ModelResponseSchema = z.object({
  models: z.array(ModelDtoSchema),
});

export const ComponentResponseSchema = z.object({
  components: z.array(ComponentDtoSchema),
});

export const LanguageResponseSchema = z.object({
  languages: z.array(LanguageDtoSchema),
  total: z.number(),
});

export type ModelResponse = z.infer<typeof ModelResponseSchema>;
export type ComponentResponse = z.infer<typeof ComponentResponseSchema>;
export type LanguageResponse = z.infer<typeof LanguageResponseSchema>;
