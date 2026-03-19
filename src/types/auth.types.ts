/**
 * Type definitions for authentication
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organizationId?: string;
  roles?: string[];
  fullName?: string;
  role?: string;
  userId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  userId?: string;
  fullName?: string;
  role?: string;
  organizationId?: string;
  user?: User;
  isAuthenticated?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
