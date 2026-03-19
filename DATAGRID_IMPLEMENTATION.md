# DataGrid Implementation Guide

## Overview
A unified, responsive grid component that uses `GenericGridHeader` and `GenericGridRowItem` with proper infinite scroll and pagination support.

## Components Used
- **DataGrid** (`components/layout/DataGrid.tsx`) - Main wrapper component
- **GenericGridHeader** (`components/GridHeader/GenericGridHeader.tsx`) - Header with sorting
- **GenericGridRowItem** (`components/GridRowItem/GenericGridRowItem.tsx`) - Row rendering

## Features
✅ Infinite scroll with pagination  
✅ Column sorting  
✅ Search/filtering  
✅ Bulk actions (checkboxes)  
✅ Row actions (edit, delete)  
✅ Responsive layout  
✅ Fixed headers  
✅ Loading states  

## Implementation Pattern

### Step 1: Define Column Configuration
```typescript
import { ColumnConfig } from '../../components/GridRowItem/GenericGridRowItem';
import { GenericHeaderConfig } from '../../components/GridHeader/GenericGridHeader';

// Define how data is rendered
const columns: ColumnConfig<YourDataType>[] = [
  {
    field: 'name',
    width: '25%',
    render: (value) => <strong>{value}</strong>,
  },
  {
    field: 'email',
    width: '35%',
    render: (value) => <span>{value}</span>,
  },
  {
    field: 'status',
    width: '20%',
    render: (value) => <Badge variant={value}>{value}</Badge>,
  },
];

// Define headers with sort settings
const headers: GenericHeaderConfig[] = [
  { field: 'name', label: 'Name', width: '25%', sortable: true },
  { field: 'email', label: 'Email', width: '35%', sortable: true },
  { field: 'status', label: 'Status', width: '20%', sortable: false },
  { field: 'actions', label: 'Actions', width: '20%', type: 'actions' },
];
```

### Step 2: Define Action Buttons
```typescript
import { ActionButton } from '../../components/GridRowItem/GenericGridRowItem';

const actions: ActionButton<YourDataType>[] = [
  {
    icon: <EditIcon />,
    title: 'Edit',
    onClick: (item) => {
      setEditingItem(item);
      setShowModal(true);
    },
  },
  {
    icon: <DeleteIcon />,
    title: 'Delete',
    onClick: (item) => handleDelete(item.id),
  },
];
```

### Step 3: Setup State Management
```typescript
const [items, setItems] = useState<YourDataType[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [sortField, setSortField] = useState<string | null>(null);
const [sortDirection, setSortDirection] = useState<SortDirection>(null);
const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

const PAGE_SIZE = 20;
```

### Step 4: Implement Filtering Logic
```typescript
const filteredItems = useMemo(() => {
  let filtered = items;

  // Search filter
  if (searchTerm.trim()) {
    const query = searchTerm.toLowerCase();
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query)
    );
  }

  // Sort
  if (sortField && sortDirection) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortField];
      const bVal = (b as Record<string, unknown>)[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }

  return filtered;
}, [items, searchTerm, sortField, sortDirection]);

// Paginate results
const visibleItems = useMemo(() => {
  return filteredItems.slice(0, displayCount);
}, [filteredItems, displayCount]);
```

### Step 5: Implement Handlers
```typescript
// Handle sort
const handleSort = (field: string, direction: SortDirection) => {
  setSortField(field);
  setSortDirection(direction);
  setDisplayCount(PAGE_SIZE); // Reset pagination
};

// Handle bulk action
const handleBulkAction = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.checked) {
    setSelectedItems(new Set(visibleItems.map((item) => String(item.id))));
  } else {
    setSelectedItems(new Set());
  }
};

// Handle load more (infinite scroll)
const handleLoadMore = () => {
  setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, filteredItems.length));
};
```

### Step 6: Render DataGrid
```tsx
return (
  <div className="h-full flex flex-col">
    {/* Header Section - Fixed */}
    <div className="shrink-0 bg-white border-b border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Items</h1>
      </div>
      <div className="p-4 bg-gray-50">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
    </div>

    {/* Grid Section - Scrollable */}
    <div className="flex-1 overflow-hidden">
      <DataGrid
        items={visibleItems}
        columns={columns}
        headers={headers}
        actions={actions}
        isLoading={isLoading}
        hasMore={visibleItems.length < filteredItems.length}
        onLoadMore={handleLoadMore}
        onSort={handleSort}
        onBulkAction={handleBulkAction}
        showCheckbox={true}
        selectedItems={selectedItems}
        containerHeight="100%"
      />
    </div>
  </div>
);
```

## Implementation Timeline

### Phase 1: Core Pages (Week 1)
- [ ] Update ProductsGridPage
- [ ] Update VendorsGridPage
- [ ] Update ProjectPage

### Phase 2: Secondary Pages (Week 2)
- [ ] Update QuotesPage
- [ ] Update DashboardGridPage
- [ ] Update SalesGridPage

### Phase 3: Edge Cases (Week 3)
- [ ] Add custom renderers
- [ ] Bulk actions implementation
- [ ] Export functionality

## DataGrid Props Reference

```typescript
interface DataGridProps<T = Record<string, unknown>> {
  // Required
  items: T[];
  columns: ColumnConfig<T>[];
  headers: GenericHeaderConfig[];

  // Optional
  actions?: ActionButton<T>[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onRowClick?: (item: T) => void;
  onRowDoubleClick?: (item: T) => void;
  onSort?: (field: string, direction: SortDirection) => void;
  onBulkAction?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showCheckbox?: boolean;
  showIndicator?: boolean;
  selectedItems?: Set<string>;
  containerHeight?: string; // e.g., '100%', '60vh'
  className?: string;
}
```

## File References
- **DataGrid Component**: `src/components/layout/DataGrid.tsx`
- **Generic Header**: `src/components/GridHeader/GenericGridHeader.tsx`
- **Generic Row Item**: `src/components/GridRowItem/GenericGridRowItem.tsx`
- **Example Implementation**: `src/pages/inventory/ProductsGridPage-new.tsx`

## Best Practices
1. ✅ Always define columns with proper widths (sum ~100%)
2. ✅ Use `useMemo` for filtering/sorting to prevent re-renders
3. ✅ Reset pagination when filters change
4. ✅ Use proper ID field for React keys
5. ✅ Keep headers in flex container for sticky positioning
6. ✅ Set containerHeight to fill parent space

## Troubleshooting

### Grid not scrolling?
- Ensure parent div has `h-full` class
- Check that `containerHeight="100%"` is set
- Verify no overflow-hidden on intermediate containers

### Headers moving when scrolling?
- DataGrid has sticky headers built-in
- Check z-index of sticky header (z-50)
- Ensure no transform properties on parent

### Infinite scroll not triggering?
- Set `hasMore={true}` when more items available
- Provide `onLoadMore` callback
- Check that items count is increasing

---

**Version**: 1.0  
**Last Updated**: March 18, 2026
