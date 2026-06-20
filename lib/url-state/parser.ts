import {
  parseAsArrayOf,
  parseAsString,
  createParser,
  parseAsStringLiteral,
  parseAsInteger,
  parseAsFloat,
} from "nuqs/server";
import { encodeLangs, decodeLangs } from "./lang-codec";
import {
  GROUP_BY_OPTIONS,
  LINKAGE_METHODS,
  AGGREGATION_OPTIONS,
} from "@/types/constant";

const groupByValues = GROUP_BY_OPTIONS.map(
  (opt: { value: string; label: string }) => opt.value,
);
const linkageValues = LINKAGE_METHODS.map(
  (opt: { value: string; label: string }) => opt.value,
);

const aggregationValues = AGGREGATION_OPTIONS.map(
  (opt: { value: string; label: string }) => opt.value,
);

const arrayEqual = (a: string[], b: string[]) => {
  return a.length === b.length && a.every((v, i) => v === b[i]);
};

const baseStringArray = parseAsArrayOf(parseAsString);

const strArray = () =>
  createParser({
    parse: baseStringArray.parse,
    serialize: baseStringArray.serialize,
    eq: arrayEqual,
  })
    .withDefault([])
    .withOptions({ clearOnDefault: true });

const parseAsLangs = createParser({
  parse: decodeLangs,
  serialize: encodeLangs,
  eq: arrayEqual,
}).withDefault([]);

export const heatmapParser = {
  method: parseAsStringLiteral(["cka", "cknna", "silhoutte", "lape"]),
  model: parseAsString.withDefault(""),
  component: parseAsString.withDefault(""),
  layer: parseAsInteger.withDefault(0),
  top_k: parseAsString,
  group_by: parseAsStringLiteral(groupByValues).withDefault("family"),
  linkage: parseAsStringLiteral(linkageValues).withDefault("average"),
  cluster_cutoff: parseAsInteger.withDefault(50),
  regions: strArray(),
  families: strArray(),
  subfamilies: strArray(),
  subsubfamilies: strArray(),
  scripts: strArray(),
  syntaxes: strArray(),
  vocabs: strArray(),
  phonetics: strArray(),
  joshiClasses: parseAsArrayOf(parseAsInteger).withDefault([]),
  languages: parseAsLangs.withDefault([]),

  s: parseAsString,
  c: parseAsString,
};

export const crossModelParser = {
  method: parseAsStringLiteral(["cka", "cknna", "silhoutte", "lape"]),
  models: strArray(),
  components: strArray(),
  top_k: parseAsString,
  group_by: parseAsStringLiteral(groupByValues).withDefault("family"),
  aggregation: parseAsStringLiteral(aggregationValues).withDefault("all"),
  depth_range: parseAsArrayOf(parseAsFloat).withDefault([0, 100]),
  pivot_language: parseAsString,
  regions: strArray(),
  families: strArray(),
  subfamilies: strArray(),
  subsubfamilies: strArray(),
  scripts: strArray(),
  syntaxes: strArray(),
  vocabs: strArray(),
  phonetics: strArray(),
  joshiClasses: parseAsArrayOf(parseAsInteger).withDefault([]),
  languages: parseAsLangs.withDefault([]),

  s: parseAsString,
  c: parseAsString,
};

export const layerTrendParser = {
  method: parseAsStringLiteral(["silhouette"]).withDefault("silhouette"),
  models: strArray(),
  components: strArray(),
  factors: strArray(),

  s: parseAsString,
  c: parseAsString,
};

export const individualHeatmapParser = {
  method: parseAsStringLiteral(["cka", "cknna", "silhoutte", "lape"]),
  model: parseAsString.withDefault(""),
  component: parseAsString.withDefault(""),
  layer_range: parseAsArrayOf(parseAsInteger),
  top_k: parseAsString,
  group_by: parseAsStringLiteral(groupByValues).withDefault("family"),
  regions: strArray(),
  families: strArray(),
  subfamilies: strArray(),
  subsubfamilies: strArray(),
  scripts: strArray(),
  syntaxes: strArray(),
  vocabs: strArray(),
  phonetics: strArray(),
  joshiClasses: parseAsArrayOf(parseAsInteger).withDefault([]),
  languages: parseAsLangs.withDefault([]),
  mode: parseAsStringLiteral(["languages", "per-layer"]).withDefault(
    "languages",
  ),
  mainLanguage: parseAsString,

  s: parseAsString,
  c: parseAsString,
};

export const individualHeatmapRankParser = {
  method: parseAsStringLiteral(["cka", "cknna", "silhoutte", "lape"]),
  model: parseAsString.withDefault(""),
  component: parseAsString.withDefault(""),
  layer_range: parseAsArrayOf(parseAsInteger),
  rank_range: parseAsArrayOf(parseAsInteger).withDefault([0, 10]),
  top_k: parseAsString,
  group_by: parseAsStringLiteral(groupByValues).withDefault("family"),
  regions: strArray(),
  families: strArray(),
  subfamilies: strArray(),
  subsubfamilies: strArray(),
  scripts: strArray(),
  syntaxes: strArray(),
  vocabs: strArray(),
  phonetics: strArray(),
  joshiClasses: parseAsArrayOf(parseAsInteger).withDefault([]),
  languages: parseAsLangs.withDefault([]),
  mode: parseAsStringLiteral(["languages", "per-layer"]).withDefault(
    "per-layer",
  ),
  mainLanguage: parseAsString,

  s: parseAsString,
  c: parseAsString,
};

export const dynamicTrajectoryParser = {
  method: parseAsStringLiteral(["cka", "cknna", "silhoutte", "lape"]),
  model: parseAsString.withDefault(""),
  components: strArray(),
  layer_range: parseAsArrayOf(parseAsInteger),
  top_k: parseAsString,
  group_by: parseAsStringLiteral(groupByValues).withDefault("family"),
  regions: strArray(),
  families: strArray(),
  subfamilies: strArray(),
  subsubfamilies: strArray(),
  scripts: strArray(),
  syntaxes: strArray(),
  vocabs: strArray(),
  phonetics: strArray(),
  joshiClasses: parseAsArrayOf(parseAsInteger).withDefault([]),
  languages: parseAsLangs.withDefault([]),
  mainLanguage: parseAsString,

  s: parseAsString,
  c: parseAsString,
};

export const differenceHeatmapParser = {
  method: parseAsStringLiteral(["cka", "cknna", "silhoutte", "lape"]),
  model: parseAsString.withDefault(""),
  src_component: parseAsString.withDefault(""),
  tgt_component: parseAsString.withDefault(""),
  src_layer: parseAsInteger.withDefault(0),
  tgt_layer: parseAsInteger.withDefault(0),
  top_k: parseAsString,
  languages: parseAsLangs.withDefault([]),

  s: parseAsString,
  c: parseAsString,
};

export type HeatmapUrlState = {
  [K in keyof typeof heatmapParser]: ReturnType<
    (typeof heatmapParser)[K]["parse"]
  >;
};

export type CrossModelUrlState = {
  [K in keyof typeof crossModelParser]: ReturnType<
    (typeof crossModelParser)[K]["parse"]
  >;
};

export type LayerTrendUrlState = {
  [K in keyof typeof layerTrendParser]: ReturnType<
    (typeof layerTrendParser)[K]["parse"]
  >;
};

export type IndividualHeatmapUrlState = {
  [K in keyof typeof individualHeatmapParser]: ReturnType<
    (typeof individualHeatmapParser)[K]["parse"]
  >;
};

export type IndividualHeatmapRankUrlState = {
  [K in keyof typeof individualHeatmapRankParser]: ReturnType<
    (typeof individualHeatmapRankParser)[K]["parse"]
  >;
};

export type DynamicHeatmapUrlState = {
  [K in keyof typeof dynamicTrajectoryParser]: ReturnType<
    (typeof dynamicTrajectoryParser)[K]["parse"]
  >;
};

export type DifferenceHeatmapUrlState = {
  [K in keyof typeof differenceHeatmapParser]: ReturnType<
    (typeof differenceHeatmapParser)[K]["parse"]
  >;
};
