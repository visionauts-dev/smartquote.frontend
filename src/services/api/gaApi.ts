/**
 * GA (General Arrangement) API Service
 * Handles all GA-related API operations
 */

import apiClient from './apiClient';
import type {
  UpdateGADto,
  GADto,
  DetectionResult,
  SaveDetectionDto,
  SaveProductSelectionDto,
  SaveFabricationDto,
  SaveQuoteDto,
  ExportResponse,
} from '../../types/api.types';

const BASE_URL = '/api/ga';
const DETECTION_URL = '/api/detection';

export const gaApi = {
  /**
   * Create a new GA (upload PDF)
   */
  create: async (projectId: number, file: File, gaName: string): Promise<GADto> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId.toString());
    formData.append('gaName', gaName);

    const response = await apiClient.post<GADto>(`${DETECTION_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get all GAs for a project
   */
  getByProject: async (projectId: number): Promise<GADto[]> => {
    const response = await apiClient.get<GADto[]>(`${BASE_URL}/project/${projectId}`);
    return response.data;
  },

  /**
   * Get a single GA by ID
   */
  getById: async (gaId: number): Promise<GADto> => {
    const response = await apiClient.get<GADto>(`${BASE_URL}/${gaId}`);
    return response.data;
  },

  /**
   * Update GA details
   */
  update: async (gaId: number, data: UpdateGADto): Promise<GADto> => {
    const response = await apiClient.put<GADto>(`${BASE_URL}/${gaId}`, data);
    return response.data;
  },

  /**
   * Delete a GA
   */
  delete: async (gaId: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${gaId}`);
  },

  /**
   * Get detection results for a GA
   */
  getDetectionResults: async (gaId: number): Promise<DetectionResult> => {
    const response = await apiClient.get<DetectionResult>(`${DETECTION_URL}/results/${gaId}`);
    return response.data;
  },

  /**
   * Save/update detection results
   */
  saveDetection: async (data: SaveDetectionDto): Promise<DetectionResult> => {
    const response = await apiClient.post<DetectionResult>(`${DETECTION_URL}/save`, data);
    return response.data;
  },

  /**
   * Re-run detection for a GA
   */
  reRunDetection: async (gaId: number): Promise<DetectionResult> => {
    const response = await apiClient.post<DetectionResult>(`${DETECTION_URL}/rerun/${gaId}`);
    return response.data;
  },

  /**
   * Save product selections
   */
  saveProductSelection: async (data: SaveProductSelectionDto): Promise<any> => {
    const response = await apiClient.post(`${BASE_URL}/product-selection`, data);
    return response.data;
  },

  /**
   * Save fabrication data
   */
  saveFabrication: async (data: SaveFabricationDto): Promise<any> => {
    const response = await apiClient.post(`${BASE_URL}/fabrication`, data);
    return response.data;
  },

  /**
   * Save quote data
   */
  saveQuote: async (data: SaveQuoteDto): Promise<any> => {
    const response = await apiClient.post(`${BASE_URL}/quote`, data);
    return response.data;
  },

  /**
   * Export quote in various formats
   */
  exportQuote: async (gaId: number, format: 'pdf' | 'word' | 'excel'): Promise<ExportResponse> => {
    const response = await apiClient.post<ExportResponse>(`${BASE_URL}/export`, {
      gaId,
      format,
    });
    return response.data;
  },

  /**
   * Download exported file
   */
  downloadExport: async (url: string): Promise<Blob> => {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });
    return response.data;
  },
};
