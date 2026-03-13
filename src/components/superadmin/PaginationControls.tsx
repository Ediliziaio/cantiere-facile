import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  from: number;
  to: number;
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
  setPerPage: (n: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  showPagination: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function PaginationControls({
  from, to, total, page, totalPages, perPage, setPerPage, nextPage, prevPage, showPagination,
}: PaginationControlsProps) {
  if (!showPagination && total <= Math.min(...PAGE_SIZE_OPTIONS)) return null;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">{from}–{to} di {total} risultati</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Righe:</span>
          <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {showPagination && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Precedente
          </Button>
          <span className="text-xs text-muted-foreground">Pagina {page} di {totalPages}</span>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={page === totalPages}>
            Successivo <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
