/**
 * Create/Edit quote form - used by QuoteCreatePage and QuoteEdit (modal or page)
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import type { Quote, QuoteStatus } from '../../types/quote.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { QuoteLineItemsEditor } from './QuoteLineItemsEditor';
import type { QuoteLineItem } from '../../types/quote.types';

const STATUS_OPTIONS: QuoteStatus[] = ['draft', 'sent', 'viewed', 'accepted', 'declined', 'expired'];

export interface QuoteFormValues {
  title: string;
  clientName: string;
  clientEmail: string;
  status: QuoteStatus;
  validUntil: string;
  notes: string;
  lineItems: QuoteLineItem[];
}

export interface QuoteFormProps {
  defaultValues?: Partial<Quote>;
  onSubmit: (values: QuoteFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

const defaultLineItem: QuoteLineItem = {
  id: `li-${Date.now()}`,
  description: '',
  quantity: 1,
  unitPrice: 0,
  amount: 0,
};

export const QuoteForm: React.FC<QuoteFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save Quote',
  loading = false,
}) => {
  const [lineItems, setLineItems] = React.useState<QuoteLineItem[]>(
    defaultValues?.lineItems?.length
      ? defaultValues.lineItems
      : [defaultLineItem]
  );

  const { register, handleSubmit, formState: { errors } } = useForm<QuoteFormValues>({
    defaultValues: {
      title: defaultValues?.title ?? '',
      clientName: defaultValues?.clientName ?? '',
      clientEmail: defaultValues?.clientEmail ?? '',
      status: defaultValues?.status ?? 'draft',
      validUntil: defaultValues?.validUntil
        ? new Date(defaultValues.validUntil).toISOString().slice(0, 10)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      notes: defaultValues?.notes ?? '',
      lineItems: defaultValues?.lineItems ?? [defaultLineItem],
    },
  });

  const totalAmount = lineItems.reduce((sum, i) => sum + i.amount, 0);

  const doSubmit = (data: QuoteFormValues) => {
    onSubmit({ ...data, lineItems });
  };

  return (
    <form onSubmit={handleSubmit(doSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Quote title"
          placeholder="e.g. Website redesign"
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />
        <Input
          label="Client name"
          placeholder="Company or contact name"
          error={errors.clientName?.message}
          {...register('clientName', { required: 'Client name is required' })}
        />
        <Input
          label="Client email"
          type="email"
          placeholder="client@example.com"
          {...register('clientEmail')}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary"
            {...register('status')}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <Input
          label="Valid until"
          type="date"
          {...register('validUntil', { required: 'Valid until is required' })}
        />
      </div>

      <QuoteLineItemsEditor items={lineItems} onChange={setLineItems} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={3}
          placeholder="Optional notes"
          {...register('notes')}
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-lg font-semibold text-gray-900">
          Total: {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(totalAmount)}
        </p>
        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
};
