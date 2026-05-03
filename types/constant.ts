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
  { value: "gemma-3-12b-it",     label: "Gemma 3 12B Instruct",        layerCount: 48 },
  { value: "smollm3-3b",         label: "SmolLM 3 3B",                 layerCount: 36 },
  { value: "qwen3-14b",          label: "Qwen 3 14B",                  layerCount: 40 },
  { value: "gpt-oss-20b",        label: "GPT OSS 20B",                 layerCount: 44 },
  { value: "olmo2-13b-instruct", label: "OLMo2 13B Instruct",          layerCount: 40 },
  { value: "qwen15-moe",         label: "Qwen 1.5 MoE 14.3B A2.7B",    layerCount: 24 },
];

export const COMPONENTS = [
  { value: "residual-preattn",  label: "Residual Pre-Attn" },
  { value: "residual-postattn", label: "Residual Post-Attn" },
  { value: "attention",         label: "Attention" },
  { value: "mlp",               label: "MLP" },
  { value: "output",            label: "Output" },
];

export const GROUP_BY_OPTIONS = [
  { value: "family",       label: "Language Family" },
  { value: "subfamily",    label: "Sub-family" },
  { value: "subsubfamily", label: "Sub-sub-family" },
  { value: "region",       label: "Region" },
  { value: "joshi",        label: "Joshi Class" },
  { value: "syntax",       label: "Syntax" },
  { value: "script",       label: "Script" },
  { value: "phonetics",    label: "Phonetics" },
  { value: "vocab",        label: "Vocab" },
  { value: "tokenScript",  label: "Token Script" },
  { value: "none",         label: "None" },
]

export const AGGREGATION_OPTIONS = [
  { value: "mean", label: "Mean" },
  { value: "all", label: "All" },
]