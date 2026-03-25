/**
 * Product Edit Page
 * Form page for editing an existing product
 * Uses product data passed from grid (no API fetch)
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductForm from '../../components/products/ProductForm';
import { productsApi } from '../../services/api/productsApi';
import type { ProductDto } from '../../types/api.types';

const ProductEditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = (location.state as { product: ProductDto })?.product;

  if (!product) {
    return (
      <div className="h-full bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center">
        <span className="text-red-600">Product data not found. Please select a product from the grid.</span>
      </div>
    );
  }

  const handleSubmit = async (formData: any) => {
    try {
      await productsApi.update(product.id, formData);
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/products')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: '#6b7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          <span style={{ fontSize: '18px', lineHeight: 1 }}>&larr;</span>
          Back to Products
        </button>
      </div>

      {/* Scrollable form card */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#fff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          padding: '24px',
        }}
      >
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProductEditPage;
