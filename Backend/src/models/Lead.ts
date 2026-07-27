import { Schema, model, Document, Types } from 'mongoose';
import { LeadStatus, LeadSource, LEAD_STATUSES, LEAD_SOURCES } from '../types';

type Ref = Types.ObjectId | string;

export interface INote {
  _id?: Types.ObjectId;
  text: string;
  author: Ref;
  createdAt?: Date;
}

export type ActivityType =
  | 'created'
  | 'status_changed'
  | 'assigned'
  | 'unassigned'
  | 'note_added'
  | 'updated';

export interface IActivity {
  _id?: Types.ObjectId;
  type: ActivityType;
  message: string;
  actor: Ref | null;
  createdAt?: Date;
}

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: Ref | null;
  createdBy: Ref | null;
  notes: Types.DocumentArray<INote>;
  activities: Types.DocumentArray<IActivity>;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const activitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'created',
        'status_changed',
        'assigned',
        'unassigned',
        'note_added',
        'updated',
      ],
    },
    message: { type: String, required: true },
    actor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, maxlength: 30 },
    company: { type: String, trim: true, maxlength: 150 },
    message: { type: String, trim: true, maxlength: 2000 },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: true,
      default: 'website',
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      required: true,
      default: 'new',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    notes: { type: [noteSchema], default: [] },
    activities: { type: [activitySchema], default: [] },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text', company: 'text' });

leadSchema.set('toJSON', {
  transform: (_doc: unknown, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Lead = model<ILead>('Lead', leadSchema);
