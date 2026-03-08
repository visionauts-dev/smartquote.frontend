/**
 * Edit existing quote page
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { updateQuoteLocal, clearQuotesError } from '../../redux/slices/quotesSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QuoteForm } from '../../components/quotes/QuoteForm';
import type { QuoteFormValues } from '../../components/quotes/QuoteForm';
import type { Quote } from '../../types/quote.types';

const QuoteEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.quotes);

  const quote = id ? (items as Quote[]).find((q) => q.id === id) ?? null : null;

  useEffect(() => {
    return () => {
      dispatch(clearQuotesError());
    };
  }, [dispatch]);

  if (!id) {
    navigate('/quotes');
    return null;
  }

  if (!quote) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <p className="text-gray-500">Quote not found.</p>
        <Link to="/quotes">
          <span className="text-primary font-medium">Back to Quotes</span>
        </Link>
      </div>
    );
  }

  const handleSubmit = (values: QuoteFormValues) => {
    const totalAmount = values.lineItems.reduce((s, i) => s + i.amount, 0);
    const updated: Quote = {
      ...quote,
      title: values.title,
      clientName: values.clientName,
      clientEmail: values.clientEmail || undefined,
      status: values.status,
      totalAmount,
      validUntil: values.validUntil,
      lineItems: values.lineItems,
      notes: values.notes || undefined,
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateQuoteLocal(updated));
    dispatch(showToast({ message: 'Quote updated', type: 'success' }));
    navigate(`/quotes/${quote.id}`);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <PageHeader
        title="Edit Quote"
        description={`Editing: ${quote.title}`}
        actions={
          <Link to={`/quotes/${id}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
        }
      />
      <Card padding="lg">
        <QuoteForm
          defaultValues={quote}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/quotes/${id}`)}
          submitLabel="Save changes"
        />
      </Card>
    </div>
  );
};

export default QuoteEditPage;
