import { useMemo } from 'react';
import SelectField, { type SelectOption } from '@/components/common/SelectField';
import { LEAD_STATUSES, type Lead, type LeadStatus } from '@/features/leads';
import type { ManagedUser } from '@/features/users';
import { formatDateTime } from '@/shared/utils/dateFormatter';

interface LeadSidebarDetailsProps {
  lead: Lead;
  users: ManagedUser[];
  isAdmin: boolean;
  saving: boolean;
  isViewMode: boolean;
  onStatusChange: (status: LeadStatus) => void;
  onAssignChange: (assignedTo: string) => void;
}

const LeadSidebarDetails: React.FC<LeadSidebarDetailsProps> = ({
  lead,
  users,
  isAdmin,
  saving,
  isViewMode,
  onStatusChange,
  onAssignChange,
}) => {
  const statusOptions = useMemo<SelectOption<LeadStatus>[]>(
    () =>
      LEAD_STATUSES.map((status) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
      })),
    []
  );
  const selectedStatus = statusOptions.find((option) => option.value === lead.status) ?? null;

  const userOptions = useMemo<SelectOption[]>(
    () => [
      { label: 'Unassigned', value: '' },
      ...users.map((user) => ({
        label: user.name,
        value: user.id,
      })),
    ],
    [users]
  );
  const selectedUser = userOptions.find((option) => option.value === (lead.assignedTo?.id || '')) ?? null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="font-semibold text-slate-900">Lead Status</h3>
        </div>
        <SelectField
          label="Status"
          name="status"
          options={statusOptions}
          value={selectedStatus}
          onChange={(option) => {
            if (option) onStatusChange(option.value);
          }}
          isDisabled={saving || isViewMode}
        />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="font-semibold text-slate-900">Assignment</h3>
        </div>

        {isAdmin ? (
          <SelectField
            label="Assigned to"
            name="assignedTo"
            options={userOptions}
            value={selectedUser}
            onChange={(option) => {
              if (option) onAssignChange(option.value);
            }}
            isDisabled={saving || isViewMode}
            placeholder="Select user to assign"
            isSearchable
          />
        ) : (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <p className="text-xs text-slate-600 mb-1.5">Assigned to</p>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
                {(lead.assignedTo?.name.charAt(0) || 'U').toUpperCase()}
              </div>
              <p className="text-sm font-medium text-slate-900">
                {lead.assignedTo?.name || 'Unassigned'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6 space-y-4">
        <div>
          <p className="text-xs text-slate-600 mb-1.5 uppercase font-semibold tracking-wide">Source</p>
          <p className="text-sm font-medium text-slate-900 capitalize bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-slate-200">
            {lead.source.replace('_', ' ')}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 mb-1.5 uppercase font-semibold tracking-wide">Created</p>
          <p className="text-sm text-slate-700">
            {formatDateTime(lead.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadSidebarDetails;
