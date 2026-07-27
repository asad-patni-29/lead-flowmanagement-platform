import { Request, Response } from 'express';
import { Lead } from '../models/Lead';
import { ApiResponse } from '../types';
import { PublicCreateLeadInput } from '../validators/leadValidators';

export const createPublicLead = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, company, message, source } = req.body as PublicCreateLeadInput;

  const lead = await Lead.create({
    name,
    email,
    phone,
    company,
    message,
    source: source ?? 'website',
    status: 'new',
    assignedTo: null,
    createdBy: null,
    activities: [
      {
        type: 'created',
        message: 'Lead submitted via public capture form',
        actor: null,
      },
    ],
  });

  const response: ApiResponse = {
    success: true,
    message: 'Thanks! Our team will be in touch shortly.',
    data: { id: lead._id },
  };
  res.status(201).json(response);
};
