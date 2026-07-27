import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from './auth-service';
import { successToast } from '@/shared/services/toast-service';
import type { LoginCredentials } from './authTypes';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.signIn(credentials);
      successToast('Login successful!');
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

/**
 * Re-validates the persisted token on app start and refreshes user info.
 * Fails silently (caller logs the user out) if the token is no longer valid.
 */
export const meThunk = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.me();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);
