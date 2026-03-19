/**
 * DataGrid - Unified grid component using GenericGridHeader and GenericGridRowItem
 * Handles sorting, filtering, pagination, infinite scroll, and responsive layout
 */

import React, { useCallback } from 'react';
import InfiniteScrollLib from 'react-infinite-scroll-component';
import { GenericGridHeader, type SortDirection, type GenericHeaderConfig } from '../GridHeader/GenericGridHeader';
import { GenericGridRowItem, type ColumnConfig, type ActionButton } from '../GridRowItem/GenericGridRowItem';

export interface DataGridProps<T = any> {
  /** Array of items to display */
  items: T[];
  /** Column configuration */
  columns: ColumnConfig<T>[];
  /** Header configuration */
  headers: GenericHeaderConfig[];
  /** Action buttons for each row */
  actions?: ActionButton<T>[];
  /** Loading state */
  isLoading?: boolean;
  /** Infinite scroll: indicate if more items available */
  hasMore?: boolean;
  /** Callback to load more items */
  onLoadMore?: () => void;
  /** Callback when row is clicked */
  onRowClick?: (item: T) => void;
  /** Callback when row is double-clicked */
  onRowDoubleClick?: (item: T) => void;
  /** Callback when sort is requested */
  onSort?: (field: string, direction: SortDirection) => void;
  /** Callback for bulk actions (checkbox) */
  onBulkAction?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Show checkbox column */
  showCheckbox?: boolean;
  /** Show indicator column */
  showIndicator?: boolean;
  /** Selected items */
  selectedItems?: Set<string>;
  /** Container height for fixed scroll */
  containerHeight?: string;
  /** Custom className */
  className?: string;
}

const SCROLL_CONTAINER_ID = 'data-grid-scroll-container';

export const DataGrid = React.forwardRef<HTMLDivElement, DataGridProps>(
  (
    {
      items,
      columns,
      headers,
      actions,
      isLoading = false,
      hasMore = false,
      onLoadMore,
      onRowClick,
      onRowDoubleClick,
      onSort,
      onBulkAction,
      showCheckbox = false,
      showIndicator = false,
      selectedItems = new Set(),
      containerHeight = '100%',
      className = '',
    },
    ref
  ) => {
    const useInfiniteScroll = hasMore && onLoadMore;
    const isAllSelected = items.length > 0 && selectedItems.size === items.length;

    const handleCheckboxChange = useCallback(
      (_item: unknown, e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        // This should be handled by parent component
      },
      []
    );

    const renderContent = () => (
      <>
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="px-2.5 py-1.5">
            <GenericGridHeader
              headers={headers}
              handleSort={onSort}
              handleBulkAction={onBulkAction}
              isAllSelected={isAllSelected}
            />
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col divide-y divide-[#ddd]">
          {isLoading && items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-sm text-gray-500">No data available</span>
            </div>
          ) : (
            items.map((item, index) => {
              // Get ID from item (assumes item has an 'id' property)
              const itemId = (item as Record<string, unknown>).id as string;
              const isSelected = selectedItems.has(itemId);

              return (
                <GenericGridRowItem
                  key={itemId || index}
                  item={item}
                  columns={columns}
                  actions={actions}
                  showCheckbox={showCheckbox}
                  isSelected={isSelected}
                  onCheckboxChange={handleCheckboxChange}
                  onRowClick={onRowClick}
                  onRowDoubleClick={onRowDoubleClick}
                  showIndicator={showIndicator}
                />
              );
            })
          )}

          {/* Loading more indicator */}
          {isLoading && items.length > 0 && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <div className="text-xs text-gray-500">Loading more...</div>
            </div>
          )}
        </div>
      </>
    );

    if (useInfiniteScroll) {
      return (
        <div
          ref={ref}
          id={SCROLL_CONTAINER_ID}
          className={`overflow-x-hidden overflow-y-auto flex flex-col ${className}`}
          style={{ height: containerHeight }}
        >
          <InfiniteScrollLib
            dataLength={items.length}
            next={onLoadMore}
            hasMore={hasMore}
            loader={<div className="py-4 text-center text-xs text-gray-500">Loading more...</div>}
            scrollableTarget={SCROLL_CONTAINER_ID}
          >
            {renderContent()}
          </InfiniteScrollLib>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`overflow-x-hidden overflow-y-auto flex flex-col ${className}`}
        style={{ height: containerHeight }}
      >
        {renderContent()}
      </div>
    );
  }
);

DataGrid.displayName = 'DataGrid';

export default DataGrid;
