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

## Implementation Results

### UserProfile Component Testing - ✅ COMPLETED

**Component Tested:** `UserProfile` from `src/App.tsx` (lines 17-25)  
**Test File:** `src/components/UserProfile.test.tsx`  
**Status:** All 23 tests passing ✅

#### Test Coverage Achieved:

**✅ 1. Rendering Tests (5 tests)**
- Component renders without crashing
- User name displayed correctly with case-insensitive regex
- User email displayed correctly with case-insensitive regex  
- Edit button renders properly
- CSS classes applied correctly (`user-profile`, `edit-button`)

**✅ 2. User Interaction Tests (4 tests)**
- Edit button click triggers `onEdit` handler
- Multiple button clicks handled correctly
- Keyboard navigation with Enter key
- Keyboard navigation with Space key

**✅ 3. Accessibility Tests (4 tests)**
- Proper heading structure (h1 element)
- Button accessible via screen reader
- Semantic structure with proper roles
- Focus management and tab navigation

**✅ 4. Edge Cases (8 tests)**
- Empty user name handling
- Empty user email handling
- Special characters in name (O'Connor-Smith)
- Special characters in email (+, -, .)
- Very long user names
- Very long email addresses
- Undefined onEdit function handling
- Form submission prevention

**✅ 5. Component Structure (2 tests)**
- DOM structure validation
- Component isolation and prop updates

#### Technical Implementation:

**Custom Vitest Matchers Created:**
- `toBeInTheDocument()` - Element existence validation
- `toHaveClass()` - CSS class verification
- `toHaveTextContent()` - Text content matching (supports regex)
- `toBeEnabled()` - Button state validation
- `toHaveAccessibleName()` - Accessibility name checking (supports regex)
- `toHaveFocus()` - Focus state verification

**Key Features:**
- All assertions use case-insensitive regex as required
- Proper cleanup with `afterEach(() => cleanup())`
- Mock functions with `vi.fn()` and `vi.clearAllMocks()`
- User event testing with `@testing-library/user-event`
- Browser mode compatibility with Vitest + Playwright

#### Component Ready for Extraction

The UserProfile component is now fully tested and can be safely extracted to `src/components/UserProfile.tsx` with confidence that all functionality will work as expected.

### ✅ EXTRACTION COMPLETED

**Date:** 2025-08-28  
**Status:** Successfully extracted and verified

#### Extraction Steps Completed

1. **Component Extraction**
   - ✅ Moved UserProfile component from `src/App.tsx` to `src/components/UserProfile.tsx`
   - ✅ Included User interface and UserProfileProps interface in new file
   - ✅ Maintained exact same component structure and functionality

2. **Import Updates**
   - ✅ Added import in `src/App.tsx`: `import { UserProfile } from './components/UserProfile'`
   - ✅ Removed component definition from App.tsx (lines 17-25)
   - ✅ Updated test imports from `'../App'` to `'./UserProfile'`

3. **Test Verification**
   - ✅ All 23 tests continue to pass with no regressions
   - ✅ Removed duplicate test file from src root directory
   - ✅ Test file remains at `src/components/UserProfile.test.tsx`

4. **Final Verification**
   - ✅ Component renders correctly in browser
   - ✅ All interactions work as expected
   - ✅ CSS classes and styling preserved
   - ✅ TypeScript compilation successful for component

#### Post-Extraction Status

- **Component Location:** `src/components/UserProfile.tsx`
- **Test Location:** `src/components/UserProfile.test.tsx`  
- **Test Coverage:** 23/23 tests passing ✅
- **Functionality:** Fully preserved, no regressions
- **Ready for:** Further development, refactoring, or additional feature work
