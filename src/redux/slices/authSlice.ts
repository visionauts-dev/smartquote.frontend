/**
 * Redux Auth Slice
 * Handles authentication state management
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type AuthState, type LoginRequest, type RegisterRequest, type AuthResponse } from '../../types/auth.types';
import { authApi } from '../../services/api/authApi';
import { setAuthToken, restoreAuthToken } from '../../services/api/apiClient';
import { getEmailFromToken, extractUserFromToken } from '../../utils/tokenUtils';
import type { LoginResponseDto } from '../../types/api.types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  success: false,
};

/**
 * Extract user data from API response
 * Handles both direct properties and nested user object
 */
const extractUserData = (response: AuthResponse) => {
  const token = response.token;

  // Try to get email from JWT token claims
  let email = getEmailFromToken(token) || '';

  if (response.user) {
    // If user object exists, use it
    return response.user;
  }

  // Otherwise, construct user object from direct properties
  return {
    id: response.userId || '',
    email,
    fullName: response.fullName || '',
    role: response.role || '',
    organizationId: response.organizationId || '',
  };
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      if (response && response.token) {
        setAuthToken(response.token);
        console.log('Login successful, token set');
        return response;
      } else {
        return rejectWithValue('No token received from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.register(payload);
      setAuthToken(response.token);
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      setAuthToken(null);
    } catch (error: any) {
      setAuthToken(null);
      return rejectWithValue('Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    initializeAuth: (state) => {
      // Restore token from localStorage on app initialization
      const token = restoreAuthToken();
      if (token) {
        state.token = token;
        state.isAuthenticated = true;

        // Extract user data from token claims
        const tokenData = extractUserFromToken(token);
        if (tokenData.id) {
          state.user = {
            ...tokenData,
            fullName: state.user?.fullName || '', // fullName may not be in token, will be updated on API call
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponseDto>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        // Handle the user object from LoginResponseDto
        if (action.payload.user) {
          state.user = {
            id: action.payload.user.id,
            email: action.payload.user.email,
            fullName: action.payload.user.fullName,
          };
        }
        state.isAuthenticated = true;
        state.success = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        if (action.payload.token) {
          setAuthToken(action.payload.token);
        }
        state.user = extractUserData(action.payload);
        state.isAuthenticated = true;
        state.success = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
