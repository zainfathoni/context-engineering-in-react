import { useState, useCallback } from 'react'
import { DataItem, TableSelectionState } from '../types'

const createSelectionHandler = (
  setSelectedRows: (rows: Set<number>) => void,
  onRowSelect?: (item: DataItem) => void
) => (id: number, item: DataItem): void => {
  setSelectedRows(prev => {
    const newSelected = new Set(prev)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    return newSelected
  })
  
  if (onRowSelect) {
    onRowSelect(item)
  }
}

const createBulkActionHandler = (
  selectedRows: Set<number>,
  onBulkAction?: (action: string, selectedIds: number[]) => void
) => (action: string): void => {
  if (onBulkAction && selectedRows.size > 0) {
    onBulkAction(action, Array.from(selectedRows))
  }
}

const createSelectAllHandler = (
  selectedRows: Set<number>,
  setSelectedRows: (rows: Set<number>) => void,
  paginatedData: DataItem[]
) => (): void => {
  if (selectedRows.size === paginatedData.length && paginatedData.length > 0) {
    setSelectedRows(new Set())
  } else {
    setSelectedRows(new Set(paginatedData.map(item => item.id)))
  }
}

interface UseTableSelectionProps {
  onRowSelect?: (item: DataItem) => void
  onBulkAction?: (action: string, selectedIds: number[]) => void
  paginatedData: DataItem[]
}

interface UseTableSelectionReturn extends TableSelectionState {
  handleRowSelect: (id: number, item: DataItem) => void
  handleBulkAction: (action: string) => void
  handleSelectAll: () => void
  setSelectedRows: (rows: Set<number>) => void
  clearSelection: () => void
}

export const useTableSelection = ({
  onRowSelect,
  onBulkAction,
  paginatedData
}: UseTableSelectionProps): UseTableSelectionReturn => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const handleRowSelect = useCallback(
    createSelectionHandler(setSelectedRows, onRowSelect),
    [onRowSelect]
  )

  const handleBulkAction = useCallback(
    createBulkActionHandler(selectedRows, onBulkAction),
    [selectedRows, onBulkAction]
  )

  const handleSelectAll = useCallback(
    createSelectAllHandler(selectedRows, setSelectedRows, paginatedData),
    [selectedRows, paginatedData]
  )

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set())
  }, [])

  return {
    selectedRows,
    handleRowSelect,
    handleBulkAction,
    handleSelectAll,
    setSelectedRows,
    clearSelection
  }
}