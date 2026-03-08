/**
 * Quote detail view - read-only summary and line items
 */

import React from 'react';
import type { Quote } from '../../types/quote.types';
import { Badge } from '../ui/Badge';
import type { BadgeVariant } from '../ui/Badge';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

const statusVariant: Record<string, BadgeVariant> = {
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
    month: 'long',
    day: 'numeric',
  });
}

export interface QuoteDetailCardProps {
  quote: Quote;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const QuoteDetailCard: React.FC<QuoteDetailCardProps> = ({
  quote,
  onEdit,
  onDelete,
}) => {
  return (
    <Card padding="lg">
      <CardHeader
        title={quote.title}
        subtitle={`Created ${formatDate(quote.createdAt)}`}
        action={
          <div className="flex gap-2">
            <Badge variant={statusVariant[quote.status] ?? 'default'}>{quote.status}</Badge>
            {onEdit && <Button size="sm" variant="outline" onClick={onEdit}>Edit</Button>}
            {onDelete && (
              <Button size="sm" variant="ghost" className="text-red-600" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        }
      />
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <dt className="text-sm text-gray-500">Client</dt>
          <dd className="font-medium text-gray-900">{quote.clientName}</dd>
          {quote.clientEmail && (
            <dd className="text-sm text-gray-600">{quote.clientEmail}</dd>
          )}
        </div>
        <div>
          <dt className="text-sm text-gray-500">Valid until</dt>
          <dd className="font-medium text-gray-900">{formatDate(quote.validUntil)}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Total amount</dt>
          <dd className="text-xl font-bold text-primary">
            {new Intl.NumberFormat(undefined, {
              style: 'currency',
              currency: quote.currency,
            }).format(quote.totalAmount)}
          </dd>
        </div>
      </dl>

      <h4 className="text-sm font-medium text-gray-700 mb-2">Line items</h4>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit price</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quote.lineItems.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 text-gray-900">{item.description}</td>
                <td className="px-4 py-2 text-right text-gray-700">{item.quantity}</td>
                <td className="px-4 py-2 text-right text-gray-700">
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: quote.currency,
                  }).format(item.unitPrice)}
                </td>
                <td className="px-4 py-2 text-right font-medium text-gray-900">
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: quote.currency,
                  }).format(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {quote.notes && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{quote.notes}</p>
        </div>
      )}
    </Card>
  );
};
