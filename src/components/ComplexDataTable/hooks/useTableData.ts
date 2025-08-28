import { useState, useMemo, useCallback } from 'react'
import { debounce } from 'lodash-es'
import { DataItem, SortDirection, SortField, FilterStatus, TableDataState } from '../types'

const createSearchFilter = (searchTerm: string) => (item: DataItem): boolean => {
  if (!searchTerm) return true
  const term = searchTerm.toLowerCase()
  return (
    item.name.toLowerCase().includes(term) ||
    item.email.toLowerCase().includes(term) ||
    item.department.toLowerCase().includes(term)
  )
}

const createStatusFilter = (status: FilterStatus) => (item: DataItem): boolean => {
  return status === 'all' || item.status === status
}

const createSortComparator = (field: SortField) => (direction: SortDirection) => 
  (a: DataItem, b: DataItem): number => {
    const aVal = a[field]
    const bVal = b[field]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  }

interface UseTableDataProps {
  data: DataItem[]
  pageSize: number
}

interface UseTableDataReturn extends TableDataState {
  processedData: DataItem[]
  paginatedData: DataItem[]
  totalPages: number
  setSearchTerm: (term: string) => void
  setSortField: (field: SortField) => void
  setSortDirection: (direction: SortDirection) => void
  setFilterStatus: (status: FilterStatus) => void
  setCurrentPage: (page: number) => void
  handleSort: (field: SortField) => void
  debouncedSearch: (term: string) => void
}

export const useTableData = ({ data, pageSize }: UseTableDataProps): UseTableDataReturn => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
      setCurrentPage(1)
    }, 300),
    []
  )

  const processedData = useMemo(() => {
    let filtered = data

    // Apply filters with curried functions
    filtered = filtered
      .filter(createSearchFilter(searchTerm))
      .filter(createStatusFilter(filterStatus))

    // Apply sorting with curried comparator
    filtered.sort(createSortComparator(sortField)(sortDirection))

    return filtered
  }, [data, searchTerm, sortField, sortDirection, filterStatus])

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return processedData.slice(startIndex, startIndex + pageSize)
  }, [processedData, currentPage, pageSize])

  const totalPages = Math.ceil(processedData.length / pageSize)

  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField, sortDirection])

  return {
    searchTerm,
    sortField,
    sortDirection,
    filterStatus,
    currentPage,
    processedData,
    paginatedData,
    totalPages,
    setSearchTerm,
    setSortField,
    setSortDirection,
    setFilterStatus,
    setCurrentPage,
    handleSort,
    debouncedSearch
  }
}