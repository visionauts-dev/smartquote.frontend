/**
 * Product Form Component
 * Form for creating and editing products with inline attribute table editor
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { ProductDto, UpdateProductDto } from '../../types/api.types';

interface AttributeRow {
  key: string;
  value: string;
}

interface ProductFormProps {
  initialData?: ProductDto | null;
  onSubmit: (data: UpdateProductDto) => Promise<void>;
  onCancel: () => void;
}

function parseAttributeRows(attributes?: string | null): AttributeRow[] {
  if (!attributes) return [];
  try {
    const parsed = JSON.parse(attributes);
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.entries(parsed).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    }
  } catch {
    // not valid JSON
  }
  return [];
}

function attributeRowsToJson(rows: AttributeRow[]): string {
  const obj: Record<string, string> = {};
  rows.forEach(({ key, value }) => {
    if (key.trim()) obj[key.trim()] = value;
  });
  return JSON.stringify(obj);
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [attributeRows, setAttributeRows] = useState<AttributeRow[]>(
    parseAttributeRows(initialData?.attributes)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductDto>({
    defaultValues: initialData
      ? {
        vendorId: initialData.vendorId,
        subcategoryId: initialData.subcategoryId,
        vendorCatNo: initialData.vendorCatNo ?? '',
        model: initialData.model ?? '',
        mrp: String(initialData.mrp),
        stdPkg: initialData.stdPkg ?? undefined,
        addOns: initialData.addOns,
        description: initialData.description ?? '',
      }
      : {},
  });

  const handleAttributeChange = (index: number, field: 'key' | 'value', val: string) => {
    setAttributeRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, [field]: val } : row))
    );
  };

  const handleAddRow = () => {
    setAttributeRows((rows) => [...rows, { key: '', value: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setAttributeRows((rows) => rows.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (formData: UpdateProductDto) => {
    await onSubmit({
      ...formData,
      attributes: attributeRowsToJson(attributeRows),
    });
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Page Title */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
          {isEditMode ? 'Edit Product' : 'Add Product'}
        </h2>
        {isEditMode && (
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {initialData.vendor} &mdash; {initialData.category} / {initialData.subcategory}
          </p>
        )}
      </div>

      {/* Core fields */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {/* Vendor Name (read-only display) */}
        <div>
          <label style={labelStyle}>Vendor Name</label>
          <div style={readonlyStyle}>{initialData?.vendor ?? '—'}</div>
        </div>

        {/* Category (read-only display) */}
        <div>
          <label style={labelStyle}>Category</label>
          <div style={readonlyStyle}>{initialData?.category ?? '—'}</div>
        </div>

        {/* Subcategory (read-only display) */}
        <div>
          <label style={labelStyle}>Sub Category</label>
          <div style={readonlyStyle}>{initialData?.subcategory ?? '—'}</div>
        </div>

        {/* Cat No */}
        <div>
          <label style={labelStyle}>Cat No</label>
          <Input type="text" placeholder="Vendor catalog number" {...register('vendorCatNo')} />
        </div>

        {/* Model */}
        <div>
          <label style={labelStyle}>Model</label>
          <Input type="text" placeholder="Product model" {...register('model')} />
        </div>

        {/* MRP */}
        <div>
          <label style={labelStyle}>MRP (₹)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('mrp', { required: 'MRP is required' })}
          />
          {errors.mrp && (
            <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
              {errors.mrp.message}
            </p>
          )}
        </div>
      </div>

      {/* Hidden required IDs */}
      <input type="hidden" {...register('vendorId', { required: true })} />
      <input type="hidden" {...register('subcategoryId', { required: true })} />

      {/* Attributes Table */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}
        >
          <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Attributes
          </label>
          <button
            type="button"
            onClick={handleAddRow}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 12px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#2563eb',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            + Add Attribute
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={thStyle}>Attribute Name</th>
              <th style={thStyle}>Value</th>
              <th style={{ ...thStyle, width: '48px' }}></th>
            </tr>
          </thead>
          <tbody>
            {attributeRows.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '13px',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  No attributes yet. Click "+ Add Attribute" to add one.
                </td>
              </tr>
            ) : (
              attributeRows.map((row, index) => (
                <tr key={index} style={{ background: index % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.key}
                      onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                      placeholder="e.g. rating"
                      style={cellInputStyle}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                      placeholder="e.g. 63A"
                      style={cellInputStyle}
                    />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        fontSize: '16px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        lineHeight: 1,
                      }}
                      title="Remove"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: '14px',
        position: 'sticky', bottom: 0,
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '12px 0 0',
        marginTop: '8px',
      }}>
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="whitespace-nowrap px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '4px',
};

const readonlyStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  fontSize: '14px',
  color: '#374151',
  minHeight: '38px',
};

const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  border: '1px solid #e5e7eb',
};

const tdStyle: React.CSSProperties = {
  padding: '6px 8px',
  border: '1px solid #e5e7eb',
};

const cellInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '6px 8px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '13px',
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
};

export default ProductForm;
