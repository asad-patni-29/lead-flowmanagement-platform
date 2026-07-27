import { createSlice } from '@reduxjs/toolkit';
import { SliceNames } from '@/constants/redux-constant';
import {
  fetchLeadsThunk,
  fetchLeadThunk,
  createLeadThunk,
  updateLeadThunk,
  deleteLeadThunk,
  addNoteThunk,
} from './leads-async-thunk';
import type { LeadsState } from './leadTypes';

const initialState: LeadsState = {
  items: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  current: null,
  loading: false,
  saving: false,
  error: null,
};

const leadsSlice = createSlice({
  name: SliceNames.LEADS,
  initialState,
  reducers: {
    clearCurrentLead: (state) => {
      state.current = null;
    },
    clearLeadsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.meta = action.payload.meta;
      })
      .addCase(fetchLeadsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchLeadThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchLeadThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createLeadThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(createLeadThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
      })
      .addCase(createLeadThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateLeadThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateLeadThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
        const idx = state.items.findIndex((lead) => lead.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateLeadThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteLeadThunk.fulfilled, (state, action) => {
        state.items = state.items.filter((lead) => lead.id !== action.payload);
        if (state.current?.id === action.payload) state.current = null;
      });

    builder
      .addCase(addNoteThunk.pending, (state) => {
        state.saving = true;
      })
      .addCase(addNoteThunk.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
      })
      .addCase(addNoteThunk.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentLead, clearLeadsError } = leadsSlice.actions;
export default leadsSlice.reducer;
