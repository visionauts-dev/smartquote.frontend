/**
 * Authentication API Service
 * Handles all auth-related API calls
 */

import apiClient from './apiClient';
import { type LoginRequest, type RegisterRequest, type AuthResponse } from '../../types/auth.types';

export const authApi = {
  /**
   * Login user
   */
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', payload);
    return response.data;
  },

  /**
   * Register new user
   */
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/Auth/register', payload);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/api/Auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};
