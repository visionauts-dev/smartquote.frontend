/**
 * Filter and search for quotes list
 */

import React from 'react';
import type { QuoteStatus } from '../../types/quote.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const STATUS_OPTIONS: { value: QuoteStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'viewed', label: 'Viewed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
];

export interface QuoteFiltersProps {
  searchQuery: string;
  filterStatus: QuoteStatus | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: QuoteStatus | null) => void;
  onClear?: () => void;
}

export const QuoteFilters: React.FC<QuoteFiltersProps> = ({
  searchQuery,
  filterStatus,
  onSearchChange,
  onStatusChange,
  onClear,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 min-w-0">
        <Input
          placeholder="Search by title or client..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent"
        value={filterStatus ?? ''}
        onChange={(e) =>
          onStatusChange((e.target.value as QuoteStatus) || null)
        }
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value || 'all'} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {onClear && (searchQuery || filterStatus) && (
        <Button variant="outline" onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  );
};
