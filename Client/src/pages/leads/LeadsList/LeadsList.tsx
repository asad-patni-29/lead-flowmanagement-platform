import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLeadThunk } from '@/features/leads';
import type { RootState, AppDispatch } from '@/app/store';
import { fetchLeadsThunk, LEAD_STATUSES } from '@/features/leads';
import type { LeadStatus } from '@/features/leads';
import { fetchUsersThunk } from '@/features/users';
import StatusBadge from '@/components/leads/StatusBadge';
import PageLoader from '@/components/common/PageLoader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/common/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { dateFormatter, getInitials } from '@/shared/utils/dateFormatter';
import LeadsFilter from './components/LeadsFilter';
import ROLE from '@/constants/roles';

const PAGE_SIZE = 10;

type SortKey = 'name' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const LeadsList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, meta, loading, error } = useSelector((state: RootState) => state.leads);
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: users } = useSelector((state: RootState) => state.users);
  const isAdmin = user?.role === ROLE.ADMIN;

  const statusOptions = useMemo(
    () =>
      LEAD_STATUSES.map((s) => ({
        label: s.charAt(0).toUpperCase() + s.slice(1),
        value: s,
      })),
    []
  );

  const assignedOptions = useMemo(
    () => [
      { label: 'Everyone', value: '' },
      { label: 'Unassigned', value: 'unassigned' },
      ...users.map((userOption) => ({ label: userOption.name, value: userOption.id })),
    ],
    [users]
  );

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    leadId: '',
    leadName: '',
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchInput.trim(), 400);

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchUsersThunk({}));
    }
  }, [dispatch, isAdmin]);

  const fetchLeadsList = useCallback(() => {
    dispatch(
      fetchLeadsThunk({
        page,
        limit: PAGE_SIZE,
        status: status || undefined,
        assignedTo: isAdmin ? assignedTo || undefined : undefined,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
      })
    );
  }, [assignedTo, debouncedSearch, dispatch, isAdmin, page, sortBy, sortOrder, status]);

  useEffect(() => {
    fetchLeadsList();
  }, [fetchLeadsList]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
  };

  const handleSearchInputChange = (value: string) => {
    setPage(1);
    setSearchInput(value);
  };

  const handleSort = (column: SortKey) => {
    setPage(1);

    if (sortBy === column) {
      setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortBy(column);
    setSortOrder('asc');
  };

  const handleResetFilters = () => {
    setPage(1);
    setStatus('');
    setAssignedTo('');
    setSearchInput('');
  };

  const handleRetry = () => {
    fetchLeadsList();
  };

  const handleDelete = (leadId: string, leadName: string) => {
    setConfirmDialog({
      isOpen: true,
      leadId,
      leadName,
    });
  };

  const handleDeleteCancel = () => {
    if (deletingId) return;
    setConfirmDialog({
      isOpen: false,
      leadId: '',
      leadName: '',
    });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.leadId) return;

    setDeletingId(confirmDialog.leadId);
    const result = await dispatch(deleteLeadThunk(confirmDialog.leadId));
    setDeletingId(null);

    if (deleteLeadThunk.fulfilled.match(result)) {
      fetchLeadsList();
      handleDeleteCancel();
    }
  };

  const displayedItems = items;
  console.log(displayedItems, 'displayedItems');
  

  const getSortIcon = (column: SortKey) => {
    if (sortBy !== column) {
      return '↕';
    }

    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <Link
          to="/leads/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-purple-700 shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Lead
        </Link>
      </div>

      <LeadsFilter
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
        onSearchSubmit={handleSearchSubmit}
        status={status}
        onStatusChange={(value) => {
          setPage(1);
          setStatus(value);
        }}
        assignedTo={assignedTo}
        onAssignedToChange={(value) => {
          setPage(1);
          setAssignedTo(value);
        }}
        onResetFilters={handleResetFilters}
        isAdmin={isAdmin}
        statusOptions={statusOptions}
        assignedOptions={assignedOptions}
      />
      {displayedItems && (
        <div className="text-sm text-slate-500">
          {/* Placeholder to trigger re-render */}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
       

        {loading ? (
          <div className="p-6 sm:p-8">
            <PageLoader />
          </div>
        ) : error ? (
          <div className="px-6 py-16 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-lg text-rose-600">
              !
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">We hit a snag</h2>
            <p className="mt-2 text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="px-6 py-16 text-center sm:px-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600">
              •
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">No leads match your filters</h2>
            <p className="mt-2 text-sm text-slate-500">
              Try widening the search or clearing a few filters to see more results.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-5 inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold sm:px-6">
                    <button
                      type="button"
                      onClick={() => handleSort('name')}
                      className="inline-flex items-center gap-1 text-left"
                    >
                      Name
                      <span className="text-xs text-slate-400">{getSortIcon('name')}</span>
                    </button>
                  </th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Company</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Status</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Assigned to</th>
                  <th className="px-4 py-3 font-semibold sm:px-6">
                    <button
                      type="button"
                      onClick={() => handleSort('createdAt')}
                      className="inline-flex items-center gap-1 text-left"
                    >
                      Created
                      <span className="text-xs text-slate-400">{getSortIcon('createdAt')}</span>
                    </button>
                  </th>
                  <th className="px-4 py-3 font-semibold sm:px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems?.map((lead) => {
                  const assignedName = lead?.assignedTo?.name || 'Unassigned';
                  const initials = getInitials(lead?.name);
                  const assignedInitials = getInitials(assignedName);

                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <Link 
                          to={`/leads/${lead.id}`} 
                          className="block rounded-lg bg-slate-50 p-3 transition hover:bg-blue-50 hover:shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-md">
                              {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900 truncate">{lead.name}</p>
                              <p className="text-xs text-slate-500 truncate">{lead.email}</p>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-4 text-slate-600 sm:px-6">{lead.company || '—'}</td>
                      <td className="px-4 py-4 sm:px-6">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-4 py-4 text-slate-600 sm:px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {assignedInitials}
                          </div>
                          <span className="text-sm">{assignedName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500 sm:px-6">
                        {dateFormatter(lead.createdAt, 'MMM D, YYYY')}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* <Link
                            to={`/leads/${lead.id}?mode=view`}
                            className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            View
                          </Link> */}
                          <Link
                            to={`/leads/${lead.id}`}
                            className="rounded-lg border border-blue-200 px-2.5 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                          >
                            Edit
                          </Link>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDelete(lead.id, lead.name)}
                              className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {meta?.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        message={`Are you sure you want to delete ${confirmDialog.leadName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deletingId === confirmDialog.leadId}
      />
    </div>
  );
};

export default LeadsList;
