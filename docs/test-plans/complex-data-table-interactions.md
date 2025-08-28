# ComplexDataTable Component - Interaction Methods

## Overview

This document outlines the interaction methods tested for the ComplexDataTable component using Playwright MCP. These methods can be reused when refactoring this component to ensure all functionality remains intact.

## Navigation Setup

### Initial Setup

```javascript
// Navigate to the application
await page.goto('http://localhost:5173');

// Click on the ComplexDataTable component button
await page.getByRole('button', { name: 'Complex DataTable' }).click();
```

## Core Interaction Methods

### 1. Search Functionality

**Element Selectors:**

- Search input: `page.getByRole('textbox', { name: 'Search users' })`

**Test Methods:**

```javascript
// Test search functionality
await page.getByRole('textbox', { name: 'Search users' }).fill('John');
// Verify: Table should filter to show only matching users

// Clear search
await page.getByRole('textbox', { name: 'Search users' }).fill('');
// Verify: All users should be visible again
```

**Expected Behavior:**

- Search filters by name, email, and department (case insensitive)
- Results update with 300ms debounce
- Clearing search restores all data

### 2. Sorting Functionality

**Element Selectors:**

- Sort buttons: `page.getByRole('button', { name: 'Sort by [column]' })`
- Available columns: name, email, status, role, department, lastLogin

**Test Methods:**

```javascript
// Test column sorting
await page.getByRole('button', { name: 'Sort by email' }).click();
// Verify: Data sorted alphabetically by email, sort indicator (↑) appears

// Test reverse sorting
await page.getByRole('button', { name: 'Sort by email' }).click();
// Verify: Data sorted in reverse order, sort indicator (↓) appears
```

**Expected Behavior:**

- First click sorts ascending
- Second click sorts descending
- Sort indicator shows current sort direction
- Only one column can be sorted at a time

### 3. Row Selection and Bulk Actions

**Element Selectors:**

- Individual checkboxes: `page.getByRole('checkbox', { name: 'Select [username]' })`
- Select all checkbox: `page.getByRole('checkbox', { name: 'Select all rows' })`
- Bulk action buttons: `page.getByRole('button', { name: '[action]' })` (Activate, Deactivate, Delete)

**Test Methods:**

```javascript
// Select individual row
await page.getByRole('checkbox', { name: 'Select Bob Wilson' }).click();
// Verify: Row is selected, bulk actions appear, console logs selection

// Test bulk action
await page.getByRole('button', { name: 'Activate', exact: true }).click();
// Verify: Console logs bulk action with selected IDs

// Test select all
await page.getByRole('checkbox', { name: 'Select all rows' }).click();
// Verify: All visible rows selected

// Deselect row
await page.getByRole('checkbox', { name: 'Select Bob Wilson' }).click();
// Verify: Row deselected, bulk actions hidden if no selections
```

**Expected Behavior:**

- Bulk actions only appear when rows are selected
- Console logs row selections and bulk actions
- Select all toggles all visible rows
- Selection count is displayed

### 4. Status Filtering

**Element Selectors:**

- Filter dropdown: `page.getByLabel('Filter by status')`
- Filter options: 'All Status', 'Active', 'Inactive', 'Pending'

**Test Methods:**

```javascript
// Filter by status
await page.getByLabel('Filter by status').selectOption(['Active']);
// Verify: Only users with 'active' status are shown

// Reset filter
await page.getByLabel('Filter by status').selectOption(['All Status']);
// Verify: All users are shown again
```

**Expected Behavior:**

- Filters data by selected status
- 'All Status' shows all data
- Pagination resets to page 1 when filter changes

### 5. Keyboard Navigation

**Element Selectors:**

- Main table container (receives keyboard events)

**Test Methods:**

```javascript
// Test Ctrl+F for search focus
await page.keyboard.press('Control+f');
// Verify: Search input receives focus

// Test Escape key
await page.keyboard.press('Escape');
// Verify: Context menu closes, selections clear

// Test Ctrl+A for select all
await page.keyboard.press('Control+a');
// Verify: All rows selected (when table has focus)
```

**Expected Behavior:**

- Ctrl+F focuses search input
- Ctrl+A selects all rows
- Escape clears context menu and selections

### 6. Context Menu Interactions

**Element Selectors:**

- Any table cell to right-click on
- Context menu buttons: Edit, Delete, Duplicate

**Test Methods:**

```javascript
// Open context menu
await page.getByRole('cell', { name: 'Bob Wilson', exact: true }).click({ button: 'right' });
// Verify: Context menu appears at cursor position

// Test context menu action
await page.getByRole('button', { name: 'Edit' }).click();
// Verify: Console logs the action with user data

// Close context menu (click outside)
await page.click('body');
// Verify: Context menu disappears
```

**Expected Behavior:**

- Right-click on any row shows context menu
- Context menu shows Edit, Delete, Duplicate options
- Clicking options logs actions to console
- Menu closes when clicking outside or pressing Escape

### 7. Pagination (Note: Not visible with current test data)

**Element Selectors:**

- Pagination buttons: Previous, Next, numbered pages
- Only appears when data exceeds pageSize (default: 50)

**Test Methods:**

```javascript
// When pagination is available:
await page.getByRole('button', { name: 'Next' }).click();
// Verify: Navigate to next page

await page.getByRole('button', { name: '2' }).click();
// Verify: Jump to specific page

await page.getByRole('button', { name: 'Previous' }).click();
// Verify: Navigate to previous page
```

**Expected Behavior:**

- Shows when total items > pageSize
- Previous/Next buttons disable at boundaries
- Page numbers show current page
- Selection state resets when changing pages

## Component State Verification

### Visual Indicators

- **Selected rows**: Checkbox checked, row may have different styling
- **Sort indicators**: ↑ (ascending) or ↓ (descending) arrows
- **Active filters**: Selected option in dropdown
- **Bulk actions**: Appear when rows selected, show count
- **Context menu**: Positioned at cursor location

### Console Logging

- Row selections log user object
- Bulk actions log action name and selected IDs
- Context menu actions log action and user data

## Accessibility Features Tested

- All interactive elements have proper ARIA labels
- Keyboard navigation support
- Screen reader friendly element roles
- Focus management

## Performance Considerations

- Search has 300ms debounce
- Virtual scrolling available (prop: `virtualScrolling`)
- Real-time updates simulation (prop: `realTimeUpdates`)

## Integration Points

- `onRowSelect` callback for row selection
- `onBulkAction` callback for bulk operations
- Props control pagination size, virtual scrolling, real-time updates
