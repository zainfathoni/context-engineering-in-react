import React, { useRef } from 'react'
import { ComplexDataTableProps } from './types'
import { useTableData, useTableSelection, useTableInteractions, useTableEffects } from './hooks'

export const ComplexDataTable: React.FC<ComplexDataTableProps> = ({
  data,
  pageSize = 50,
  onRowSelect,
  onBulkAction,
  virtualScrolling = false,
  realTimeUpdates = false
}) => {
  const tableRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Use custom hooks for state management
  const tableData = useTableData({ data, pageSize })
  const tableSelection = useTableSelection({ 
    onRowSelect, 
    onBulkAction, 
    paginatedData: tableData.paginatedData 
  })
  const tableInteractions = useTableInteractions({
    onSelectAll: tableSelection.handleSelectAll,
    onClearSelection: tableSelection.clearSelection,
    searchInputRef
  })
  const tableEffects = useTableEffects({
    realTimeUpdates,
    tableRef,
    onClearContextMenu: tableInteractions.clearContextMenu,
    onClearSelection: tableSelection.clearSelection
  })

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
    const start = Math.max(1, tableData.currentPage - Math.floor(maxVisiblePages / 2))
    const end = Math.min(tableData.totalPages, start + maxVisiblePages - 1)

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => tableData.setCurrentPage(i)}
          className={`pagination-button ${i === tableData.currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      )
    }

    return (
      <div className="pagination">
        <button
          onClick={() => tableData.setCurrentPage(Math.max(1, tableData.currentPage - 1))}
          disabled={tableData.currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => tableData.setCurrentPage(Math.min(tableData.totalPages, tableData.currentPage + 1))}
          disabled={tableData.currentPage === tableData.totalPages}
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
      onKeyDown={tableInteractions.handleKeyDown}
      tabIndex={0}
    >
      {/* Controls */}
      <div className="table-controls">
        <div className="search-section">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search users..."
            onChange={(e) => tableData.debouncedSearch(e.target.value)}
            className="search-input"
            aria-label="Search users"
          />
          
          <select
            value={tableData.filterStatus}
            onChange={(e) => tableData.setFilterStatus(e.target.value as any)}
            className="filter-select"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {tableSelection.selectedRows.size > 0 && (
          <div className="bulk-actions">
            <span>{tableSelection.selectedRows.size} selected</span>
            <button onClick={() => tableSelection.handleBulkAction('activate')}>
              Activate
            </button>
            <button onClick={() => tableSelection.handleBulkAction('deactivate')}>
              Deactivate
            </button>
            <button onClick={() => tableSelection.handleBulkAction('delete')}>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className={`table-wrapper ${tableEffects.isLoading ? 'loading' : ''}`}>
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={tableSelection.selectedRows.size === tableData.paginatedData.length && tableData.paginatedData.length > 0}
                  onChange={tableSelection.handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
              {['name', 'email', 'status', 'role', 'department', 'lastLogin'].map(field => (
                <th key={field}>
                  <button
                    onClick={() => tableData.handleSort(field as any)}
                    className="sort-button"
                    aria-label={`Sort by ${field}`}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {tableData.sortField === field && (
                      <span className="sort-indicator">
                        {tableData.sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.paginatedData.map((item) => (
              <tr
                key={item.id}
                className={tableSelection.selectedRows.has(item.id) ? 'selected' : ''}
                draggable
                onDragStart={(e) => tableInteractions.handleDragStart(e, item)}
                onDragOver={tableInteractions.handleDragOver}
                onDrop={(e) => tableInteractions.handleDrop(e, item)}
                onContextMenu={(e) => tableInteractions.handleContextMenu(e, item)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={tableSelection.selectedRows.has(item.id)}
                    onChange={() => tableSelection.handleRowSelect(item.id, item)}
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
      {tableData.totalPages > 1 && renderPagination()}

      {/* Context Menu */}
      {tableInteractions.contextMenu && (
        <div 
          className="context-menu"
          style={{ left: tableInteractions.contextMenu.x, top: tableInteractions.contextMenu.y }}
        >
          <button onClick={() => console.log('Edit', tableInteractions.contextMenu?.item)}>
            Edit
          </button>
          <button onClick={() => console.log('Delete', tableInteractions.contextMenu?.item)}>
            Delete
          </button>
          <button onClick={() => console.log('Duplicate', tableInteractions.contextMenu?.item)}>
            Duplicate
          </button>
        </div>
      )}

      {/* Loading overlay */}
      {tableEffects.isLoading && (
        <div className="loading-overlay">
          <div className="spinner">Loading...</div>
        </div>
      )}
    </div>
  )
}