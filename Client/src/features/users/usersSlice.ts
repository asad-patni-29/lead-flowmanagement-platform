import { createSlice } from '@reduxjs/toolkit';
import { SliceNames } from '@/constants/redux-constant';
import { fetchUsersThunk, createUserThunk, updateUserThunk, deleteUserThunk } from './users-async-thunk';
import type { UsersState } from './userTypes';

const initialState: UsersState = {
  items: [],
  meta: null,
  loading: false,
  saving: false,
  error: null,
};

const usersSlice = createSlice({
  name: SliceNames.USERS,
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createUserThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items.push(action.payload);
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateUserThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.saving = false;
        const index = state.items.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteUserThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUsersError } = usersSlice.actions;
export default usersSlice.reducer;
