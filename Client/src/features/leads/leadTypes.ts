import type { PaginationMeta } from '@/shared/types/api';
import type { Role } from '@/features/auth';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';

export type LeadSource = 'website' | 'referral' | 'cold_call' | 'event' | 'other';

export const LEAD_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
];

export const LEAD_SOURCES: LeadSource[] = [
  'website',
  'referral',
  'cold_call',
  'event',
  'other',
];

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LeadNote {
  _id: string;
  text: string;
  author: UserSummary;
  createdAt: string;
}

export type ActivityType =
  | 'created'
  | 'status_changed'
  | 'assigned'
  | 'unassigned'
  | 'note_added'
  | 'updated';

export interface LeadActivity {
  _id: string;
  type: ActivityType;
  message: string;
  actor: UserSummary | null;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: UserSummary | null;
  createdBy: UserSummary | null;
  notes: LeadNote[];
  activities: LeadActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadListParams {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  assignedTo?: string;
  source?: LeadSource;
  search?: string;
  sort?: 'newest' | 'oldest';
  sortBy?: 'name' | 'company' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: LeadSource;
  status?: LeadStatus;
  assignedTo?: string | null;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: LeadSource;
  status?: LeadStatus;
  assignedTo?: string | null;
}

export interface PublicLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source?: LeadSource;
}

export interface LeadsState {
  items: Lead[];
  meta: PaginationMeta;
  current: Lead | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}
