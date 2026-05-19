import React, { useMemo } from "react";
import MultiPicker from "../ui/multi-picker";
import { useLanguages } from "@/hooks/api/languages";
import { useFilterStore } from "@/store/filter-store";
import { applyFilters } from "@/lib/filter/language-filter";

interface LanguageFiltersProps {
  label: string;
}

const LanguageFilters = ({ label }: LanguageFiltersProps) => {
  const { data } = useLanguages();
  const filters = useFilterStore((state) => state.languageFilters);
  const setFilters = useFilterStore((state) => state.setLanguageFilters);
  const resetFilters = useFilterStore((state) => state.resetLanguageFilters);

  const allLanguages = data?.languages;
  const appliedFilters = useMemo(
    () => applyFilters(allLanguages ?? [], filters),
    [allLanguages, filters],
  );

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
        onChange={(value) => setFilters({ regions: value })}
      />
      <MultiPicker
        label="Family"
        selected={filters.families}
        options={toOptions(appliedFilters.allFamilies)}
        onChange={(value) => setFilters({ families: value })}
      />
      <MultiPicker
        label="Sub family"
        selected={filters.subfamilies}
        options={toOptions(appliedFilters.allSubfamilies)}
        onChange={(value) => setFilters({ subfamilies: value })}
      />
      <MultiPicker
        label="Sub-sub family"
        selected={filters.subsubfamilies}
        options={toOptions(appliedFilters.allSubsubfamilies)}
        onChange={(value) => setFilters({ subsubfamilies: value })}
      />
      <MultiPicker
        label="Joshi Class"
        selected={filters.joshiClasses.map(String)}
        options={appliedFilters.allJoshiClasses.map((j) => ({
          value: String(j),
          label: String(j),
        }))}
        onChange={(value) => setFilters({ joshiClasses: value.map(Number) })}
      />
      <MultiPicker
        label="Script"
        selected={filters.scripts}
        options={toOptions(appliedFilters.allScripts)}
        onChange={(value) => setFilters({ scripts: value })}
      />
      <MultiPicker
        label="Syntax"
        selected={filters.syntaxes}
        options={toOptions(appliedFilters.allSyntaxes)}
        onChange={(value) => setFilters({ syntaxes: value })}
      />
      <MultiPicker
        label="Vocab"
        selected={filters.vocabs}
        options={toOptions(appliedFilters.allVocabs)}
        onChange={(value) => setFilters({ vocabs: value })}
      />
      <MultiPicker
        label="Phonetics"
        selected={filters.phonetics}
        options={toOptions(appliedFilters.allPhonetics)}
        onChange={(value) => setFilters({ phonetics: value })}
      />
      <MultiPicker
        label="Language"
        selected={filters.languages}
        options={toOptions(appliedFilters.allLanguages?.map((l) => l.code) ?? [])}
        onChange={(value) => setFilters({ languages: value })}
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
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageFilters;
