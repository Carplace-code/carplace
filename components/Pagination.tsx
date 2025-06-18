import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(pageCount, page + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mt-4 flex flex-col items-center gap-2 sm:justify-between">
      <div className="flex items-center gap-2">
        {/* First page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className={
            "flex h-8 w-8 items-center justify-center rounded-md border hover:bg-gray-50" +
            "disabled:cursor-not-allowed disabled:opacity-50"
          }
          title="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        {/* Previous page */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={
            "flex h-8 w-8 items-center justify-center rounded-md border hover:bg-gray-50" +
            "disabled:cursor-not-allowed disabled:opacity-50"
          }
          title="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {visiblePages[0] > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-gray-50"
              >
                1
              </button>
              {visiblePages[0] > 2 && <span className="px-1 text-gray-400">...</span>}
            </>
          )}

          {visiblePages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm ${
                p === page ? "bg-blue-600 text-white" : "hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}

          {visiblePages[visiblePages.length - 1] < pageCount && (
            <>
              {visiblePages[visiblePages.length - 1] < pageCount - 1 && <span className="px-1 text-gray-400">...</span>}
              <button
                type="button"
                onClick={() => onPageChange(pageCount)}
                className="flex h-8 w-8 items-center justify-center rounded-md border text-sm hover:bg-gray-50"
              >
                {pageCount}
              </button>
            </>
          )}
        </div>

        {/* Next page */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          className={
            "flex h-8 w-8 items-center justify-center rounded-md border hover:bg-gray-50" +
            "disabled:cursor-not-allowed disabled:opacity-50"
          }
          title="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page */}
        <button
          type="button"
          onClick={() => onPageChange(pageCount)}
          disabled={page === pageCount}
          className={
            "flex h-8 w-8 items-center justify-center rounded-md border hover:bg-gray-50" +
            "disabled:cursor-not-allowed disabled:opacity-50"
          }
          title="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
      <div className="text-sm text-gray-600">
        Página {page} de {pageCount}
      </div>
    </div>
  );
}
