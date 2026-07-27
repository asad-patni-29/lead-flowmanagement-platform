import { Request } from 'express';

export const ROLES = ['admin', 'member'] as const;
export type Role = (typeof ROLES)[number];

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'won',
  'lost',
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = [
  'website',
  'referral',
  'cold_call',
  'event',
  'other',
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  error?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  stack?: string;
}
