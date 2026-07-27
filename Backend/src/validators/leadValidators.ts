import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from '../types';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const objectId = z.string().regex(objectIdRegex, 'Invalid id');

const baseContact = {
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(150).optional(),
  message: z.string().trim().max(2000).optional(),
};

export const publicCreateLeadSchema = z.object({
  ...baseContact,
  source: z.enum(LEAD_SOURCES).optional(),
});

export const createLeadSchema = z.object({
  ...baseContact,
  source: z.enum(LEAD_SOURCES).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  assignedTo: objectId.nullable().optional(),
});

export const updateLeadSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().min(1).email('Invalid email address').optional(),
    phone: z.string().trim().max(30).optional(),
    company: z.string().trim().max(150).optional(),
    source: z.enum(LEAD_SOURCES).optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    assignedTo: objectId.nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export const addNoteSchema = z.object({
  text: z.string().trim().min(1, 'Note text is required').max(2000),
});

export const listLeadsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  assignedTo: z.string().optional(),
  source: z.enum(LEAD_SOURCES).optional(),
  search: z.string().trim().optional(),
  sort: z.enum(['newest', 'oldest']).optional(),
  sortBy: z.enum(['name', 'company', 'status', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const idParamSchema = z.object({
  id: objectId,
});

export type PublicCreateLeadInput = z.infer<typeof publicCreateLeadSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
