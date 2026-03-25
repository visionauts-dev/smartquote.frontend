/**
 * Data grid with GridHeader and InfiniteScroll of GridRowItems
 */

import React from 'react';
import { GridHeader } from './GridHeader';
import { GridRowItem } from './GridRowItem';
import InfiniteScrollLib from 'react-infinite-scroll-component';
import type { GridColumn } from './GridHeader';
import type { GridRowAction } from './GridRowItem';

export interface GridRowData {
  id: string;
  cells: Record<string, React.ReactNode>;
  rowLink?: string;
  status?: { label: string; variant: 'quoted' | 'pending' | 'inprogress' | 'cancelled' | 'rejected' };
  actions?: GridRowAction[];
  onDelete?: () => void;
  onDoubleClick?: () => void;
}

export interface GridProps {
  columns: GridColumn[];
  rows: GridRowData[];
  /** Column order (must include all column ids + 'action' if actions shown) */
  columnOrder: string[];
  showCheckbox?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Infinite scroll: load more when reaching end */
  hasMore?: boolean;
  loadMore?: () => void;
  /** Sort state */
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: (columnId: string) => void;
  onFilter?: (columnId: string) => void;
  /** Optional: max height for grid body to enable scroll (e.g. '60vh'). Required for infinite scroll. */
  scrollHeight?: string | number;
}

const SCROLL_CONTAINER_ID = 'grid-scroll-container';

export const Grid: React.FC<GridProps> = ({
  columns,
  rows,
  columnOrder,
  showCheckbox = false,
  isLoading = false,
  hasMore = false,
  loadMore = () => {},
  sortColumn = null,
  sortDirection = null,
  onSort,
  onFilter,
}) => {
  const useInfiniteScroll = hasMore && loadMore;

  const tableBody = (
    <tbody className="bg-white divide-y divide-gray-200">
      {isLoading && rows.length === 0 ? (
        <tr>
          <td colSpan={columnOrder.length} className="px-3 lg:px-4 py-6 lg:py-8 text-center text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-6 lg:h-8 w-6 lg:w-8 border-b-2 border-primary"></div>
              <span className="ml-1 lg:ml-2 text-xs lg:text-sm">Loading...</span>
            </div>
          </td>
        </tr>
      ) : rows.length === 0 ? (
        <tr>
          <td colSpan={columnOrder.length} className="px-3 lg:px-4 py-6 lg:py-8 text-center text-gray-500 text-xs lg:text-sm">
            No data available
          </td>
        </tr>
      ) : (
        rows.map((row) => (
          <GridRowItem
            key={row.id}
            id={row.id}
            cells={row.cells}
            rowLink={row.rowLink}
            status={row.status}
            actions={row.actions}
            onDelete={row.onDelete}
            onDoubleClick={row.onDoubleClick}
            columnOrder={columnOrder}
            showCheckbox={showCheckbox}
          />
        ))
      )}
    </tbody>
  );

  const tableEl = (
    <table className="min-w-full divide-y divide-gray-200">
      <GridHeader
        columns={columns}
        showCheckbox={showCheckbox}
        onSort={onSort}
        onFilter={onFilter}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />
      {tableBody}
    </table>
  );

  if (useInfiniteScroll) {
    return (
      <div
        id={SCROLL_CONTAINER_ID}
        className="h-full overflow-x-auto overflow-y-auto"
      >
        <InfiniteScrollLib
          dataLength={rows.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<div className="py-4 text-center text-sm text-gray-500">Loading more...</div>}
          scrollableTarget={SCROLL_CONTAINER_ID}
        >
          {tableEl}
        </InfiniteScrollLib>
      </div>
    );
  }

  return <div className="h-full overflow-x-auto overflow-y-auto">{tableEl}</div>;
};
