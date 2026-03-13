import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(items: T[], perPage: number) {
  const [page, setPage] = useState(1);

  // Reset to page 1 when items change (filters/search)
  useEffect(() => {
    setPage(1);
  }, [items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  const from = items.length === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, items.length);

  return {
    paginatedItems,
    page,
    totalPages,
    from,
    to,
    total: items.length,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    goToPage: setPage,
    showPagination: totalPages > 1,
  };
}
