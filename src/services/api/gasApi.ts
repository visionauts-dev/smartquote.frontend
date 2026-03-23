/**
 * General Arrangements (GAs) API Service
 * Handles all GA-related API calls
 */

import apiClient from './apiClient';
import { type CreateGADto, type UpdateGADto, type GADto } from '../../types/api.types';

export const gasApi = {
  /**
   * Get all GAs for a project
   */
  getByProjectId: async (projectId: number): Promise<GADto[]> => {
    const response = await apiClient.get<GADto[]>(`/api/Projects/${projectId}/GAs`);
    return response.data;
  },

  /**
   * Get GA by ID
   */
  getById: async (projectId: number, gaId: number): Promise<GADto> => {
    const response = await apiClient.get<GADto>(`/api/Projects/${projectId}/GAs/${gaId}`);
    return response.data;
  },

  /**
   * Create new GA
   */
  create: async (projectId: number, payload: Omit<CreateGADto, 'projectId'>): Promise<GADto> => {
    const response = await apiClient.post<GADto>(`/api/Projects/${projectId}/GAs`, {
      projectId,
      ...payload,
    });
    return response.data;
  },

  /**
   * Update GA
   */
  update: async (projectId: number, gaId: number, payload: UpdateGADto): Promise<GADto> => {
    const response = await apiClient.put<GADto>(`/api/Projects/${projectId}/GAs/${gaId}`, payload);
    return response.data;
  },

  /**
   * Delete GA
   */
  delete: async (projectId: number, gaId: number): Promise<void> => {
    await apiClient.delete(`/api/Projects/${projectId}/GAs/${gaId}`);
  },
};
