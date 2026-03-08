/**
 * Quotes table with status, client, amount, actions
 */

import React from 'react';
import { Link } from 'react-router-dom';
import type { Quote } from '../../types/quote.types';
import { Badge } from '../ui/Badge';
import type { BadgeVariant } from '../ui/Badge';
import { Button } from '../ui/Button';

const statusToVariant: Record<string, BadgeVariant> = {
  draft: 'draft',
  sent: 'sent',
  viewed: 'viewed',
  accepted: 'accepted',
  declined: 'declined',
  expired: 'expired',
};

function formatDate(s: string) {
  return new Date(s).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
}

export interface QuoteTableProps {
  quotes: Quote[];
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}

export const QuoteTable: React.FC<QuoteTableProps> = ({
  quotes,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-12 text-center text-gray-500">Loading quotes...</div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
        <p className="mb-4">No quotes yet. Create your first quote to get started.</p>
        <Link to="/quotes/new">
          <Button>Create Quote</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid until</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotes.map((q) => (
              <tr key={q.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <Link to={`/quotes/${q.id}`} className="font-medium text-primary hover:underline">
                    {q.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-700">{q.clientName}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusToVariant[q.status] ?? 'default'}>{q.status}</Badge>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {formatCurrency(q.totalAmount, q.currency)}
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(q.validUntil)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/quotes/${q.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => onDelete(q.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
