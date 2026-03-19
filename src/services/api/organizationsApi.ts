/**
 * Organizations API Service
 * Handles all organization-related API calls
 */

import apiClient from './apiClient';
import {
  type CreateOrganizationDto,
  type UpdateOrganizationDto,
  type OrganizationDto,
  type CreateOrganizationUserDto,
  type UpdateOrganizationUserDto,
  type OrganizationUserDto,
  type CreateOrganizationProductDiscountDto,
  type UpdateOrganizationProductDiscountDto,
  type OrganizationProductDiscountDto,
} from '../../types/api.types';

export const organizationsApi = {
  /**
   * Get all organizations
   */
  getAll: async (): Promise<OrganizationDto[]> => {
    const response = await apiClient.get<OrganizationDto[]>('/api/Organizations');
    return response.data;
  },

  /**
   * Get organization by ID
   */
  getById: async (id: string): Promise<OrganizationDto> => {
    const response = await apiClient.get<OrganizationDto>(`/api/Organizations/${id}`);
    return response.data;
  },

  /**
   * Create new organization
   */
  create: async (payload: CreateOrganizationDto): Promise<OrganizationDto> => {
    const response = await apiClient.post<OrganizationDto>('/api/Organizations', payload);
    return response.data;
  },

  /**
   * Update organization
   */
  update: async (id: string, payload: UpdateOrganizationDto): Promise<OrganizationDto> => {
    const response = await apiClient.put<OrganizationDto>(`/api/Organizations/${id}`, payload);
    return response.data;
  },

  /**
   * Delete organization
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Organizations/${id}`);
  },
};

// Organization Users API
export const organizationUsersApi = {
  /**
   * Get organization user by organizationId and userId
   */
  getById: async (organizationId: string, userId: string): Promise<OrganizationUserDto> => {
    const response = await apiClient.get<OrganizationUserDto>(
      `/api/OrganizationUsers/${organizationId}/${userId}`
    );
    return response.data;
  },

  /**
   * Create organization user
   */
  create: async (payload: CreateOrganizationUserDto): Promise<OrganizationUserDto> => {
    const response = await apiClient.post<OrganizationUserDto>('/api/OrganizationUsers', payload);
    return response.data;
  },

  /**
   * Update organization user
   */
  update: async (
    organizationId: string,
    userId: string,
    payload: UpdateOrganizationUserDto
  ): Promise<OrganizationUserDto> => {
    const response = await apiClient.put<OrganizationUserDto>(
      `/api/OrganizationUsers/${organizationId}/${userId}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete organization user
   */
  delete: async (organizationId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/api/OrganizationUsers/${organizationId}/${userId}`);
  },
};

// Organization Product Discounts API
export const organizationProductDiscountsApi = {
  /**
   * Get all organization product discounts
   */
  getAll: async (): Promise<OrganizationProductDiscountDto[]> => {
    const response = await apiClient.get<OrganizationProductDiscountDto[]>(
      '/api/OrganizationProductDiscounts'
    );
    return response.data;
  },

  /**
   * Get organization product discount by ID
   */
  getById: async (id: number): Promise<OrganizationProductDiscountDto> => {
    const response = await apiClient.get<OrganizationProductDiscountDto>(
      `/api/OrganizationProductDiscounts/${id}`
    );
    return response.data;
  },

  /**
   * Create organization product discount
   */
  create: async (
    payload: CreateOrganizationProductDiscountDto
  ): Promise<OrganizationProductDiscountDto> => {
    const response = await apiClient.post<OrganizationProductDiscountDto>(
      '/api/OrganizationProductDiscounts',
      payload
    );
    return response.data;
  },

  /**
   * Update organization product discount
   */
  update: async (
    id: number,
    payload: UpdateOrganizationProductDiscountDto
  ): Promise<OrganizationProductDiscountDto> => {
    const response = await apiClient.put<OrganizationProductDiscountDto>(
      `/api/OrganizationProductDiscounts/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete organization product discount
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/OrganizationProductDiscounts/${id}`);
  },
};
