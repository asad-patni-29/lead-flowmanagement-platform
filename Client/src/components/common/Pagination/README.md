# Pagination Component

A custom, accessible pagination component built from scratch to replace react-paginate library.

## Features

- ✅ Smart page number display with ellipsis for large page counts
- ✅ Previous/Next navigation buttons
- ✅ Responsive design
- ✅ Accessible (ARIA labels, keyboard navigation)
- ✅ Customizable max visible pages
- ✅ Disabled state for boundary pages
- ✅ Clean, modern UI matching the app design system

## Usage

```tsx
import Pagination from '@/components/common/Pagination';

function MyComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      maxVisiblePages={7} // optional, defaults to 7
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentPage` | `number` | Yes | - | Current active page (1-indexed) |
| `totalPages` | `number` | Yes | - | Total number of pages |
| `onPageChange` | `(page: number) => void` | Yes | - | Callback when page changes |
| `maxVisiblePages` | `number` | No | `7` | Maximum number of page buttons to show |

## Pagination Logic

The component uses smart logic to display page numbers:

- **Few pages (≤ maxVisiblePages)**: Shows all page numbers
- **Many pages**: Shows first, last, current, and nearby pages with ellipsis

### Examples:

**7 total pages (shows all):**
```
← 1 2 3 4 5 6 7 →
```

**20 total pages, page 1 selected:**
```
← 1 2 3 4 5 ... 20 →
```

**20 total pages, page 10 selected:**
```
← 1 ... 9 10 11 ... 20 →
```

**20 total pages, page 20 selected:**
```
← 1 ... 16 17 18 19 20 →
```

## Styling

The component uses Tailwind CSS classes and follows the app's design system:

- Active page: Blue background (`bg-blue-600`)
- Inactive pages: White background with border
- Hover state: Light gray background (`hover:bg-slate-50`)
- Disabled state: Reduced opacity and disabled cursor

## Accessibility

- Uses semantic `button` elements
- Includes `aria-label` for screen readers
- Uses `aria-current="page"` for the active page
- Keyboard navigable
- Disabled states prevent interaction

## Migration from react-paginate

If you're migrating from react-paginate, here's the mapping:

| react-paginate | Custom Pagination |
|----------------|-------------------|
| `pageCount` | `totalPages` |
| `forcePage` (0-indexed) | `currentPage` (1-indexed) |
| `onPageChange={({selected}) => setPage(selected + 1)}` | `onPageChange={setPage}` |
| `previousLabel` | Built-in `←` |
| `nextLabel` | Built-in `→` |
| `containerClassName` | Not needed (styled by default) |
| `activeClassName` | Automatic styling |

### Before (react-paginate):
```tsx
<ReactPaginate
  pageCount={meta.totalPages}
  forcePage={page - 1}
  onPageChange={({ selected }) => setPage(selected + 1)}
  previousLabel="←"
  nextLabel="→"
  containerClassName="flex items-center gap-1 text-sm"
  pageClassName="px-3 py-1.5 rounded-lg border..."
  activeClassName="!border-blue-600 !bg-blue-600 !text-white"
  // ... more className props
/>
```

### After (custom Pagination):
```tsx
<Pagination
  currentPage={page}
  totalPages={meta.totalPages}
  onPageChange={setPage}
/>
```

## Benefits Over react-paginate

1. **No external dependency** - One less package to maintain
2. **Simpler API** - Less props, more intuitive
3. **Better TypeScript support** - Built with TS from the ground up
4. **Customizable** - Easy to modify since it's in your codebase
5. **Lighter** - No extra bundle size from external library
6. **Better integration** - Matches your design system perfectly
