import { useMemo } from 'react';
import Pagination from './Pagination';

interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  maxVisiblePages?: number;
  showInfo?: boolean;
}

/**
 * Advanced Pagination component with page size selector and item count info
 */
const AdvancedPagination = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  maxVisiblePages = 7,
  showInfo = true,
}: AdvancedPaginationProps) => {
  const { startItem, endItem } = useMemo(() => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { startItem: start, endItem: end };
  }, [currentPage, pageSize, totalItems]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
      // Reset to page 1 when changing page size
      onPageChange(1);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Top Section: Info and Page Size Selector */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        {/* Info Text */}
        {showInfo && (
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{startItem}</span> to{' '}
            <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
            <span className="font-semibold text-slate-900">{totalItems}</span>{' '}
            {totalItems === 1 ? 'result' : 'results'}
          </div>
        )}

        {/* Page Size Selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="pageSize" className="text-slate-600">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-700 transition hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-slate-600">per page</span>
          </div>
        )}
      </div>

      {/* Bottom Section: Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            maxVisiblePages={maxVisiblePages}
          />
        </div>
      )}
    </div>
  );
};

export default AdvancedPagination;
