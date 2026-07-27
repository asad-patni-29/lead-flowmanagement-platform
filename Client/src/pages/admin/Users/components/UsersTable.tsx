import { FiEdit2 } from 'react-icons/fi';
import type { ManagedUser } from '@/features/users';
import { dateFormatter, getInitials } from '@/shared/utils/dateFormatter';
import PageLoader from '@/components/common/PageLoader';

type SortKey = 'name' | 'email' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface UsersTableProps {
  users: ManagedUser[];
  loading: boolean;
  onEdit: (user: ManagedUser) => void;
  sortBy: SortKey;
  sortOrder: SortOrder;
  onSort: (column: SortKey) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, loading, onEdit, sortBy, sortOrder, onSort }) => {
  const getSortIcon = (column: SortKey) => {
    if (sortBy !== column) {
      return '↕';
    }
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <PageLoader />
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="text-center py-12 text-slate-500 text-sm">
          <div className="mb-2">👥</div>
          <p>No team members found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => onSort('name')}
                  className="inline-flex items-center gap-1 text-left hover:text-blue-600 transition"
                >
                  Name
                  <span className="text-xs text-slate-400">{getSortIcon('name')}</span>
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => onSort('email')}
                  className="inline-flex items-center gap-1 text-left hover:text-blue-600 transition"
                >
                  Email
                  <span className="text-xs text-slate-400">{getSortIcon('email')}</span>
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">Role</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => onSort('createdAt')}
                  className="inline-flex items-center gap-1 text-left hover:text-blue-600 transition"
                >
                  Joined
                  <span className="text-xs text-slate-400">{getSortIcon('createdAt')}</span>
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${
                  index === users.length - 1 ? 'last:border-0' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
                      {getInitials(user.name)}
                    </div>
                    <span className="font-medium text-slate-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold gap-1.5 ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}
                    />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{dateFormatter(user.createdAt, 'MMM D, YYYY')}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg transition hover:bg-blue-100"
                      title="Edit user"
                    >
                      <FiEdit2 className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
