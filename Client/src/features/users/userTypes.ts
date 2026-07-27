import type { Role } from '@/features/auth';
import type { PaginationMeta } from '@/shared/types/api';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UsersState {
  items: ManagedUser[];
  meta: PaginationMeta | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}
