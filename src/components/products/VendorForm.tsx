/**
 * Vendor Form Component
 * Form for creating and editing vendors
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { VendorDto, CreateVendorDto, UpdateVendorDto } from '../../types/api.types';

type FormData = CreateVendorDto | UpdateVendorDto;

interface VendorFormProps {
  initialData?: VendorDto | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: initialData ? {
      vendorName: initialData.vendorName,
    } : {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vendor Name
        </label>
        <Input
          type="text"
          placeholder="Enter vendor name"
          {...register('vendorName', { required: 'Vendor name is required' })}
        />
        {errors.vendorName && (
          <p className="text-red-500 text-xs mt-1">{errors.vendorName.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Vendor'}
        </Button>
      </div>
    </form>
  );
};

export default VendorForm;
