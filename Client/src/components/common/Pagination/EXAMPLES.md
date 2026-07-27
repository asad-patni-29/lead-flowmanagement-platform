# Pagination Component Examples

## Basic Usage

### Simple Pagination
```tsx
import Pagination from '@/components/common/Pagination';

function MyList() {
  const [page, setPage] = useState(1);
  const totalPages = 10;

  return (
    <div>
      {/* Your content */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

### With Custom Max Visible Pages
```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  maxVisiblePages={5} // Default is 7
/>
```

## Advanced Usage

### Pagination with Info Text
```tsx
import { PaginationWithInfo } from '@/components/common/Pagination';

function MyList() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalItems = 95;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <PaginationWithInfo
      currentPage={page}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={setPage}
    />
  );
}
```

**Result**: Shows "Showing 1 to 10 of 95 results" plus pagination controls

### Full-Featured Pagination with Page Size Selector
```tsx
import { AdvancedPagination } from '@/components/common/Pagination';

function MyList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 95;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to page 1 when changing page size
  };

  return (
    <AdvancedPagination
      currentPage={page}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={handlePageSizeChange}
      pageSizeOptions={[10, 25, 50, 100]}
      showInfo={true}
    />
  );
}
```

**Result**: Shows info text, page size dropdown, and pagination controls

## Real-World Example: Users List

```tsx
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '@/components/common/Pagination';
import { fetchUsersThunk } from '@/features/users';
import type { RootState, AppDispatch } from '@/app/store';

const PAGE_SIZE = 10;

function UsersList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, meta, loading } = useSelector((state: RootState) => state.users);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(() => {
    dispatch(
      fetchUsersThunk({
        page,
        limit: PAGE_SIZE,
      })
    );
  }, [dispatch, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {/* User list content */}
      <div className="grid gap-4">
        {items.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>

      {/* Pagination */}
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
}
```

## With Search and Filters

```tsx
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Pagination from '@/components/common/Pagination';

function FilterableList() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  // Fetch data
  const fetchData = useCallback(() => {
    // API call with filters
    fetchItems({
      page,
      search: debouncedSearch,
      status,
    });
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (value: string) => {
    setPage(1); // Reset to page 1 when searching
    setSearchInput(value);
  };

  const handleStatusChange = (value: string) => {
    setPage(1); // Reset to page 1 when filtering
    setStatus(value);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        value={searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search..."
      />

      {/* Filter */}
      <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      {/* Results */}
      {/* ... */}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

## With Sorting

```tsx
type SortKey = 'name' | 'email' | 'createdAt';
type SortOrder = 'asc' | 'desc';

function SortableList() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (column: SortKey) => {
    setPage(1); // Reset to page 1 when sorting
    
    if (sortBy === column) {
      // Toggle order if same column
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column: SortKey) => {
    if (sortBy !== column) return '↕';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>
              <button onClick={() => handleSort('name')}>
                Name {getSortIcon('name')}
              </button>
            </th>
            <th>
              <button onClick={() => handleSort('email')}>
                Email {getSortIcon('email')}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* ... */}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
```

## Conditional Rendering

```tsx
// Only show pagination if there are multiple pages
{meta?.totalPages > 1 && (
  <Pagination
    currentPage={page}
    totalPages={meta.totalPages}
    onPageChange={setPage}
  />
)}

// Only show if not loading and has data
{!loading && items.length > 0 && meta?.totalPages > 1 && (
  <Pagination
    currentPage={page}
    totalPages={meta.totalPages}
    onPageChange={setPage}
  />
)}
```

## Styling Customization

The pagination component uses Tailwind classes. If you need custom styling:

```tsx
// Wrap in a custom container
<div className="my-custom-pagination-wrapper">
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
</div>

// Add custom CSS
.my-custom-pagination-wrapper {
  /* Your custom styles */
}
```

Or modify the component directly in:
`/Client/src/components/common/Pagination/Pagination.tsx`

## Error Handling

```tsx
function SafePagination() {
  const { meta, error } = useSelector((state: RootState) => state.users);
  const [page, setPage] = useState(1);

  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  if (!meta) {
    return null;
  }

  return (
    <Pagination
      currentPage={page}
      totalPages={meta.totalPages}
      onPageChange={setPage}
    />
  );
}
```

## Performance Tips

1. **Use debouncing for search**:
```tsx
const debouncedSearch = useDebounce(searchInput, 400);
```

2. **Reset page when filters change**:
```tsx
const handleFilterChange = (value: string) => {
  setPage(1); // Important!
  setFilter(value);
};
```

3. **Memoize callbacks**:
```tsx
const fetchData = useCallback(() => {
  // API call
}, [page, filters]);
```

4. **Use meta from API response**:
```tsx
// Let backend calculate totalPages
const { data, meta } = response;
// Use meta.totalPages instead of calculating client-side
```
