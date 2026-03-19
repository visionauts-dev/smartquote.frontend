/**
 * Grid header row with sort/filter icons per column
 */

import React from 'react';

export interface GridColumn {
  id: string;
  label: string;
  /** Optional: align content (default left) */
  align?: 'left' | 'right' | 'center';
  /** Show sort icon */
  sortable?: boolean;
  /** Show filter icon */
  filterable?: boolean;
}

export interface GridHeaderProps {
  columns: GridColumn[];
  /** Optional: first column is a checkbox */
  showCheckbox?: boolean;
  onSort?: (columnId: string) => void;
  onFilter?: (columnId: string) => void;
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc' | null;
}

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }) {
  return (
    <svg className="w-4 h-4 inline-block ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : direction === 'desc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      )}
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4 inline-block ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

export const GridHeader: React.FC<GridHeaderProps> = ({
  columns,
  showCheckbox = false,
  onSort,
  onFilter,
  sortColumn = null,
  sortDirection = null,
}) => {
  return (
    <thead className="bg-gray-100 sticky top-0 z-10">
      <tr className="text-xs lg:text-sm">
        {showCheckbox && (
          <th className="px-2 lg:px-4 py-2 lg:py-3 text-left w-10 lg:w-12">
            <input type="checkbox" className="rounded border-gray-300" aria-label="Select all" />
          </th>
        )}
        {columns.map((col) => (
          <th
            key={col.id}
            className={`px-2 lg:px-4 py-2 lg:py-3 text-xs lg:text-xs font-medium text-gray-600 uppercase tracking-wider ${
              col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
            }`}
          >
            <span className="inline-flex items-center">
              {col.sortable !== false && onSort ? (
                <button
                  type="button"
                  onClick={() => onSort(col.id)}
                  className="hover:text-gray-900 flex items-center"
                >
                  {col.label}
                  <SortIcon direction={sortColumn === col.id ? sortDirection : null} />
                </button>
              ) : (
                col.label
              )}
              {col.filterable !== false && onFilter && (
                <button
                  type="button"
                  onClick={() => onFilter(col.id)}
                  className="ml-1 p-0.5 rounded hover:bg-gray-200"
                  aria-label={`Filter ${col.label}`}
                >
                  <FilterIcon />
                </button>
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
  );
};
