# AI Prompt: Legacy Component Testing

## Context

You are tasked with creating tests for legacy React components that may use outdated patterns, class components, or complex lifecycle methods.

## Instructions

When testing legacy components, focus on:

### 1. Class Component Testing
- Test lifecycle methods indirectly through behavior
- Mock complex dependencies
- Test state changes through user interactions

### 2. Legacy Pattern Handling
- Higher Order Components (HOCs)
- Render props patterns
- Legacy context API usage
- Mixed class and functional patterns

### 3. Integration Challenges
- External API calls in componentDidMount
- Complex state management
- Legacy routing patterns
- Outdated prop validation

## Template Prompt

```
Generate comprehensive tests for this legacy React component. The component may use outdated patterns but needs reliable test coverage.

Legacy Component:
[PASTE LEGACY COMPONENT CODE HERE]

Special considerations:
1. This component may use class-based patterns
2. Focus on testing behavior, not implementation details
3. Mock complex lifecycle dependencies
4. Test the component's external interface
5. Handle legacy state management patterns
6. Use case-insensitive assertions for text matching
7. Provide tests that work with both old and new React versions

Create tests that:
- Verify the component renders correctly
- Test user interactions end-to-end
- Mock external dependencies (APIs, timers, etc.)
- Handle legacy context or prop passing
- Test error boundaries if present
- Ensure accessibility compliance
```

## Example for Class Component

```typescript
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { LegacyComponent } from './LegacyComponent'

describe('LegacyComponent', () => {
  beforeEach(() => {
    // Mock timers or APIs
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('handles legacy lifecycle patterns', async () => {
    // Test componentDidMount effects
    const mockApi = vi.fn().mockResolvedValue({})
    global.fetch = mockApi

    render(<LegacyComponent />)
    
    await waitFor(() => {
      expect(mockApi).toHaveBeenCalled()
    })
  })
})
```