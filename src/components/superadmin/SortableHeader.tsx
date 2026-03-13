import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortConfig } from "@/hooks/useSortable";

interface SortableHeaderProps<K extends string> {
  label: string;
  sortKey: K;
  sortConfig: SortConfig<K>;
  onToggle: (key: K) => void;
  className?: string;
}

export function SortableHeader<K extends string>({
  label, sortKey, sortConfig, onToggle, className = "",
}: SortableHeaderProps<K>) {
  const active = sortConfig?.key === sortKey;
  const Icon = active ? (sortConfig!.dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <th
      className={`text-left px-4 py-3 font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors ${className}`}
      onClick={() => onToggle(sortKey)}
    >
      {label}
      <Icon className={`inline h-3 w-3 ml-1 ${active ? "text-foreground" : "text-muted-foreground/50"}`} />
    </th>
  );
}
