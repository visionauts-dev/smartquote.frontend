/**
 * Addons API Service
 * Handles all addon-related API calls
 */

import apiClient from './apiClient';
import { type CreateAddonDto, type UpdateAddonDto, type AddonDto } from '../../types/api.types';

export const addonsApi = {
  /**
   * Get all addons
   */
  getAll: async (): Promise<AddonDto[]> => {
    const response = await apiClient.get<AddonDto[]>('/api/Addons');
    return response.data;
  },

  /**
   * Get addon by ID
   */
  getById: async (id: number): Promise<AddonDto> => {
    const response = await apiClient.get<AddonDto>(`/api/Addons/${id}`);
    return response.data;
  },

  /**
   * Create new addon
   */
  create: async (payload: CreateAddonDto): Promise<AddonDto> => {
    const response = await apiClient.post<AddonDto>('/api/Addons', payload);
    return response.data;
  },

  /**
   * Update addon
   */
  update: async (id: number, payload: UpdateAddonDto): Promise<AddonDto> => {
    const response = await apiClient.put<AddonDto>(`/api/Addons/${id}`, payload);
    return response.data;
  },

  /**
   * Delete addon
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Addons/${id}`);
  },
};
