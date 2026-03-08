/**
 * Edit quote line items (description, quantity, unit price, amount)
 */

import React from 'react';
import type { QuoteLineItem } from '../../types/quote.types';
import { Button } from '../ui/Button';

function generateId() {
  return `li-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface QuoteLineItemsEditorProps {
  items: QuoteLineItem[];
  onChange: (items: QuoteLineItem[]) => void;
  currency?: string;
}

function recalcAmount(items: QuoteLineItem[]): QuoteLineItem[] {
  return items.map((item) => ({
    ...item,
    amount: item.quantity * item.unitPrice,
  }));
}

export const QuoteLineItemsEditor: React.FC<QuoteLineItemsEditorProps> = ({
  items,
  onChange,
  currency = 'USD',
}) => {
  const updateItem = (index: number, updates: Partial<QuoteLineItem>) => {
    const next = [...items];
    next[index] = { ...next[index], ...updates };
    onChange(recalcAmount(next));
  };

  const addRow = () => {
    onChange(
      recalcAmount([
        ...items,
        {
          id: generateId(),
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
        },
      ])
    );
  };

  const removeRow = (index: number) => {
    const next = items.filter((_, i) => i !== index);
    onChange(recalcAmount(next));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Line items</h4>
        <Button variant="outline" size="sm" onClick={addRow}>
          + Add line
        </Button>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Description</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 w-24">Qty</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 w-28">Unit price</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 w-28">Amount</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <tr key={item.id}>
                <td className="px-3 py-2">
                  <input
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    value={item.description}
                    onChange={(e) => updateItem(index, { description: e.target.value })}
                    placeholder="Item description"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-right"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, { quantity: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm text-right"
                    value={item.unitPrice || ''}
                    onChange={(e) =>
                      updateItem(index, { unitPrice: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="px-3 py-2 text-right text-sm text-gray-700">
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency,
                  }).format(item.amount)}
                </td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {items.length > 0 && (
        <p className="text-sm text-gray-500">
          Total:{' '}
          <strong>
            {new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(
              items.reduce((sum, i) => sum + i.amount, 0)
            )}
          </strong>
        </p>
      )}
    </div>
  );
};
