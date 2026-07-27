import { Response } from 'express';
import { Lead, ILead } from '../models/Lead';
import { User } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest, ApiResponse } from '../types';
import { parsePagination, buildMeta } from '../utils/pagination';
import { CreateLeadInput, UpdateLeadInput } from '../validators/leadValidators';

const DETAIL_POPULATE = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email role' },
  { path: 'notes.author', select: 'name email role' },
  { path: 'activities.actor', select: 'name email role' },
];

const LIST_POPULATE = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email role' },
];

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const canAccessLead = (req: AuthRequest, lead: ILead): boolean => {
  if (req.user!.role === 'admin') return true;
  return lead.assignedTo?.toString() === req.user!.id;
};

const MEMBER_EDITABLE_FIELDS = ['name', 'email', 'phone', 'company', 'status'];

export const listLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
  const {
    status,
    assignedTo,
    source,
    search,
    sort,
    sortBy,
    sortOrder,
  } = req.query as Record<string, string | undefined>;

  const filter: Record<string, unknown> = {};

  if (req.user!.role === 'member') {
    filter.assignedTo = req.user!.id;
  } else if (assignedTo === 'unassigned') {
    filter.assignedTo = null;
  } else if (assignedTo === 'me') {
    filter.assignedTo = req.user!.id;
  } else if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  if (status) filter.status = status;
  if (source) filter.source = source;

  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: regex }, { email: regex }, { company: regex }];
  }

  const effectiveSortBy = sortBy || (sort === 'oldest' ? 'createdAt' : 'createdAt');
  const effectiveSortOrder = sortOrder || (sort === 'oldest' ? 'asc' : 'desc');
  const mongoSortDirection = effectiveSortOrder === 'asc' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .select('-notes -activities')
      .populate(LIST_POPULATE)
      .sort({ [effectiveSortBy]: mongoSortDirection })
      .skip(skip)
      .limit(limit),
    Lead.countDocuments(filter),
  ]);

  const response: ApiResponse = {
    success: true,
    data: leads,
    meta: buildMeta(page, limit, total),
  };
  res.status(200).json(response);
};

export const getLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  if (!canAccessLead(req, lead)) {
    throw new AppError('You do not have access to this lead', 403);
  }

  await lead.populate(DETAIL_POPULATE);

  const response: ApiResponse = { success: true, data: lead };
  res.status(200).json(response);
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const input = req.body as CreateLeadInput;
  const isAdmin = req.user!.role === 'admin';

  let assignedTo: string | null = null;

  if (isAdmin) {
    if (input.assignedTo) {
      const assignee = await User.findById(input.assignedTo);
      if (!assignee) throw new AppError('assignedTo user does not exist', 400);
      assignedTo = input.assignedTo;
    }
  } else {
    // Members can only create leads assigned to themselves
    assignedTo = req.user!.id;
  }

  const lead = await Lead.create({
    name: input.name,
    email: input.email,
    phone: input.phone,
    company: input.company,
    message: input.message,
    source: input.source ?? 'website',
    status: (isAdmin && input.status) || 'new',
    assignedTo,
    createdBy: req.user!.id,
    activities: [
      {
        type: 'created',
        message: `Lead created by ${req.user!.name}`,
        actor: req.user!.id,
      },
      ...(assignedTo
        ? [
            {
              type: 'assigned' as const,
              message: `Assigned to ${assignedTo === req.user!.id ? req.user!.name : 'selected user'}`,
              actor: req.user!.id,
            },
          ]
        : []),
    ],
  });

  await lead.populate(DETAIL_POPULATE);

  const response: ApiResponse = { success: true, message: 'Lead created', data: lead };
  res.status(201).json(response);
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const input = req.body as UpdateLeadInput;
  const isAdmin = req.user!.role === 'admin';

  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new AppError('Lead not found', 404);
  if (!canAccessLead(req, lead)) {
    throw new AppError('You do not have access to this lead', 403);
  }

  if (!isAdmin) {
    const disallowed = Object.keys(input).filter(
      (key) => !MEMBER_EDITABLE_FIELDS.includes(key)
    );
    if (disallowed.length > 0) {
      throw new AppError(
        `Members are not permitted to update: ${disallowed.join(', ')}`,
        403
      );
    }
  }

  const contactFieldsChanged: string[] = [];

  if (input.status && input.status !== lead.status) {
    lead.activities.push({
      type: 'status_changed',
      message: `Status changed from "${lead.status}" to "${input.status}"`,
      actor: req.user!.id,
    });
    lead.status = input.status;
  }

  if (isAdmin && 'assignedTo' in input) {
    const newAssignedTo = input.assignedTo ?? null;
    const previous = lead.assignedTo?.toString() ?? null;

    if (newAssignedTo !== previous) {
      if (newAssignedTo) {
        const assignee = await User.findById(newAssignedTo);
        if (!assignee) throw new AppError('assignedTo user does not exist', 400);
        lead.activities.push({
          type: 'assigned',
          message: `Assigned to ${assignee.name}`,
          actor: req.user!.id,
        });
      } else {
        lead.activities.push({
          type: 'unassigned',
          message: 'Lead unassigned',
          actor: req.user!.id,
        });
      }
      lead.assignedTo = newAssignedTo;
    }
  }

  (['name', 'email', 'phone', 'company', 'source'] as const).forEach((field) => {
    if (input[field] !== undefined && input[field] !== lead[field]) {
      (lead as unknown as Record<string, unknown>)[field] = input[field];
      contactFieldsChanged.push(field);
    }
  });

  if (contactFieldsChanged.length > 0) {
    lead.activities.push({
      type: 'updated',
      message: `Updated ${contactFieldsChanged.join(', ')}`,
      actor: req.user!.id,
    });
  }

  await lead.save();
  await lead.populate(DETAIL_POPULATE);

  const response: ApiResponse = { success: true, message: 'Lead updated', data: lead };
  res.status(200).json(response);
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new AppError('Lead not found', 404);
  res.status(204).send();
};

export const addNote = async (req: AuthRequest, res: Response): Promise<void> => {
  const { text } = req.body as { text: string };

  const lead = await Lead.findById(req.params.id);
  if (!lead) throw new AppError('Lead not found', 404);
  if (!canAccessLead(req, lead)) {
    throw new AppError('You do not have access to this lead', 403);
  }

  lead.notes.push({
    text,
    author: req.user!.id,
  });

  const preview = text.length > 140 ? `${text.slice(0, 140)}…` : text;
  lead.activities.push({
    type: 'note_added',
    message: `Note added: "${preview}"`,
    actor: req.user!.id,
  });

  await lead.save();
  await lead.populate(DETAIL_POPULATE);

  const response: ApiResponse = { success: true, message: 'Note added', data: lead };
  res.status(201).json(response);
};
