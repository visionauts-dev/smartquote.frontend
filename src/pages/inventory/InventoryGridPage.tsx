/**
 * Inventory grid - loads when Inventory menu selected
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductsGridPage from './ProductsGridPage';

const InventoryGridPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to products page when inventory is clicked
    // Uncomment the line below if you want to redirect instead of showing products inline
    // navigate('/products');
  }, [navigate]);

  // Load ProductsGridPage directly when inventory is clicked
  return <ProductsGridPage />;
};

export default InventoryGridPage;
