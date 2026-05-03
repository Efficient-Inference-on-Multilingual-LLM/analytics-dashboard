export const METHODS = [
    {
        value: "cka", 
        label: "Central Kernel Alignment"
    },
    {
        value: "silhouette",
        label: "Silhouette Score"
    },
    {
        value: "lape",
        label: "Language Activation Probability Entropy",
    }
];

export const MODELS = [
  { id: "gemma-3-12b-it",     label: "Gemma 3 12B Instruct",        layerCount: 48 },
  { id: "smollm3-3b",         label: "SmolLM 3 3B",                 layerCount: 36 },
  { id: "qwen3-14b",          label: "Qwen 3 14B",                  layerCount: 40 },
  { id: "gpt-oss-20b",        label: "GPT OSS 20B",                 layerCount: 44 },
  { id: "olmo2-13b-instruct", label: "OLMo2 13B Instruct",          layerCount: 40 },
  { id: "qwen15-moe",         label: "Qwen 1.5 MoE 14.3B A2.7B",    layerCount: 24 },
];

export const COMPONENTS = [
  { value: "residual-preattn",  label: "Residual Pre-Attn" },
  { value: "residual-postattn", label: "Residual Post-Attn" },
  { value: "attention",         label: "Attention" },
  { value: "mlp",               label: "MLP" },
  { value: "output",            label: "Output" },
];