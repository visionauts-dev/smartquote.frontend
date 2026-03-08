/**
 * Reusable data grid layout wrapper for menu pages
 */

import React from 'react';

export interface DataGridLayoutProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filterButton?: React.ReactNode;
  createButton?: React.ReactNode;
  statusPills?: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
}

export const DataGridLayout: React.FC<DataGridLayoutProps> = ({
  title,
  subtitle,
  searchPlaceholder = 'Search',
  onSearch,
  filterButton,
  createButton,
  statusPills,
  summary,
  children,
}) => {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {(onSearch || filterButton || createButton) && (
          <div className="p-4 flex flex-wrap items-center gap-4 border-b border-gray-200 bg-gray-50">
            {onSearch && (
              <div className="flex-1 min-w-[200px] relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  onChange={(e) => onSearch(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            )}
            {filterButton}
            {createButton}
          </div>
        )}

        {statusPills && (
          <div className="p-4 flex flex-wrap gap-2 border-b border-gray-200">
            {statusPills}
          </div>
        )}

        {summary && (
          <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 border-b border-gray-200">
            {summary}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
