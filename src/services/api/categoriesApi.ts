/**
 * Categories API Service
 * Handles all category-related API calls
 */

import apiClient from './apiClient';
import { type CreateCategoryDto, type UpdateCategoryDto, type CategoryDto } from '../../types/api.types';

export const categoriesApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<CategoryDto[]> => {
    const response = await apiClient.get<CategoryDto[]>('/api/Categories');
    return response.data;
  },

  /**
   * Get category by ID
   */
  getById: async (id: number): Promise<CategoryDto> => {
    const response = await apiClient.get<CategoryDto>(`/api/Categories/${id}`);
    return response.data;
  },

  /**
   * Create new category
   */
  create: async (payload: CreateCategoryDto): Promise<CategoryDto> => {
    const response = await apiClient.post<CategoryDto>('/api/Categories', payload);
    return response.data;
  },

  /**
   * Update category
   */
  update: async (id: number, payload: UpdateCategoryDto): Promise<CategoryDto> => {
    const response = await apiClient.put<CategoryDto>(`/api/Categories/${id}`, payload);
    return response.data;
  },

  /**
   * Delete category
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Categories/${id}`);
  },
};
