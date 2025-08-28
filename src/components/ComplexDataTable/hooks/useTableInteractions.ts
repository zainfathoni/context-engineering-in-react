import { useState, useCallback, RefObject } from 'react'
import { DataItem, ContextMenuState, TableInteractionsState } from '../types'

interface KeyHandlers {
  onSelectAll?: () => void
  onClearSelection?: () => void
  onFocusSearch?: () => void
}

const createKeyHandler = (handlers: KeyHandlers) => (e: React.KeyboardEvent): void => {
  if (e.key === 'Escape') {
    if (handlers.onClearSelection) {
      handlers.onClearSelection()
    }
  }
  
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 'a':
        e.preventDefault()
        if (handlers.onSelectAll) {
          handlers.onSelectAll()
        }
        break
      case 'f':
        e.preventDefault()
        if (handlers.onFocusSearch) {
          handlers.onFocusSearch()
        }
        break
    }
  }
}

const createContextMenuHandler = (
  setContextMenu: (menu: ContextMenuState | null) => void
) => (e: React.MouseEvent, item: DataItem): void => {
  e.preventDefault()
  setContextMenu({ x: e.clientX, y: e.clientY, item })
}

const createDragHandlers = (
  setDraggedItem: (item: DataItem | null) => void
) => ({
  handleDragStart: (e: React.DragEvent, item: DataItem): void => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  },
  
  handleDragOver: (e: React.DragEvent): void => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  },
  
  handleDrop: (e: React.DragEvent, targetItem: DataItem, draggedItem: DataItem | null): void => {
    e.preventDefault()
    if (draggedItem && draggedItem.id !== targetItem.id) {
      console.log('Reordering:', draggedItem, 'to position of', targetItem)
    }
    setDraggedItem(null)
  }
})

interface UseTableInteractionsProps {
  onSelectAll?: () => void
  onClearSelection?: () => void
  searchInputRef?: RefObject<HTMLInputElement>
}

interface UseTableInteractionsReturn extends TableInteractionsState {
  setContextMenu: (menu: ContextMenuState | null) => void
  setDraggedItem: (item: DataItem | null) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  handleContextMenu: (e: React.MouseEvent, item: DataItem) => void
  handleDragStart: (e: React.DragEvent, item: DataItem) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent, targetItem: DataItem) => void
  clearContextMenu: () => void
}

export const useTableInteractions = ({
  onSelectAll,
  onClearSelection,
  searchInputRef
}: UseTableInteractionsProps): UseTableInteractionsReturn => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [draggedItem, setDraggedItem] = useState<DataItem | null>(null)

  const handleKeyDown = useCallback(
    createKeyHandler({
      onSelectAll,
      onClearSelection: () => {
        setContextMenu(null)
        if (onClearSelection) {
          onClearSelection()
        }
      },
      onFocusSearch: () => {
        searchInputRef?.current?.focus()
      }
    }),
    [onSelectAll, onClearSelection, searchInputRef]
  )

  const handleContextMenu = useCallback(
    createContextMenuHandler(setContextMenu),
    []
  )

  const dragHandlers = createDragHandlers(setDraggedItem)

  const handleDragStart = useCallback(dragHandlers.handleDragStart, [])
  const handleDragOver = useCallback(dragHandlers.handleDragOver, [])
  
  const handleDrop = useCallback(
    (e: React.DragEvent, targetItem: DataItem) => {
      dragHandlers.handleDrop(e, targetItem, draggedItem)
    },
    [draggedItem]
  )

  const clearContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  return {
    contextMenu,
    draggedItem,
    setContextMenu,
    setDraggedItem,
    handleKeyDown,
    handleContextMenu,
    handleDragStart,
    handleDragOver,
    handleDrop,
    clearContextMenu
  }
}