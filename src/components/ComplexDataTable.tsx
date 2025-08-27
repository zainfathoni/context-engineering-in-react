import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { debounce } from 'lodash-es'

interface DataItem {
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

interface ComplexDataTableProps {
  data: DataItem[]
  pageSize?: number
  onRowSelect?: (item: DataItem) => void
  onBulkAction?: (action: string, selectedIds: number[]) => void
  virtualScrolling?: boolean
  realTimeUpdates?: boolean
}

export const ComplexDataTable: React.FC<ComplexDataTableProps> = ({
  data,
  pageSize = 50,
  onRowSelect,
  onBulkAction,
  virtualScrolling = false,
  realTimeUpdates = false
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof DataItem>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [draggedItem, setDraggedItem] = useState<DataItem | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: DataItem } | null>(null)
  
  const tableRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounced search to improve performance
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term)
      setCurrentPage(1)
    }, 300),
    []
  )

  // Complex filtering and sorting logic
  const processedData = useMemo(() => {
    let filtered = data

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [data, searchTerm, sortField, sortDirection, filterStatus])

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return processedData.slice(startIndex, startIndex + pageSize)
  }, [processedData, currentPage, pageSize])

  const totalPages = Math.ceil(processedData.length / pageSize)

  // Handle sorting
  const handleSort = (field: keyof DataItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Handle row selection
  const handleRowSelect = (id: number, item: DataItem) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedRows(newSelected)
    
    if (onRowSelect) {
      onRowSelect(item)
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id)))
    }
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    if (onBulkAction && selectedRows.size > 0) {
      onBulkAction(action, Array.from(selectedRows))
    }
  }

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, item: DataItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetItem: DataItem) => {
    e.preventDefault()
    if (draggedItem && draggedItem.id !== targetItem.id) {
      // Handle reordering logic here
      console.log('Reordering:', draggedItem, 'to position of', targetItem)
    }
    setDraggedItem(null)
  }

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, item: DataItem) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, item })
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setContextMenu(null)
      setSelectedRows(new Set())
    }
    
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'a':
          e.preventDefault()
          handleSelectAll()
          break
        case 'f':
          e.preventDefault()
          searchInputRef.current?.focus()
          break
      }
    }
  }

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (realTimeUpdates) {
      const interval = setInterval(() => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 500)
      }, 10000)
      
      return () => clearInterval(interval)
    }
  }, [realTimeUpdates])

  // Focus management
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (tableRef.current && !tableRef.current.contains(e.target as Node)) {
        setSelectedRows(new Set())
      }
    }
    
    document.addEventListener('focusin', handleFocusIn)
    return () => document.removeEventListener('focusin', handleFocusIn)
  }, [])

  const renderStatusBadge = (status: string) => {
    const statusColors = {
      active: '#28a745',
      inactive: '#dc3545',
      pending: '#ffc107'
    }
    
    return (
      <span 
        className="status-badge" 
        style={{ 
          backgroundColor: statusColors[status as keyof typeof statusColors],
          color: status === 'pending' ? '#000' : '#fff',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px'
        }}
      >
        {status}
      </span>
    )
  }

  const renderPagination = () => {
    const pages = []
    const maxVisiblePages = 5
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const end = Math.min(totalPages, start + maxVisiblePages - 1)

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )
  }

  return (
    <div 
      className="complex-data-table"
      ref={tableRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Controls */}
      <div className="table-controls">
        <div className="search-section">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search users..."
            onChange={(e) => debouncedSearch(e.target.value)}
            className="search-input"
            aria-label="Search users"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {selectedRows.size > 0 && (
          <div className="bulk-actions">
            <span>{selectedRows.size} selected</span>
            <button onClick={() => handleBulkAction('activate')}>
              Activate
            </button>
            <button onClick={() => handleBulkAction('deactivate')}>
              Deactivate
            </button>
            <button onClick={() => handleBulkAction('delete')}>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className={`table-wrapper ${isLoading ? 'loading' : ''}`}>
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
              {['name', 'email', 'status', 'role', 'department', 'lastLogin'].map(field => (
                <th key={field}>
                  <button
                    onClick={() => handleSort(field as keyof DataItem)}
                    className="sort-button"
                    aria-label={`Sort by ${field}`}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (
                      <span className="sort-indicator">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className={selectedRows.has(item.id) ? 'selected' : ''}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item)}
                onContextMenu={(e) => handleContextMenu(e, item)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(item.id)}
                    onChange={() => handleRowSelect(item.id, item)}
                    aria-label={`Select ${item.name}`}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{renderStatusBadge(item.status)}</td>
                <td>{item.role}</td>
                <td>{item.department}</td>
                <td>{new Date(item.lastLogin).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && renderPagination()}

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button onClick={() => console.log('Edit', contextMenu.item)}>
            Edit
          </button>
          <button onClick={() => console.log('Delete', contextMenu.item)}>
            Delete
          </button>
          <button onClick={() => console.log('Duplicate', contextMenu.item)}>
            Duplicate
          </button>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner">Loading...</div>
        </div>
      )}
    </div>
  )
}