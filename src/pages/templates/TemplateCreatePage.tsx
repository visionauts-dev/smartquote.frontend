/**
 * Create new template page
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppHooks';
import { addTemplateLocal } from '../../redux/slices/templatesSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { QuoteLineItemsEditor } from '../../components/quotes/QuoteLineItemsEditor';
import type { QuoteLineItem } from '../../types/quote.types';
import type { QuoteTemplate } from '../../types/template.types';

const defaultLineItem: QuoteLineItem = {
  id: `li-${Date.now()}`,
  description: '',
  quantity: 1,
  unitPrice: 0,
  amount: 0,
};

const TemplateCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [lineItems, setLineItems] = React.useState<QuoteLineItem[]>([defaultLineItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const now = new Date().toISOString();
    const template: QuoteTemplate = {
      id: `t-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      lineItems,
      createdAt: now,
      updatedAt: now,
    };
    dispatch(addTemplateLocal(template));
    dispatch(showToast({ message: 'Template created', type: 'success' }));
    navigate('/templates');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <PageHeader
        title="New Template"
        description="Create a reusable quote template"
        actions={
          <Link to="/templates">
            <Button variant="outline">Cancel</Button>
          </Link>
        }
      />
      <Card padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Template name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Standard service package"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of when to use this template"
            />
          </div>
          <QuoteLineItemsEditor items={lineItems} onChange={setLineItems} />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Link to="/templates">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Create Template</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TemplateCreatePage;
