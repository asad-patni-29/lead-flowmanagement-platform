import type { LeadStatus } from '@/features/leads';

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-slate-100 text-slate-700',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-violet-100 text-violet-700',
  proposal: 'bg-amber-100 text-amber-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-rose-100 text-rose-700',
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

const StatusBadge = ({ status }: { status: LeadStatus }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {STATUS_LABELS[status]}
  </span>
);

export default StatusBadge;
