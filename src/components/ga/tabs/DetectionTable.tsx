/**
 * Detection Tab - Review and edit detected items
 */

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppHooks';
import { gasApi } from '../../../services/api';
import {
  setDetectionResults,
  updateDetectionItem,
  addDetectionItem,
  removeDetectionItem,
  markDetectionAsSaved,
  setError,
  setIsLoading,
} from '../../../redux/slices/gaSlice';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import type { DetectionItem } from '../../../types/api.types';

interface DetectionTableProps {
  gaId: number;
}

export const DetectionTable: React.FC<DetectionTableProps> = ({
  gaId,
}) => {
  const dispatch = useAppDispatch();
  const { editedDetectionItems, isLoading, error, savedSteps } = useAppSelector(
    (state) => state.ga
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadDetectionResults();
  }, [gaId]);

  const loadDetectionResults = async () => {
    dispatch(setIsLoading(true));
    try {
      const results = await gasApi.getDetectionResults(gaId);
      dispatch(setDetectionResults(results.items || []));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load detection results';
      dispatch(setError(message));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleItemChange = (index: number, field: keyof DetectionItem, value: any) => {
    const updatedItem = {
      ...editedDetectionItems[index],
      [field]: field === 'count' || field === 'width' || field === 'height' || field === 'depth'
        ? parseInt(value) || 0
        : value,
    };
    dispatch(updateDetectionItem({ index, item: updatedItem }));
  };

  const handleAddItem = () => {
    const newItem: DetectionItem = {
      category: '',
      count: 1,
      unit: 'mm',
    };
    dispatch(addDetectionItem(newItem));
  };

  const handleRemoveItem = (index: number) => {
    dispatch(removeDetectionItem(index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await gasApi.saveDetection({
        gaId,
        items: editedDetectionItems,
      });
      dispatch(markDetectionAsSaved());
      dispatch(setError(null));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save detection data';
      dispatch(setError(message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReRunDetection = async () => {
    dispatch(setIsLoading(true));
    try {
      const results = await gasApi.reRunDetection(gaId);
      dispatch(setDetectionResults(results.items || []));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to re-run detection';
      dispatch(setError(message));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Detected Items</h3>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleReRunDetection}
          loading={isLoading}
        >
          🔄 Re-run Detection
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Items Table */}
      <div className="flex-1 overflow-auto border border-gray-300 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 sticky top-0">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Count</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Width (mm)</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Height (mm)</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Depth (mm)</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700 w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {editedDetectionItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No detection results. Click "Re-run Detection" to start.
                </td>
              </tr>
            ) : (
              editedDetectionItems.map((item: DetectionItem, index: number) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Input
                      type="text"
                      value={item.category}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                      placeholder="e.g., Panel, Bracket"
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      value={item.count}
                      onChange={(e) => handleItemChange(index, 'count', e.target.value)}
                      min="1"
                      className="w-full text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      value={item.width || ''}
                      onChange={(e) => handleItemChange(index, 'width', e.target.value)}
                      placeholder="0"
                      className="w-full text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      value={item.height || ''}
                      onChange={(e) => handleItemChange(index, 'height', e.target.value)}
                      placeholder="0"
                      className="w-full text-right"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      type="number"
                      value={item.depth || ''}
                      onChange={(e) => handleItemChange(index, 'depth', e.target.value)}
                      placeholder="0"
                      className="w-full text-right"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 font-medium"
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
        onClick={handleAddItem}
        size="sm"
      >
        + Add Item Manually
      </Button>

      {/* Status */}
      {savedSteps.detection && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">✓ Detection results saved</p>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        loading={isSaving}
        disabled={editedDetectionItems.length === 0 || isSaving}
      >
        Save & Continue to Product Selection
      </Button>
    </div>
  );
};
