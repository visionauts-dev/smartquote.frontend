/**
 * Product Selection Tab - Map detected items to products
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppHooks';
import { productsApi } from '../../../services/api';
import {
  updateProductSelection,
  markProductSelectionAsSaved,
  setError,
} from '../../../redux/slices/gaSlice';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { gasApi } from '../../../services/api';
import type { ProductSelection, ProductDto, DetectionItem } from '../../../types/api.types';

interface ProductSelectorProps {
  gaId: number;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  gaId,
}) => {
  const dispatch = useAppDispatch();
  const { editedDetectionItems, selectedProducts, error, savedSteps } =
    useAppSelector((state) => state.ga);
  const [products, setProducts] = useState<{ [category: string]: ProductDto[] }>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      // Fetch products for each category
      const allProducts = await productsApi.getAll();
      const grouped: { [category: string]: ProductDto[] } = {};

      editedDetectionItems.forEach((item: DetectionItem) => {
        if (item.category && !grouped[item.category]) {
          grouped[item.category] = allProducts.filter(
            (p: any) => p.category?.toLowerCase() === item.category?.toLowerCase()
          );
        }
      });

      setProducts(grouped);
    } catch (err: any) {
      console.error('Failed to load products:', err);
    }
  };

  const handleProductSelect = (index: number, productId: number, productName: string, price: number) => {
    const selection: ProductSelection = {
      detectionItemId: editedDetectionItems[index]?.id || `item-${index}`,
      productId,
      count: selectedProducts[index]?.count || editedDetectionItems[index]?.count || 1,
      productName,
      price,
    };
    dispatch(updateProductSelection({ index, selection }));
  };

  const handleCountChange = (index: number, count: number) => {
    if (selectedProducts[index]) {
      const updated = { ...selectedProducts[index], count };
      dispatch(updateProductSelection({ index, selection: updated }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const validated = editedDetectionItems
        .map((_: DetectionItem, index: number) => selectedProducts[index])
        .filter(Boolean);

      await gasApi.saveProductSelection({
        gaId,
        selections: validated,
      });

      dispatch(markProductSelectionAsSaved());
      dispatch(setError(null));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save product selection';
      dispatch(setError(message));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold">Map Products to Detected Items</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Items Mapping */}
      <div className="flex-1 overflow-auto space-y-3">
        {editedDetectionItems.map((item: DetectionItem, index: number) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition"
          >
            <div className="grid grid-cols-3 gap-4 items-end">
              {/* Detection Item Info */}
              <div>
                <p className="text-sm font-medium text-gray-600">Detected Item</p>
                <p className="text-base font-semibold text-gray-900">
                  {item.category || `Item ${index + 1}`}
                </p>
                <p className="text-xs text-gray-500">
                  Count: {item.count} | {item.width || 0}×{item.height || 0}×{item.depth || 0} mm
                </p>
              </div>

              {/* Product Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Product
                </label>
                <select
                  onChange={(e) => {
                    const selected = JSON.parse(e.target.value || 'null');
                    if (selected) {
                      handleProductSelect(index, selected.id, selected.name, selected.price);
                    }
                  }}
                  value={
                    selectedProducts[index]
                      ? JSON.stringify({
                          id: selectedProducts[index].productId,
                          name: selectedProducts[index].productName,
                          price: selectedProducts[index].price,
                        })
                      : ''
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Product --</option>
                  {(products[item.category] || []).map((product) => (
                    <option
                      key={product.id}
                      value={JSON.stringify({
                        id: product.id,
                        name: product.vendorCatNo || `Product ${product.id}`,
                        price: parseFloat(product.mrp.toString()),
                      })}
                    >
                      {product.vendorCatNo} - ₹{product.mrp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Quantity
                </label>
                <Input
                  type="number"
                  value={selectedProducts[index]?.count || item.count}
                  onChange={(e) => handleCountChange(index, parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full"
                />
              </div>
            </div>

            {/* Selected Product Info */}
            {selectedProducts[index] && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {selectedProducts[index].productName}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{(
                      (selectedProducts[index].price || 0) *
                      (selectedProducts[index].count || 1)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status */}
      {savedSteps.product && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">✓ Product selections saved</p>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        loading={isSaving}
        disabled={
          editedDetectionItems.length === 0 ||
          editedDetectionItems.some((_: DetectionItem, i: number) => !selectedProducts[i]) ||
          isSaving
        }
      >
        Save & Continue to Fabrication
      </Button>
    </div>
  );
};
