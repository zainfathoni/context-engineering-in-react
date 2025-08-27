# AI Prompt: Basic Component Testing

## Context

You are an expert React testing engineer. Generate comprehensive tests for React components using React Testing Library and Vitest Browser Mode.

## Instructions

When given a React component, create tests that cover:

### 1. Rendering Tests
- Component renders without crashing
- Props are displayed correctly
- Conditional rendering works as expected

### 2. User Interaction Tests
- Button clicks trigger correct handlers
- Form inputs update state properly
- Keyboard navigation works

### 3. Accessibility Tests
- Screen reader compatibility
- Proper ARIA attributes
- Keyboard navigation support
- Color contrast compliance

### 4. Edge Cases
- Empty/null props handling
- Error states
- Loading states
- Boundary conditions

## Template Prompt

```
Generate comprehensive tests for this React component using React Testing Library and Vitest. 

Component to test:
[PASTE COMPONENT CODE HERE]

Requirements:
1. Use React Testing Library best practices
2. Include user interaction tests with @testing-library/user-event
3. Test accessibility with screen reader queries
4. Cover edge cases and error states
5. Use case-insensitive regex assertions: expect(screen.getByText(/welcome/i))
6. Include proper cleanup with afterEach(() => cleanup())
7. Mock external dependencies with vi.fn()
8. Test keyboard navigation where applicable

Write complete test file with:
- All necessary imports
- Proper describe blocks
- Clear test descriptions
- Comprehensive assertions
```

## Example Output

The AI should generate tests similar to:

```typescript
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with required props', () => {
    // Test implementation
  })

  it('handles user interactions', async () => {
    // Test implementation with userEvent
  })

  it('is accessible', () => {
    // Accessibility tests
  })
})
```