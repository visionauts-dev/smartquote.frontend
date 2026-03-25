/**
 * Fabrication Tab - Calculate fabrication costs
 */

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppHooks';
import {
  setFabricationData,
  updateFabricationDataItem,
  markFabricationAsSaved,
  setError,
} from '../../../redux/slices/gaSlice';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { gasApi } from '../../../services/api';
import type { FabricationData } from '../../../types/api.types';

interface FabricationPanelProps {
  gaId: number;
}

export const FabricationPanel: React.FC<FabricationPanelProps> = ({
  gaId,
}) => {
  const dispatch = useAppDispatch();
  const { editedDetectionItems, selectedProducts, fabricationData, error, savedSteps } =
    useAppSelector((state) => state.ga);
  const [isSaving, setIsSaving] = useState(false);

  // Material options
  const MATERIALS = ['Mild Steel', 'Stainless Steel 304', 'Stainless Steel 316', 'Aluminum', 'Brass', 'Copper'];
  const MATERIAL_DENSITY: { [key: string]: number } = {
    'Mild Steel': 7.85,
    'Stainless Steel 304': 8.0,
    'Stainless Steel 316': 8.0,
    'Aluminum': 2.7,
    'Brass': 8.5,
    'Copper': 8.96,
  };

  const COST_PER_KG: { [key: string]: number } = {
    'Mild Steel': 50,
    'Stainless Steel 304': 120,
    'Stainless Steel 316': 150,
    'Aluminum': 200,
    'Brass': 400,
    'Copper': 500,
  };

  useEffect(() => {
    initializeFabricationData();
  }, [selectedProducts]);

  const initializeFabricationData = () => {
    if (fabricationData.length === 0 && selectedProducts.length > 0) {
      const initialized = selectedProducts
        .map((_: any, index: number) => ({
          detectionItemId: editedDetectionItems[index]?.id || `item-${index}`,
          gaId,
          material: 'Mild Steel',
          thickness: 2,
          width: editedDetectionItems[index]?.width,
          height: editedDetectionItems[index]?.height,
          depth: editedDetectionItems[index]?.depth,
          weight: 0,
          materialCost: 0,
          fabricationCost: 0,
          totalCost: 0,
        }))
        .filter(Boolean);
      dispatch(setFabricationData(initialized));
    }
  };

  const calculateWeight = (material: string, thickness: number, w?: number, h?: number): number => {
    if (!w || !h) return 0;
    const volume = (w * h * thickness) / 1000000; // convert mm³ to cm³
    const density = MATERIAL_DENSITY[material] || 7.85;
    return volume * density;
  };

  const handleMaterialChange = (index: number, material: string) => {
    const item = fabricationData[index];
    if (item) {
      const weight = calculateWeight(material, item.thickness, item.width, item.height);
      const materialCost = weight * (COST_PER_KG[material] || 50);
      const fabricationCost = materialCost * 0.3; // 30% fabrication markup
      const updated: FabricationData = {
        ...item,
        material,
        weight,
        materialCost,
        fabricationCost,
        totalCost: materialCost + fabricationCost,
      };
      dispatch(updateFabricationDataItem({ index, data: updated }));
    }
  };

  const handleThicknessChange = (index: number, thickness: number) => {
    const item = fabricationData[index];
    if (item) {
      const weight = calculateWeight(item.material, thickness, item.width, item.height);
      const materialCost = weight * (COST_PER_KG[item.material] || 50);
      const fabricationCost = materialCost * 0.3;
      const updated: FabricationData = {
        ...item,
        thickness,
        weight,
        materialCost,
        fabricationCost,
        totalCost: materialCost + fabricationCost,
      };
      dispatch(updateFabricationDataItem({ index, data: updated }));
    }
  };

  const handleDimensionChange = (
    index: number,
    dimension: 'width' | 'height' | 'depth',
    value: number
  ) => {
    const item = fabricationData[index];
    if (item) {
      const updated = { ...item, [dimension]: value };
      const weight = calculateWeight(
        updated.material,
        updated.thickness,
        updated.width,
        updated.height
      );
      const materialCost = weight * (COST_PER_KG[updated.material] || 50);
      const fabricationCost = materialCost * 0.3;
      updated.weight = weight;
      updated.materialCost = materialCost;
      updated.fabricationCost = fabricationCost;
      updated.totalCost = materialCost + fabricationCost;
      dispatch(updateFabricationDataItem({ index, data: updated }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await gasApi.saveFabrication({
        gaId,
        items: fabricationData,
      });
      dispatch(markFabricationAsSaved());
      dispatch(setError(null));
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to save fabrication data';
      dispatch(setError(message));
    } finally {
      setIsSaving(false);
    }
  };

  const totalFabricationCost = fabricationData.reduce((sum: number, item: FabricationData) => sum + (item.totalCost || 0), 0);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h3 className="text-lg font-semibold">Fabrication & Cost Calculation</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Items */}
      <div className="flex-1 overflow-auto space-y-3">
        {fabricationData.map((item: FabricationData, index: number) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition"
          >
            <h4 className="font-semibold text-gray-900 mb-3">
              {editedDetectionItems[index]?.category || `Item ${index + 1}`}
            </h4>

            <div className="grid grid-cols-3 gap-3 mb-3">
              {/* Material */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Material</label>
                <select
                  value={item.material}
                  onChange={(e) => handleMaterialChange(index, e.target.value)}
                  className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MATERIALS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thickness */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Thickness (mm)
                </label>
                <Input
                  type="number"
                  value={item.thickness}
                  onChange={(e) => handleThicknessChange(index, parseFloat(e.target.value) || 1)}
                  min="0.5"
                  step="0.5"
                  className="w-full text-sm"
                />
              </div>

              {/* Density Info */}
              <div className="bg-blue-50 p-2 rounded text-xs">
                <p className="text-gray-600">Density: {MATERIAL_DENSITY[item.material] || 7.85} g/cm³</p>
                <p className="text-gray-600">Cost: ₹{COST_PER_KG[item.material] || 50}/kg</p>
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Width (mm)</label>
                <Input
                  type="number"
                  value={item.width || ''}
                  onChange={(e) => handleDimensionChange(index, 'width', parseFloat(e.target.value) || 0)}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Height (mm)</label>
                <Input
                  type="number"
                  value={item.height || ''}
                  onChange={(e) => handleDimensionChange(index, 'height', parseFloat(e.target.value) || 0)}
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Depth (mm)</label>
                <Input
                  type="number"
                  value={item.depth || ''}
                  onChange={(e) => handleDimensionChange(index, 'depth', parseFloat(e.target.value) || 0)}
                  className="w-full text-sm"
                />
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-gray-50 p-3 rounded space-y-1 border border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{item.weight?.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Material Cost:</span>
                <span className="font-medium">₹{item.materialCost?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fabrication Cost (30%):</span>
                <span className="font-medium">₹{item.fabricationCost?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-300 pt-2">
                <span>Total Cost:</span>
                <span>₹{item.totalCost?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Fabrication Cost:</span>
          <span className="text-2xl font-bold text-blue-600">₹{totalFabricationCost.toFixed(2)}</span>
        </div>
      </div>

      {/* Status */}
      {savedSteps.fabrication && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-700">✓ Fabrication data saved</p>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        loading={isSaving}
        disabled={fabricationData.length === 0 || isSaving}
      >
        Save & Continue to Quote Builder
      </Button>
    </div>
  );
};
