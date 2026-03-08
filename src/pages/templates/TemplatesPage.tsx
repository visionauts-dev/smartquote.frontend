/**
 * Templates list page
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks';
import { fetchTemplates } from '../../redux/slices/templatesSlice';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const TemplatesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PageHeader
        title="Templates"
        description="Reusable quote templates to create quotes faster"
        actions={
          <Link to="/templates/new">
            <Button>New Template</Button>
          </Link>
        }
      />
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
      {isLoading ? (
        <Card padding="lg">
          <p className="text-gray-500 text-center py-8">Loading templates...</p>
        </Card>
      ) : items.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No templates yet. Create one to reuse line items and structure.</p>
            <Link to="/templates/new">
              <Button>Create Template</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t: { id: string; name: string; description?: string; lineItems: unknown[] }) => (
            <Card key={t.id} padding="md" hover>
              <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
              {t.description && (
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{t.description}</p>
              )}
              <p className="text-xs text-gray-400 mb-4">
                {t.lineItems.length} item(s)
              </p>
              <div className="flex gap-2">
                <Link to={`/quotes/new?templateId=${t.id}`}>
                  <Button variant="outline" size="sm">Use for quote</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;
