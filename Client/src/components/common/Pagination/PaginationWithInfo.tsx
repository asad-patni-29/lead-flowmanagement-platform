import { useMemo } from 'react';
import Pagination from './Pagination';

interface PaginationWithInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

/**
 * Enhanced Pagination component that includes item count information
 * Shows "Showing X to Y of Z results"
 */
const PaginationWithInfo = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  maxVisiblePages = 7,
}: PaginationWithInfoProps) => {
  const { startItem, endItem } = useMemo(() => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { startItem: start, endItem: end };
  }, [currentPage, pageSize, totalItems]);

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      {/* Info Text */}
      <div className="text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span>{' '}
        {totalItems === 1 ? 'result' : 'results'}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          maxVisiblePages={maxVisiblePages}
        />
      )}
    </div>
  );
};

export default PaginationWithInfo;
