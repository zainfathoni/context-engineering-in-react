# ComplexDataTable Component - Refactoring Plan

## Analysis of Current Component

The ComplexDataTable component is a large monolithic component (~410 lines) with multiple responsibilities:

1. **Data Management**: Search, filtering, sorting, pagination
2. **UI State Management**: Selection, context menu, loading states
3. **Event Handling**: Keyboard navigation, drag & drop, context menu
4. **Rendering**: Table, pagination, status badges, context menu, loading overlay

**Key Issues Identified:**

- Single component handling too many concerns
- Complex state management with 8 different state variables
- Large render function with nested conditional rendering
- Event handlers mixed with component logic
- Inline styles and rendering logic

## Refactoring Plan

### Phase 1: Extract Custom Hooks for State Management

**1.1 Create `useTableData` hook**

- Extract search, filtering, sorting, and pagination logic
- Use currying for filter functions: `createFilter(type)(value)(data)`
- Manage `searchTerm`, `sortField`, `sortDirection`, `filterStatus`, `currentPage`

**1.2 Create `useTableSelection` hook**

- Extract row selection and bulk actions logic
- Use currying for selection handlers: `createSelectionHandler(onRowSelect)(item)`
- Manage `selectedRows` state

**1.3 Create `useTableInteractions` hook**

- Extract keyboard navigation, context menu, and drag & drop logic
- Use currying for event handlers: `createKeyHandler(handlers)(event)`
- Manage `contextMenu`, `draggedItem` states

**1.4 Create `useTableEffects` hook**

- Extract side effects (real-time updates, focus management, click outside)
- Manage `isLoading` state

### Phase 2: Extract Utility Functions with Currying

#### 2.1 Data Processing Functions

```typescript
const createSearchFilter = (searchTerm: string) => (item: DataItem) => boolean
const createStatusFilter = (status: string) => (item: DataItem) => boolean
const createSortComparator = (field: keyof DataItem) => (direction: 'asc' | 'desc') => 
  (a: DataItem, b: DataItem) => number
```

#### 2.2 Event Handler Factories

```typescript
const createSortHandler = (setSortField: Function, setSortDirection: Function) => 
  (field: keyof DataItem) => void
const createSelectionHandler = (setSelectedRows: Function, onRowSelect?: Function) => 
  (id: number, item: DataItem) => void
```

### Phase 3: Break Down into Composable Components

#### 3.1 Create `<TableControls>` component

- Props: search handlers, filter handlers, bulk action handlers
- Contains: search input, status filter, bulk actions

#### 3.2 Create `<DataTableHeader>` component

- Props: sort handlers, select all handler, current sort state
- Contains: table header with sortable columns

#### 3.3 Create `<DataTableRow>` component

- Props: item data, selection state, event handlers
- Contains: individual table row with checkbox, data cells

#### 3.4 Create `<DataTableBody>` component

- Props: paginated data, selection state, all row event handlers
- Contains: tbody with mapped DataTableRow components

#### 3.5 Create `<TablePagination>` component

- Props: current page, total pages, page change handler
- Contains: pagination controls

#### 3.6 Create `<ContextMenu>` component

- Props: menu state, position, item data, action handlers
- Contains: context menu with action buttons

#### 3.7 Create `<StatusBadge>` component

- Props: status value
- Contains: styled status indicator

#### 3.8 Create `<LoadingOverlay>` component

- Props: loading state
- Contains: loading spinner and overlay

### Phase 4: Main Component Restructure

#### 4.1 Simplified ComplexDataTable

- Use all custom hooks for state management
- Compose child components
- Minimal local logic, mostly prop passing

#### 4.2 Props Interface Refinement

- Keep existing public API unchanged for backward compatibility
- Internal props between components will be more granular

### Phase 5: Performance Optimizations

#### 5.1 Memoization Strategy

- Wrap child components in `React.memo` where appropriate
- Use `useMemo` for expensive computations
- Use `useCallback` for event handlers passed as props

#### 5.2 Virtual Scrolling Enhancement

- Extract virtual scrolling logic into separate hook
- Create `<VirtualizedTableBody>` component when needed

## Expected Benefits

1. **Maintainability**: Each component has single responsibility
2. **Testability**: Smaller components and isolated hooks are easier to test
3. **Reusability**: Components can be reused in other contexts
4. **Performance**: Better memoization and re-render optimization
5. **Readability**: Clear separation of concerns and smaller code units
6. **Type Safety**: Better TypeScript inference with smaller interfaces

## File Structure

```text
src/components/ComplexDataTable/
├── index.ts
├── ComplexDataTable.tsx (main component)
├── components/
│   ├── TableControls.tsx
│   ├── DataTableHeader.tsx
│   ├── DataTableRow.tsx
│   ├── DataTableBody.tsx
│   ├── TablePagination.tsx
│   ├── ContextMenu.tsx
│   ├── StatusBadge.tsx
│   └── LoadingOverlay.tsx
├── hooks/
│   ├── useTableData.ts
│   ├── useTableSelection.ts
│   ├── useTableInteractions.ts
│   └── useTableEffects.ts
├── utils/
│   ├── dataProcessing.ts
│   ├── eventHandlers.ts
│   └── constants.ts
└── types.ts
```

## Implementation Notes

- Maintain existing public API for backward compatibility
- All interaction patterns documented in `/docs/test-plans/complex-data-table-interactions.md` must continue to work
- Use progressive enhancement approach - refactor incrementally while maintaining functionality
- Add comprehensive tests for each new component and hook
- Consider accessibility implications when breaking down components

## Success Criteria

- [ ] All existing functionality preserved
- [ ] Existing tests continue to pass
- [ ] Component size reduced by at least 50%
- [ ] Each component has single, clear responsibility
- [ ] Improved TypeScript type safety
- [ ] Better performance through targeted memoization
- [ ] Comprehensive test coverage for new components and hooks
