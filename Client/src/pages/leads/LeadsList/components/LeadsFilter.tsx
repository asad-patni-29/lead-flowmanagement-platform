import type { FormEvent } from 'react';
import SearchInput from '@/components/common/SearchInput/SearchInput';
import SelectField from '@/components/common/SelectField';
import type { LeadStatus } from '@/features/leads';

interface LeadsFilterProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  status: LeadStatus | '';
  onStatusChange: (value: LeadStatus | '') => void;
  assignedTo: string;
  onAssignedToChange: (value: string) => void;
  onResetFilters: () => void;
  isAdmin: boolean;
  statusOptions: Array<{ label: string; value: LeadStatus | '' }>;
  assignedOptions: Array<{ label: string; value: string }>;
}

const LeadsFilter = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  status,
  onStatusChange,
  assignedTo,
  onAssignedToChange,
  onResetFilters,
  isAdmin,
  statusOptions,
  assignedOptions,
}: LeadsFilterProps) => {
  console.log(assignedOptions, "assignedOptions");
  
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={onSearchSubmit} className="flex min-w-0 flex-1 items-center gap-2">
          <SearchInput
            id="lead-search"
            value={searchInput}
            onChange={onSearchInputChange}
            placeholder="Search name, email, company..."
            className="flex-1 min-w-0 max-w-lg"
            inputClassName="w-full"
            ariaLabel="Search leads"
          />
        </form>

        <div className="min-w-[170px]">
          <SelectField
            label=""
            name="status-filter"
            value={statusOptions?.find((option) => option?.value === status) ?? null}
            options={statusOptions}
            onChange={(option) => {
              onStatusChange((option?.value as LeadStatus | '') ?? '');
            }}
            placeholder="All statuses"
            isSearchable={false}
            className="w-full"
          />
        </div>

        {isAdmin && (
          <div className="min-w-[180px]">
            <SelectField
              label=""
              name="assigned-filter"
              value={assignedOptions.find((option) => option.value === assignedTo) ?? null}
              options={assignedOptions}
              onChange={(option) => {
                onAssignedToChange(option?.value ?? '');
              }}
              placeholder="Everyone"
              isSearchable={false}
              className="w-full"
            />
          </div>
        )}

        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
};

export default LeadsFilter;
