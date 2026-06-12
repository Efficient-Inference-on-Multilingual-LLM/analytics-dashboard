import {
  parseAsArrayOf,
  parseAsString,
  createParser,
  parseAsStringLiteral,
  parseAsInteger,
} from "nuqs";
import { encodeLangs, decodeLangs } from "./lang-codec";
import { GROUP_BY_OPTIONS, LINKAGE_METHODS } from "@/types/constant";

const groupByValues = GROUP_BY_OPTIONS.map(
  (opt: { value: string; label: string }) => opt.value,
);
const linkageValues = LINKAGE_METHODS.map(
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

export type HeatmapUrlState = {
  [K in keyof typeof heatmapParser]: ReturnType<
    (typeof heatmapParser)[K]["parse"]
  >;
};
