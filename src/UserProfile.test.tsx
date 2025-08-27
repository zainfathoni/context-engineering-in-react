import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { UserProfile } from './App'

describe('UserProfile', () => {
  const mockUser = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com'
  }

  afterEach(() => {
    cleanup()
  })

  it('renders user name and email', () => {
    const mockOnEdit = vi.fn()
    render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
    
    expect(screen.getByText(/welcome, john doe!/i)).toBeInTheDocument()
    expect(screen.getByText(/email: john@example.com/i)).toBeInTheDocument()
  })

  it('calls onEdit when edit button is clicked', async () => {
    const mockOnEdit = vi.fn()
    render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
    
    const editButton = screen.getByRole('button', { name: /edit profile/i })
    await userEvent.click(editButton)
    
    expect(mockOnEdit).toHaveBeenCalledOnce()
  })

  it('has accessible button', () => {
    const mockOnEdit = vi.fn()
    render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
    
    const editButton = screen.getByRole('button', { name: /edit profile/i })
    expect(editButton).toBeInTheDocument()
    expect(editButton).toBeEnabled()
  })
})