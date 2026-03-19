/**
 * Weather Forecast API Service
 * Handles all weather forecast-related API calls
 */

import apiClient from './apiClient';
import { type WeatherForecast } from '../../types/api.types';

export const weatherApi = {
  /**
   * Get weather forecast
   */
  getWeatherForecast: async (): Promise<WeatherForecast[]> => {
    const response = await apiClient.get<WeatherForecast[]>('/WeatherForecast');
    return response.data;
  },
};
