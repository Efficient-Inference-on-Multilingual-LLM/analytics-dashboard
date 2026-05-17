import { LanguageDto } from "@/types/dto";

export interface LanguageFilters {
  regions: string[];
  families: string[];
  subfamilies: string[];
  subsubfamilies: string[];
  scripts: string[];
  joshiClasses: number[];
  syntaxes: string[];
  vocabs: string[];
  phonetics: string[];
  languages: string[];
}

export interface FilterResults {
  effectiveLanguages: string[];
  allRegions: string[];
  allFamilies: string[];
  allSubfamilies: string[];
  allSubsubfamilies: string[];
  allScripts: string[];
  allJoshiClasses: number[];
  allSyntaxes: string[];
  allVocabs: string[];
  allPhonetics: string[];
  allLanguages: { code: string; name: string }[];
  activeFilterCount: number;
  conflictingFilters: string[];
}

export const DEFAULT_FILTERS: LanguageFilters = {
  regions: [],
  families: [],
  subfamilies: [],
  subsubfamilies: [],
  scripts: [],
  joshiClasses: [],
  syntaxes: [],
  vocabs: [],
  phonetics: [],
  languages: [],
};

const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr)).sort();

export function applyFilters(
  allLanguages: LanguageDto[],
  filters: LanguageFilters,
): FilterResults {
  const matchRegion = (lang: LanguageDto) =>
    filters.regions.length === 0 || filters.regions.includes(lang.region);
  const matchFamily = (lang: LanguageDto) =>
    filters.families.length === 0 || filters.families.includes(lang.family);
  const matchSubfamily = (lang: LanguageDto) =>
    filters.subfamilies.length === 0 ||
    filters.subfamilies.includes(lang.subfamily);
  const matchSubsubfamily = (lang: LanguageDto) =>
    filters.subsubfamilies.length === 0 ||
    filters.subsubfamilies.includes(lang.subsubfamily);
  const matchScript = (lang: LanguageDto) =>
    filters.scripts.length === 0 || filters.scripts.includes(lang.script);
  const matchJoshi = (lang: LanguageDto) =>
    filters.joshiClasses.length === 0 || filters.joshiClasses.includes(lang.joshi_class);
  const matchSyntax = (lang: LanguageDto) =>
    filters.syntaxes.length === 0 || filters.syntaxes.includes(lang.syntax);
  const matchVocab = (lang: LanguageDto) =>
    filters.vocabs.length === 0 || filters.vocabs.includes(lang.vocab);
  const matchPhonetics = (lang: LanguageDto) =>
    filters.phonetics.length === 0 ||
    filters.phonetics.includes(lang.phonetics);
  const matchLanguage = (lang: LanguageDto) =>
    filters.languages.length === 0 || filters.languages.includes(lang.code);

  const filtered = allLanguages.filter(
    (lang) =>
      matchRegion(lang) &&
      matchFamily(lang) &&
      matchSubfamily(lang) &&
      matchSubsubfamily(lang) &&
      matchScript(lang) &&
      matchJoshi(lang) &&
      matchSyntax(lang) &&
      matchVocab(lang) &&
      matchPhonetics(lang) &&
      matchLanguage(lang),
  );

  const activeFilters: string[] = [];
  if (filters.regions.length) activeFilters.push("Region");
  if (filters.families.length) activeFilters.push("Family");
  if (filters.subfamilies.length) activeFilters.push("Subfamily");
  if (filters.subsubfamilies.length) activeFilters.push("Sub-subfamily");
  if (filters.scripts.length) activeFilters.push("Script");
  if (filters.joshiClasses.length) activeFilters.push("Joshi Class");
  if (filters.syntaxes.length) activeFilters.push("Syntax");
  if (filters.vocabs.length) activeFilters.push("Vocab");
  if (filters.phonetics.length) activeFilters.push("Phonetics");
  if (filters.languages.length) activeFilters.push("Language");

  return {
    effectiveLanguages: filtered.map((l) => l.code),
    allRegions: unique(allLanguages.map((l) => l.region)),
    allFamilies: unique(allLanguages.map((l) => l.family)),
    allSubfamilies: unique(allLanguages.map((l) => l.subfamily)),
    allSubsubfamilies: unique(allLanguages.map((l) => l.subsubfamily)),
    allScripts: unique(allLanguages.map((l) => l.script)),
    allJoshiClasses: unique(allLanguages.map((l) => l.joshi_class)),
    allSyntaxes: unique(allLanguages.map((l) => l.syntax)),
    allVocabs: unique(allLanguages.map((l) => l.vocab)),
    allPhonetics: unique(allLanguages.map((l) => l.phonetics)),
    allLanguages: unique(
      allLanguages
        .map((l) => ({ code: l.code, name: l.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    ),
    activeFilterCount: activeFilters.length,
    conflictingFilters: filtered.length === 0 ? activeFilters : [],
  };
}
