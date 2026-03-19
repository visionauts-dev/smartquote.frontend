/**
 * Vendors API Service
 * Handles all vendor-related API calls
 */

import apiClient from './apiClient';
import { type CreateVendorDto, type UpdateVendorDto, type VendorDto } from '../../types/api.types';

export const vendorsApi = {
  /**
   * Get all vendors
   */
  getAll: async (): Promise<VendorDto[]> => {
    const response = await apiClient.get<VendorDto[]>('/api/Vendors');
    return response.data;
  },

  /**
   * Get vendor by ID
   */
  getById: async (id: number): Promise<VendorDto> => {
    const response = await apiClient.get<VendorDto>(`/api/Vendors/${id}`);
    return response.data;
  },

  /**
   * Create new vendor
   */
  create: async (payload: CreateVendorDto): Promise<VendorDto> => {
    const response = await apiClient.post<VendorDto>('/api/Vendors', payload);
    return response.data;
  },

  /**
   * Update vendor
   */
  update: async (id: number, payload: UpdateVendorDto): Promise<VendorDto> => {
    const response = await apiClient.put<VendorDto>(`/api/Vendors/${id}`, payload);
    return response.data;
  },

  /**
   * Delete vendor
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Vendors/${id}`);
  },
};
