import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { fetchUsersThunk, createUserThunk, updateUserThunk } from '@/features/users';
import type { CreateUserPayload, ManagedUser } from '@/features/users';
import { useDebounce } from '@/hooks/useDebounce';
import Pagination from '@/components/common/Pagination';
import { UserFormModal, UsersTable } from './components';

const PAGE_SIZE = 10;

type SortKey = 'name' | 'email' | 'createdAt';
type SortOrder = 'asc' | 'desc';

const Users = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, meta, loading, saving } = useSelector((state: RootState) => state.users);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const debouncedSearch = useDebounce(searchInput.trim(), 400);

  const fetchUsersList = useCallback(() => {
    dispatch(
      fetchUsersThunk({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        sortBy,
        sortOrder,
      })
    );
  }, [dispatch, page, debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  const handleCreateUser = async (data: CreateUserPayload) => {
    if (editingUser) {
      // Update existing user - exclude empty password
      const updatePayload = {
        name: data.name,
        email: data.email,
        role: data.role,
      };
      // Only include password if it has a value
      if (data.password && data.password.trim()) {
        (updatePayload as any).password = data.password;
      }
      const result = await dispatch(updateUserThunk({ userId: editingUser.id, payload: updatePayload }));
      if (updateUserThunk.fulfilled.match(result)) {
        setShowForm(false);
        setEditingUser(null);
        fetchUsersList();
      }
    } else {
      // Create new user - include all fields
      const result = await dispatch(createUserThunk(data));
      if (createUserThunk.fulfilled.match(result)) {
        setShowForm(false);
        setEditingUser(null);
        fetchUsersList();
      }
    }
  };

  const handleEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setShowForm(true);
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

  const handleSearchChange = (value: string) => {
    setPage(1);
    setSearchInput(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-sm text-slate-600 mt-1">Manage admin and member accounts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-purple-700 shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <UserFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingUser(null);
        }}
        onSubmit={handleCreateUser}
        saving={saving}
        editingUser={editingUser}
      />

      <UsersTable
        users={items}
        loading={loading}
        onEdit={handleEdit}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default Users;
