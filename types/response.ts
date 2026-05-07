import {
  ComponentDtoSchema,
  ModelDtoSchema,
  LanguageDtoSchema,
  MethodDtoSchema,
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

export type ModelResponse = z.infer<typeof ModelResponseSchema>;
export type MethodResponse = z.infer<typeof MethodResponseSchema>;
export type ComponentResponse = z.infer<typeof ComponentResponseSchema>;
export type LanguageResponse = z.infer<typeof LanguageResponseSchema>;
