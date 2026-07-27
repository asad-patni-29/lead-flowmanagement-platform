import { createAsyncThunk } from '@reduxjs/toolkit';
import usersService from './users-service';
import { successToast } from '@/shared/services/toast-service';
import type { CreateUserPayload, FetchUsersParams } from './userTypes';

export const fetchUsersThunk = createAsyncThunk(
  'users/fetchList',
  async (params: FetchUsersParams = {}, { rejectWithValue }) => {
    try {
      return await usersService.list(params);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load users');
    }
  }
);

export const createUserThunk = createAsyncThunk(
  'users/create',
  async (payload: CreateUserPayload, { rejectWithValue }) => {
    try {
      const user = await usersService.create(payload);
      successToast('User created');
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  'users/update',
  async ({ userId, payload }: { userId: string; payload: Partial<CreateUserPayload> }, { rejectWithValue }) => {
    try {
      const user = await usersService.update(userId, payload);
      successToast('User updated');
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user');
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'users/delete',
  async (userId: string, { rejectWithValue }) => {
    try {
      await usersService.delete(userId);
      successToast('User deleted');
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);
