/**
 * API Client Configuration
 * Axios instance with interceptors for authentication
 * Token stored in localStorage for persistence across page refreshes
 */

import axios, { type AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5213';
const TOKEN_KEY = 'auth_token';

// In-memory token storage
let authToken: string | null = null;

// Function to set token from Redux
export const setAuthToken = (token: string | null): void => {
  authToken = token;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

// Function to get current token
export const getAuthToken = (): string | null => {
  return authToken;
};

// Function to restore token from localStorage
export const restoreAuthToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    authToken = token;
  }
  return authToken;
};

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      authToken = null;
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
