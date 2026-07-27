import { GET, POST, PUT, DELETE } from '@/shared/utils/api-utils';
import UserEndpoints from '@/endpoints/user-endpoint';
import type { ApiEnvelope, PaginatedResponse } from '@/shared/types/api';
import type { ManagedUser, CreateUserPayload, FetchUsersParams } from './userTypes';

const usersService = {
  list: async (params?: FetchUsersParams) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${UserEndpoints.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await GET({ URL: url });
    return response.data as PaginatedResponse<ManagedUser[]>;
  },

  create: async (payload: CreateUserPayload) => {
    const response = await POST<CreateUserPayload>({ URL: UserEndpoints.create, body: payload });
    return (response.data as ApiEnvelope<ManagedUser>).data;
  },

  update: async (userId: string, payload: Partial<CreateUserPayload>) => {
    const response = await PUT<Partial<CreateUserPayload>>({ 
      URL: `${UserEndpoints.update}/${userId}`, 
      body: payload 
    });
    return (response.data as ApiEnvelope<ManagedUser>).data;
  },

  delete: async (userId: string) => {
    const response = await DELETE({ URL: `${UserEndpoints.delete}/${userId}` });
    return (response.data as ApiEnvelope<void>).data;
  },
};

export default usersService;
