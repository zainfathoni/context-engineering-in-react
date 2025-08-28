import { useState, useEffect, RefObject } from 'react'
import { TableEffectsState } from '../types'

interface UseTableEffectsProps {
  realTimeUpdates?: boolean
  tableRef?: RefObject<HTMLDivElement>
  onClearContextMenu?: () => void
  onClearSelection?: () => void
}

interface UseTableEffectsReturn extends TableEffectsState {
  setIsLoading: (loading: boolean) => void
}

export const useTableEffects = ({
  realTimeUpdates = false,
  tableRef,
  onClearContextMenu,
  onClearSelection
}: UseTableEffectsProps): UseTableEffectsReturn => {
  const [isLoading, setIsLoading] = useState(false)

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (onClearContextMenu) {
        onClearContextMenu()
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [onClearContextMenu])

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
      if (tableRef?.current && !tableRef.current.contains(e.target as Node)) {
        if (onClearSelection) {
          onClearSelection()
        }
      }
    }
    
    document.addEventListener('focusin', handleFocusIn)
    return () => document.removeEventListener('focusin', handleFocusIn)
  }, [tableRef, onClearSelection])

  return {
    isLoading,
    setIsLoading
  }
}