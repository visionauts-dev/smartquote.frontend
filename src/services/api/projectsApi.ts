/**
 * Projects API Service
 * Handles all project-related API calls
 */

import apiClient from './apiClient';
import { type CreateProjectDto, type UpdateProjectDto, type ProjectDto } from '../../types/api.types';

export const projectsApi = {
  /**
   * Get all projects
   */
  getAll: async (): Promise<ProjectDto[]> => {
    const response = await apiClient.get<ProjectDto[]>('/api/Projects');
    return response.data;
  },

  /**
   * Get project by ID
   */
  getById: async (id: number): Promise<ProjectDto> => {
    const response = await apiClient.get<ProjectDto>(`/api/Projects/${id}`);
    return response.data;
  },

  /**
   * Create new project
   */
  create: async (payload: CreateProjectDto): Promise<ProjectDto> => {
    const response = await apiClient.post<ProjectDto>('/api/Projects', payload);
    return response.data;
  },

  /**
   * Update project
   */
  update: async (id: number, payload: UpdateProjectDto): Promise<ProjectDto> => {
    const response = await apiClient.put<ProjectDto>(`/api/Projects/${id}`, payload);
    return response.data;
  },

  /**
   * Delete project
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Projects/${id}`);
  },
};
