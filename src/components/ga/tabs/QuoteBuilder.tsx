/**
 * Quote Builder Tab - Create final editable quote
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppHooks';
import {
  setQuoteData,
  updateQuoteLineItem,
  addQuoteLineItem,
  removeQuoteLineItem,
  updateQuoteMetadata,
  markQuoteAsSaved,
  setError,
} from '../../../redux/slices/gaSlice';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { gasApi } from '../../../services/api';
import type { GAQuoteLineItem, ProductSelection, FabricationData } from '../../../types/api.types';

interface QuoteBuilderProps {
  gaId: number;
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  gaId,
}) => {
  const dispatch = useAppDispatch();
  const { selectedProducts, fabricationData, quoteData, quoteMetadata, error, savedSteps } =
    useAppSelector((state) => state.ga);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    initializeQuoteData();
  }, [selectedProducts, fabricationData]);

  const initializeQuoteData = () => {
    if (quoteData.length === 0 && selectedProducts.length > 0) {
      const initialized: GAQuoteLineItem[] = selectedProducts.map((product: ProductSelection, index: number) => ({
        id: `line-${index}`,
        productId: product.productId,
        productName: product.productName || `Product ${product.productId}`,
        quantity: product.count || 1,
        unitPrice: product.price || 0,
        total: (product.price || 0) * (product.count || 1),
      }));

      // Add fabrication items
      const fabricationItems: GAQuoteLineItem[] = fabricationData.map((fab: FabricationData, index: number) => ({
        id: `fab-${index}`,
        productId: -1,
        productName: `Fabrication - ${fab.material}`,
        quantity: 1,
        unitPrice: fab.totalCost || 0,
        total: fab.totalCost || 0,
      }));

      dispatch(setQuoteData([...initialized, ...fabricationItems]));

      // Calculate totals
      const subtotal = [...initialized, ...fabricationItems].reduce(
        (sum, item) => sum + item.total,
        0
      );
      dispatch(updateQuoteMetadata({ subtotal, grandTotal: subtotal }));
    }
  };

  const handleLineItemChange = (
    index: number,
    field: keyof GAQuoteLineItem,
    value: any
  ) => {
    const updated = { ...quoteData[index] };
    if (field === 'quantity' || field === 'unitPrice') {
      updated[field] = parseFloat(value) || 0;
      updated.total = (updated.quantity || 0) * (updated.unitPrice || 0);
    } else {
      (updated[field] as any) = value;
    }
    dispatch(updateQuoteLineItem({ index, item: updated }));

    // Recalculate totals
    const subtotal = quoteData
      .map((item: GAQuoteLineItem, i: number) => (i === index ? updated.total : item.total))
      .reduce((sum: number, total: number) => sum + total, 0);
    const grandTotal =
      subtotal - quoteMetadata.discount + quoteMetadata.tax;
    dispatch(updateQuoteMetadata({ subtotal, grandTotal }));
  };

  const handleAddLineItem = () => {
    const newItem: GAQuoteLineItem = {
      id: `line-${Date.now()}`,
      productId: 0,
      productName: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    dispatch(addQuoteLineItem(newItem));
  };

  const handleRemoveLineItem = (index: number) => {
    dispatch(removeQuoteLineItem(index));
    // Recalculate totals
    const subtotal = quoteData
      .filter((_: GAQuoteLineItem, i: number) => i !== index)
      .reduce((sum: number, item: GAQuoteLineItem) => sum + item.total, 0);
    const grandTotal =
      subtotal - quoteMetadata.discount + quoteMetadata.tax;
    dispatch(updateQuoteMetadata({ subtotal, grandTotal }));
  };

  const handleDiscountChange = (discount: number) => {
    const grandTotal = quoteMetadata.subtotal - discount + quoteMetadata.tax;
    dispatch(updateQuoteMetadata({ discount, grandTotal }));
  };

  const handleTaxChange = (tax: number) => {
    const grandTotal = quoteMetadata.subtotal - quoteMetadata.discount + tax;
    dispatch(updateQuoteMetadata({ tax, grandTotal }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await gasApi.saveQuote({
        gaId,
        lineItems: quoteData,
        subtotal: quoteMetadata.subtotal,
        discount: quoteMetadata.discount,
        tax: quoteMetadata.tax,
        grandTotal: quoteMetadata.grandTotal,
      });
      dispatch(markQuoteAsSaved());
      dispatch(setError(null));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save quote';
      dispatch(setError(message));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold">Quote Builder</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Quote Items Table */}
      <div className="flex-1 overflow-auto border border-gray-300 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 sticky top-0">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Qty</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Unit Price</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Total</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Action</th>
            </tr>
          </thead>
          <tbody>
            {quoteData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No quote items. Select products first.
                </td>
              </tr>
            ) : (
              quoteData.map((item: GAQuoteLineItem, index: number) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Input
                      type="text"
                      value={item.productName}
                      onChange={(e) =>
                        handleLineItemChange(index, 'productName', e.target.value)
                      }
                      className="w-full text-sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleLineItemChange(index, 'quantity', e.target.value)
                      }
                      min="1"
                      className="w-full text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-1">₹</span>
                      <Input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleLineItemChange(index, 'unitPrice', e.target.value)
                        }
                        min="0"
                        step="0.01"
                        className="w-full text-right"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    ₹{item.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRemoveLineItem(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete item"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Item Button */}
      <Button
        variant="secondary"
        onClick={handleAddLineItem}
        size="sm"
      >
        + Add Line Item
      </Button>

      {/* Quote Summary */}
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Subtotal:</span>
            <span className="font-semibold text-gray-900">
              ₹{quoteMetadata.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-700">Discount:</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">₹</span>
              <Input
                type="number"
                value={quoteMetadata.discount}
                onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-32 text-right"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium text-gray-700">Tax (GST):</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">₹</span>
              <Input
                type="number"
                value={quoteMetadata.tax}
                onChange={(e) => handleTaxChange(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-32 text-right"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Grand Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              ₹{quoteMetadata.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      {savedSteps.quote && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">✓ Quote saved</p>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        loading={isSaving}
        disabled={quoteData.length === 0 || isSaving}
      >
        Save & Continue to Export
      </Button>
    </div>
  );
};
