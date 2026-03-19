/**
 * Users API Service
 * Handles all user-related API calls
 */

import apiClient from './apiClient';
import { type CreateUserDto, type UpdateUserDto, type UserDto } from '../../types/api.types';

export const usersApi = {
  /**
   * Get all users
   */
  getAll: async (): Promise<UserDto[]> => {
    const response = await apiClient.get<UserDto[]>('/api/Users');
    return response.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<UserDto> => {
    const response = await apiClient.get<UserDto>(`/api/Users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  create: async (payload: CreateUserDto): Promise<UserDto> => {
    const response = await apiClient.post<UserDto>('/api/Users', payload);
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id: string, payload: UpdateUserDto): Promise<UserDto> => {
    const response = await apiClient.put<UserDto>(`/api/Users/${id}`, payload);
    return response.data;
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Users/${id}`);
  },
};
