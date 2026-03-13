import { useState, useMemo } from "react";

export type SortDir = "asc" | "desc";
export type SortConfig<K extends string> = { key: K; dir: SortDir } | null;

export function useSortable<T, K extends string>(
  items: T[],
  comparators: Record<K, (a: T, b: T) => number>
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<K>>(null);

  const toggleSort = (key: K) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.dir === "asc" ? { key, dir: "desc" } : null;
      }
      return { key, dir: "asc" };
    });
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig) return items;
    const cmp = comparators[sortConfig.key];
    if (!cmp) return items;
    const dir = sortConfig.dir === "asc" ? 1 : -1;
    return [...items].sort((a, b) => cmp(a, b) * dir);
  }, [items, sortConfig, comparators]);

  return { sortedItems, sortConfig, toggleSort };
}
