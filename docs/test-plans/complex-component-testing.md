# AI Prompt: Complex Component Testing

## Context

You are testing complex React components with multiple responsibilities, intricate state management, and various user interaction patterns.

## Instructions

For complex components, create comprehensive test suites covering:

### 1. Multi-State Components

- Components with complex state machines
- Multiple interdependent state variables
- Async state updates
- State persistence

### 2. Heavy User Interaction

- Multi-step workflows
- Drag and drop functionality
- Complex form validation
- Real-time features

### 3. Integration Patterns

- Context providers and consumers
- Custom hooks integration
- Third-party library integration
- External API dependencies

### 4. Performance Considerations

- Large data sets
- Virtual scrolling
- Memoization testing
- Re-render optimization

## Template Prompt

```
Generate comprehensive tests for this complex React component that has multiple responsibilities and intricate user interactions.

Complex Component:
[PASTE COMPLEX COMPONENT CODE HERE]

This component requires advanced testing strategies:

1. **State Management Testing**
   - Test complex state transitions
   - Verify state consistency across re-renders
   - Handle async state updates properly

2. **User Interaction Flows**
   - Multi-step user workflows
   - Complex form interactions
   - Error handling and validation
   - Loading states and transitions

3. **Integration Testing**
   - Context providers and consumers
   - Custom hooks behavior
   - External API integration
   - Third-party library interactions

4. **Performance Testing**
   - Large data set handling
   - Re-render optimization verification
   - Memory leak prevention

5. **Accessibility at Scale**
   - Complex navigation patterns
   - Screen reader announcements
   - Keyboard shortcuts
   - Focus management

Requirements:
- Use React Testing Library with browser testing
- Mock external dependencies appropriately
- Test error boundaries and fallbacks
- Include performance assertions where applicable
- Use case-insensitive text matching
- Test both happy path and edge cases
- Include comprehensive cleanup
```

## Example for Complex Component

```typescript
import { render, screen, cleanup, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { ComplexComponent } from './ComplexComponent'
import { TestProvider } from '../test-utils/TestProvider'

describe('ComplexComponent', () => {
  const mockData = Array.from({ length: 1000 }, (_, i) => ({ 
    id: i, 
    name: `Item ${i}` 
  }))

  beforeEach(() => {
    vi.useFakeTimers()
    global.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('handles complex multi-step workflow', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    
    render(
      <TestProvider>
        <ComplexComponent data={mockData} />
      </TestProvider>
    )

    // Step 1: Initial load
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    vi.advanceTimersByTime(1000)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    // Step 2: User interaction
    const searchInput = screen.getByLabelText(/search/i)
    await user.type(searchInput, 'Item 5')
    
    // Step 3: Verify results
    await waitFor(() => {
      expect(screen.getByText(/item 5/i)).toBeInTheDocument()
    })
  })

  it('maintains performance with large datasets', async () => {
    const renderStart = performance.now()
    
    render(
      <TestProvider>
        <ComplexComponent data={mockData} />
      </TestProvider>
    )
    
    const renderTime = performance.now() - renderStart
    expect(renderTime).toBeLessThan(100) // Render should complete in <100ms
  })
})
```