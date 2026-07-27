import { GET, POST, PATCH, DELETE } from '@/shared/utils/api-utils';
import LeadEndpoints from '@/endpoints/lead-endpoint';
import type { ApiEnvelope, PaginationMeta } from '@/shared/types/api';
import type {
  Lead,
  LeadListParams,
  CreateLeadPayload,
  UpdateLeadPayload,
  PublicLeadPayload,
} from './leadTypes';

const leadsService = {
  list: async (params: LeadListParams) => {
    const response = await GET({ URL: LeadEndpoints.list, params: params as Record<string, unknown> });
    const body = response.data as ApiEnvelope<Lead[]>;
    return { items: body.data, meta: body.meta as PaginationMeta };
  },

  get: async (id: string) => {
    const response = await GET({ URL: LeadEndpoints.detail(id) });
    return (response.data as ApiEnvelope<Lead>).data;
  },

  create: async (payload: CreateLeadPayload) => {
    const response = await POST<CreateLeadPayload>({ URL: LeadEndpoints.create, body: payload });
    return (response.data as ApiEnvelope<Lead>).data;
  },

  update: async (id: string, payload: UpdateLeadPayload) => {
    const response = await PATCH<UpdateLeadPayload>({ URL: LeadEndpoints.detail(id), body: payload });
    return (response.data as ApiEnvelope<Lead>).data;
  },

  remove: async (id: string) => {
    await DELETE({ URL: LeadEndpoints.detail(id) });
  },

  addNote: async (id: string, text: string) => {
    const response = await POST<{ text: string }>({ URL: LeadEndpoints.notes(id), body: { text } });
    return (response.data as ApiEnvelope<Lead>).data;
  },

  createPublic: async (payload: PublicLeadPayload) => {
    const response = await POST<PublicLeadPayload>({ URL: LeadEndpoints.publicCreate, body: payload });
    return (response.data as ApiEnvelope<{ id: string }>).data;
  },
};

export default leadsService;
