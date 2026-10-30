export type ComboboxFilterOption = {
  label: string;
  /** Extra words that match but aren't shown (a category, a former name). */
  keywords?: readonly string[];
};

/** Rank of a match: lower comes first. `null` means no match. */
function matchRank(text: string, query: string): number | null {
  const haystack = text.toLowerCase();
  if (haystack.startsWith(query)) return 0;
  if (haystack.split(/[\s\-_/]+/).some((word) => word.startsWith(query))) return 1;
  if (haystack.includes(query)) return 2;
  return null;
}

/**
 * Default **Combobox** filter, case-insensitive: labels that start with the query, then labels with a
 * word that starts with it, then labels that contain it; keywords match after labels. Options keep
 * their given order within a rank. An empty query returns every option.
 */
export function filterComboboxOptions<T extends ComboboxFilterOption>(options: readonly T[], query: string): T[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return [...options];

  const ranked: Array<{ option: T; rank: number; index: number }> = [];
  options.forEach((option, index) => {
    const labelRank = matchRank(option.label, needle);
    const keywordRanks = (option.keywords ?? []).map((keyword) => matchRank(keyword, needle)).filter((rank) => rank != null);
    const rank = labelRank ?? (keywordRanks.length > 0 ? 3 + Math.min(...keywordRanks) : null);
    if (rank != null) ranked.push({ option, rank, index });
  });
  ranked.sort((a, b) => a.rank - b.rank || a.index - b.index);
  return ranked.map((entry) => entry.option);
}

/** What the polite live region says after the list changes. */
export function comboboxResultsMessage(total: number, shown: number, emptyText: string): string {
  if (total === 0) return emptyText;
  const noun = total === 1 ? "result" : "results";
  if (shown < total) return `${total.toLocaleString("en-US")} ${noun}, first ${shown} shown. Keep typing to narrow.`;
  return `${total.toLocaleString("en-US")} ${noun}`;
}
