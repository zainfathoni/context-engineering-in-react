export interface DataItem {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive' | 'pending'
  role: string
  lastLogin: string
  createdAt: string
  department: string
  salary?: number
}

export interface ComplexDataTableProps {
  data: DataItem[]
  pageSize?: number
  onRowSelect?: (item: DataItem) => void
  onBulkAction?: (action: string, selectedIds: number[]) => void
  virtualScrolling?: boolean
  realTimeUpdates?: boolean
}

export interface ContextMenuState {
  x: number
  y: number
  item: DataItem
}

export type SortDirection = 'asc' | 'desc'
export type SortField = keyof DataItem
export type FilterStatus = 'all' | 'active' | 'inactive' | 'pending'

export interface TableDataState {
  searchTerm: string
  sortField: SortField
  sortDirection: SortDirection
  filterStatus: FilterStatus
  currentPage: number
}

export interface TableSelectionState {
  selectedRows: Set<number>
}

export interface TableInteractionsState {
  contextMenu: ContextMenuState | null
  draggedItem: DataItem | null
}

export interface TableEffectsState {
  isLoading: boolean
}