/**
 * Product Form Component
 * Form for creating and editing products
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { ProductDto, UpdateProductDto } from '../../types/api.types';

interface ProductFormProps {
  initialData?: ProductDto | null;
  onSubmit: (data: UpdateProductDto) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdateProductDto>({
    defaultValues: initialData ? {
      vendorId: initialData.vendorId,
      subcategoryId: initialData.subcategoryId,
      vendorCatNo: initialData.vendorCatNo,
      model: initialData.model,
      mrp: String(initialData.mrp),
      stdPkg: initialData.stdPkg,
      addOns: initialData.addOns,
      description: initialData.description,
      attributes: initialData.attributes,
    } : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor ID
          </label>
          <Input
            type="number"
            {...register('vendorId', { required: 'Vendor is required' })}
          />
          {errors.vendorId && (
            <p className="text-red-500 text-xs mt-1">{errors.vendorId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category ID
          </label>
          <Input
            type="number"
            {...register('subcategoryId', { required: 'Category is required' })}
          />
          {errors.subcategoryId && (
            <p className="text-red-500 text-xs mt-1">{errors.subcategoryId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <Input
            type="text"
            placeholder="Product model"
            {...register('model')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor Cat No
          </label>
          <Input
            type="text"
            placeholder="Vendor catalog number"
            {...register('vendorCatNo')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            MRP
          </label>
          <Input
            type="number"
            step="0.01"
            {...register('mrp', { required: 'MRP is required' })}
          />
          {errors.mrp && (
            <p className="text-red-500 text-xs mt-1">{errors.mrp.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Std Pkg
          </label>
          <Input
            type="number"
            {...register('stdPkg')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="Product description"
          {...register('description')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Attributes
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={2}
          placeholder="Product attributes (JSON format)"
          {...register('attributes')}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('addOns')}
          className="rounded"
        />
        <label className="text-sm font-medium text-gray-700">Has Add-ons</label>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
