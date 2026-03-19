/**
 * Authentication API Service
 * Handles all auth-related API calls
 */

import apiClient from './apiClient';
import { type RegisterRequest, type AuthResponse } from '../../types/auth.types';
import { type LoginRequestDto, type LoginResponseDto } from '../../types/api.types';

export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (payload: LoginRequestDto): Promise<LoginResponseDto> => {
    const response = await apiClient.post<LoginResponseDto>('/api/Auth/login', payload);
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
