/**
 * Products API Service
 * Handles all product-related API calls
 */

import apiClient from './apiClient';
import { type CreateProductDto, type UpdateProductDto, type ProductDto } from '../../types/api.types';

export const productsApi = {
  /**
   * Get all products
   */
  getAll: async (): Promise<ProductDto[]> => {
    const response = await apiClient.get<ProductDto[]>('/api/Products');
    return response.data;
  },

  /**
   * Get product by ID
   */
  getById: async (id: number): Promise<ProductDto> => {
    const response = await apiClient.get<ProductDto>(`/api/Products/${id}`);
    return response.data;
  },

  /**
   * Create new product
   */
  create: async (payload: CreateProductDto): Promise<ProductDto> => {
    const response = await apiClient.post<ProductDto>('/api/Products', payload);
    return response.data;
  },

  /**
   * Update product
   */
  update: async (id: number, payload: UpdateProductDto): Promise<ProductDto> => {
    const response = await apiClient.put<ProductDto>(`/api/Products/${id}`, payload);
    return response.data;
  },

  /**
   * Delete product
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Products/${id}`);
  },
};
