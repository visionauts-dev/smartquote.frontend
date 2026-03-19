/**
 * Subcategories API Service
 * Handles all subcategory-related API calls
 */

import apiClient from './apiClient';
import { type CreateSubcategoryDto, type UpdateSubcategoryDto, type SubcategoryDto } from '../../types/api.types';

export const subcategoriesApi = {
  /**
   * Get all subcategories
   */
  getAll: async (): Promise<SubcategoryDto[]> => {
    const response = await apiClient.get<SubcategoryDto[]>('/api/Subcategories');
    return response.data;
  },

  /**
   * Get subcategory by ID
   */
  getById: async (id: number): Promise<SubcategoryDto> => {
    const response = await apiClient.get<SubcategoryDto>(`/api/Subcategories/${id}`);
    return response.data;
  },

  /**
   * Create new subcategory
   */
  create: async (payload: CreateSubcategoryDto): Promise<SubcategoryDto> => {
    const response = await apiClient.post<SubcategoryDto>('/api/Subcategories', payload);
    return response.data;
  },

  /**
   * Update subcategory
   */
  update: async (id: number, payload: UpdateSubcategoryDto): Promise<SubcategoryDto> => {
    const response = await apiClient.put<SubcategoryDto>(`/api/Subcategories/${id}`, payload);
    return response.data;
  },

  /**
   * Delete subcategory
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Subcategories/${id}`);
  },
};
