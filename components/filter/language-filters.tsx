import React, { useMemo } from "react";
import MultiPicker from "../ui/multi-picker";
import { useLanguageRegistry, useResultLanguages } from "@/hooks/api/languages";
import { applyFilters } from "@/lib/filter/language-filter";
import { LanguageFilters as LangFilters } from "@/lib/filter/language-filter";
import { LanguageDto } from "@/types/dto";

interface LanguageFiltersProps {
  label: string;
  method: string | null;
  model: string | null;
  component: string | null;
  filters: LangFilters;
  onChange: (patch: Partial<LangFilters>) => void;
  onReset: () => void;
  languageData?: { languages: LanguageDto[] };
}

const LanguageFilters = ({
  label,
  method,
  model,
  component,
  filters,
  onChange,
  onReset,
  languageData: externalLanguageData,
}: LanguageFiltersProps) => {
  const languagesRegistry = useLanguageRegistry();

  const ready = !externalLanguageData && !!method && !!model && !!component;
  const request = ready
    ? {
        method_id: method,
        model_id: model,
        component_id: component,
      }
    : null;

  const { data: languagesData } = useResultLanguages(request);

  const allLanguages =
    externalLanguageData?.languages ?? languagesData?.languages;
  const appliedFilters = useMemo(
    () => applyFilters(allLanguages ?? [], filters),
    [allLanguages, filters],
  );
  const languageOptions = useMemo(() => {
    if (!languagesRegistry || !languagesData) return [];
    return appliedFilters.allLanguages.map((lang) => ({
      value: lang.code,
      label: languagesRegistry.get(lang.code) ?? lang.code,
    }));
  }, [appliedFilters.allLanguages, languagesRegistry, languagesData]);

  const toOptions = (arr: string[]) =>
    arr.map((item) => ({ value: item, label: item }));

  return (
    <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
      <div className="text-sm font-semibold uppercase tracking-wide">
        {label}
      </div>
      <MultiPicker
        label="Region"
        selected={filters.regions}
        options={toOptions(appliedFilters.allRegions)}
        onChange={(value) => onChange({ regions: value })}
      />
      <MultiPicker
        label="Family"
        selected={filters.families}
        options={toOptions(appliedFilters.allFamilies)}
        onChange={(value) => onChange({ families: value })}
      />
      <MultiPicker
        label="Sub family"
        selected={filters.subfamilies}
        options={toOptions(appliedFilters.allSubfamilies)}
        onChange={(value) => onChange({ subfamilies: value })}
      />
      <MultiPicker
        label="Sub-sub family"
        selected={filters.subsubfamilies}
        options={toOptions(appliedFilters.allSubsubfamilies)}
        onChange={(value) => onChange({ subsubfamilies: value })}
      />
      <MultiPicker
        label="Joshi Class"
        selected={filters.joshiClasses.map(String)}
        options={appliedFilters.allJoshiClasses.map((j) => ({
          value: String(j),
          label: String(j),
        }))}
        onChange={(value) => onChange({ joshiClasses: value.map(Number) })}
      />
      <MultiPicker
        label="Script"
        selected={filters.scripts}
        options={toOptions(appliedFilters.allScripts)}
        onChange={(value) => onChange({ scripts: value })}
      />
      <MultiPicker
        label="Syntax"
        selected={filters.syntaxes}
        options={toOptions(appliedFilters.allSyntaxes)}
        onChange={(value) => onChange({ syntaxes: value })}
      />
      <MultiPicker
        label="Vocab"
        selected={filters.vocabs}
        options={toOptions(appliedFilters.allVocabs)}
        onChange={(value) => onChange({ vocabs: value })}
      />
      <MultiPicker
        label="Phonetics"
        selected={filters.phonetics}
        options={toOptions(appliedFilters.allPhonetics)}
        onChange={(value) => onChange({ phonetics: value })}
      />
      <MultiPicker
        label="Language"
        selected={filters.languages}
        options={languageOptions}
        onChange={(value) => onChange({ languages: value })}
      />
      {appliedFilters.effectiveLanguages.length === 0 &&
      appliedFilters.activeFilterCount > 0 ? (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 space-y-1.5">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            No languages match all {appliedFilters.activeFilterCount} active
            filters
          </p>
          <p className="text-xs text-muted-foreground">
            Try removing: {appliedFilters.conflictingFilters.join(", ")}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <span className="text-xs font-mono text-muted-foreground tabular-nums">
            {appliedFilters.effectiveLanguages.length} /{" "}
            {allLanguages?.length ?? 0} languages
          </span>
          <button
            className="text-xs text-primary hover:underline"
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageFilters;
