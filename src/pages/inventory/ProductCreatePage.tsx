/**
 * Product Create Page
 * Form page for creating a new product
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/products/ProductForm';
import { productsApi } from '../../services/api/productsApi';

const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: any) => {
    try {
      await productsApi.create(formData);
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
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
          initialData={null}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProductCreatePage;
