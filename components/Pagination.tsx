"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export default function PaginationComponent({ page, pageCount, onPageChange, disabled = false }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const start = Math.max(1, page - delta);
    const end = Math.min(pageCount, page + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < pageCount - 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination>
        <PaginationContent>
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => !disabled && page > 1 && onPageChange(page - 1)}
              className={`${
                page === 1 || disabled ? "pointer-events-none opacity-50" : "hover:bg-accent cursor-pointer"
              }`}
            />
          </PaginationItem>

          {/* First page */}
          {visiblePages[0] > 1 && (
            <PaginationItem>
              <PaginationLink
                onClick={() => !disabled && onPageChange(1)}
                className={disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Start ellipsis */}
          {showStartEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Visible page numbers */}
          {visiblePages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => !disabled && onPageChange(p)}
                isActive={p === page}
                className={disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* End ellipsis */}
          {showEndEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Last page */}
          {visiblePages[visiblePages.length - 1] < pageCount && (
            <PaginationItem>
              <PaginationLink
                onClick={() => !disabled && onPageChange(pageCount)}
                className={disabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
              >
                {pageCount}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              onClick={() => !disabled && page < pageCount && onPageChange(page + 1)}
              className={`${
                page === pageCount || disabled ? "pointer-events-none opacity-50" : "hover:bg-accent cursor-pointer"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Page info */}
      <div className="text-muted-foreground text-sm">
        Página {page} de {pageCount}
        {disabled && <span className="ml-2">(Cargando...)</span>}
      </div>
    </div>
  );
}
