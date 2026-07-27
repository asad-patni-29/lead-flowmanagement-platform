import { createAsyncThunk } from '@reduxjs/toolkit';
import leadsService from './leads-service';
import { successToast } from '@/shared/services/toast-service';
import type {
  LeadListParams,
  CreateLeadPayload,
  UpdateLeadPayload,
} from './leadTypes';

export const fetchLeadsThunk = createAsyncThunk(
  'leads/fetchList',
  async (params: LeadListParams, { rejectWithValue }) => {
    try {
      return await leadsService.list(params);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load leads');
    }
  }
);

export const fetchLeadThunk = createAsyncThunk(
  'leads/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      return await leadsService.get(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load lead');
    }
  }
);

export const createLeadThunk = createAsyncThunk(
  'leads/create',
  async (payload: CreateLeadPayload, { rejectWithValue }) => {
    try {
      const lead = await leadsService.create(payload);
      successToast('Lead created');
      return lead;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create lead');
    }
  }
);

export const updateLeadThunk = createAsyncThunk(
  'leads/update',
  async ({ id, payload }: { id: string; payload: UpdateLeadPayload }, { rejectWithValue }) => {
    try {
      const lead = await leadsService.update(id, payload);
      successToast('Lead updated');
      return lead;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update lead');
    }
  }
);

export const deleteLeadThunk = createAsyncThunk(
  'leads/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await leadsService.remove(id);
      successToast('Lead deleted');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete lead');
    }
  }
);

export const addNoteThunk = createAsyncThunk(
  'leads/addNote',
  async ({ id, text }: { id: string; text: string }, { rejectWithValue }) => {
    try {
      const lead = await leadsService.addNote(id, text);
      successToast('Note added');
      return lead;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add note');
    }
  }
);
