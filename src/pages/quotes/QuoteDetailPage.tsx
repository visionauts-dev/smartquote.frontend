/**
 * Quote detail page - single quote view with edit/delete
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { setCurrentQuote } from '../../redux/slices/quotesSlice';
import { openModal } from '../../redux/slices/uiSlice';
import type { Quote } from '../../types/quote.types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { QuoteDetailCard } from '../../components/quotes/QuoteDetailCard';

const QuoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, currentQuote } = useAppSelector((state) => state.quotes);

  const quote = currentQuote ?? (items as Quote[]).find((q) => q.id === id) ?? null;

  useEffect(() => {
    if (id && quote) dispatch(setCurrentQuote(quote));
  }, [id, quote, dispatch]);

  if (!id) {
    navigate('/quotes');
    return null;
  }

  if (!quote) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <p className="text-gray-500 mb-4">Quote not found.</p>
        <Link to="/quotes">
          <Button variant="outline">Back to Quotes</Button>
        </Link>
      </div>
    );
  }

  const handleEdit = () => navigate(`/quotes/${id}/edit`);
  const handleDelete = () => {
    dispatch(openModal({ id: 'deleteQuote', payload: { quoteId: id } }));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <PageHeader
        title={quote.title}
        description={`Client: ${quote.clientName}`}
        actions={
          <div className="flex gap-2">
            <Link to="/quotes">
              <Button variant="outline">Back to list</Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          </div>
        }
      />
      <QuoteDetailCard quote={quote} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default QuoteDetailPage;
