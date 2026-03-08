/**
 * Quotes list page with filters and table
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import {
  fetchQuotes,
  setFilterStatus,
  setSearchQuery,
  clearQuoteSelection,
} from '../../redux/slices/quotesSlice';
import { openModal } from '../../redux/slices/uiSlice';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { QuoteFilters } from '../../components/quotes/QuoteFilters';
import { QuoteTable } from '../../components/quotes/QuoteTable';
const QuotesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    filterStatus,
    searchQuery,
    isLoading,
  } = useAppSelector((state) => state.quotes);

  useEffect(() => {
    dispatch(fetchQuotes());
    dispatch(clearQuoteSelection());
  }, [dispatch]);

  const filteredQuotes = React.useMemo(() => {
    let list = [...items];
    if (filterStatus) list = list.filter((q) => q.status === filterStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (quote) =>
          quote.title.toLowerCase().includes(q) ||
          quote.clientName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filterStatus, searchQuery]);

  const handleClearFilters = () => {
    dispatch(setFilterStatus(null));
    dispatch(setSearchQuery(''));
  };

  const handleDelete = (id: string) => {
    dispatch(openModal({ id: 'deleteQuote', payload: { quoteId: id } }));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PageHeader
        title="Quotes"
        description="Create and manage your quotes"
        actions={
          <Link to="/quotes/new">
            <Button leftIcon={<span>+</span>}>New Quote</Button>
          </Link>
        }
      />
      <QuoteFilters
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        onSearchChange={(v) => dispatch(setSearchQuery(v))}
        onStatusChange={(v) => dispatch(setFilterStatus(v))}
        onClear={handleClearFilters}
      />
      <QuoteTable
        quotes={filteredQuotes}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
};

export default QuotesPage;
