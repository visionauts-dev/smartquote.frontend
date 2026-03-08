/**
 * Create new quote page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { addQuoteLocal, clearQuotesError } from '../../redux/slices/quotesSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { QuoteForm } from '../../components/quotes/QuoteForm';
import type { QuoteFormValues } from '../../components/quotes/QuoteForm';
import type { Quote } from '../../types/quote.types';

const QuoteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.quotes);

  React.useEffect(() => {
    return () => {
      dispatch(clearQuotesError());
    };
  }, [dispatch]);

  const handleSubmit = (values: QuoteFormValues) => {
    const now = new Date().toISOString();
    const totalAmount = values.lineItems.reduce((s, i) => s + i.amount, 0);
    const quote: Quote = {
      id: `q-${Date.now()}`,
      title: values.title,
      clientName: values.clientName,
      clientEmail: values.clientEmail || undefined,
      status: values.status,
      totalAmount,
      currency: 'USD',
      validUntil: values.validUntil,
      createdAt: now,
      updatedAt: now,
      lineItems: values.lineItems,
      notes: values.notes || undefined,
    };
    dispatch(addQuoteLocal(quote));
    dispatch(showToast({ message: 'Quote created successfully', type: 'success' }));
    navigate(`/quotes/${quote.id}`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <PageHeader
        title="Create Quote"
        description="Add a new quote for your client"
      />
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      <Card padding="lg">
        <QuoteForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/quotes')}
          submitLabel="Create Quote"
        />
      </Card>
    </div>
  );
};

export default QuoteCreatePage;
