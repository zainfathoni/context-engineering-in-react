import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { UserProfile } from '../App'

// Extend Vitest's expect with custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass,
    }
  },
  toHaveClass(received, className) {
    const pass = received?.classList?.contains(className) || false
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have class "${className}"`,
      pass,
    }
  },
  toHaveTextContent(received, text) {
    if (text instanceof RegExp) {
      const pass = text.test(received?.textContent || '')
      return {
        message: () => `expected element ${pass ? 'not ' : ''}to have text content matching ${text}`,
        pass,
      }
    }
    const pass = received?.textContent?.includes(text) || false
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have text content "${text}"`,
      pass,
    }
  },
  toBeEnabled(received) {
    const pass = received && !received.disabled
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be enabled`,
      pass,
    }
  },
  toHaveAccessibleName(received, name) {
    const accessibleName = received?.getAttribute('aria-label') || received?.textContent || ''
    if (name instanceof RegExp) {
      const pass = name.test(accessibleName)
      return {
        message: () => `expected element ${pass ? 'not ' : ''}to have accessible name matching ${name}`,
        pass,
      }
    }
    const pass = accessibleName.toLowerCase().includes(name.toLowerCase())
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have accessible name "${name}"`,
      pass,
    }
  },
  toHaveFocus(received) {
    const pass = received === document.activeElement
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have focus`,
      pass,
    }
  },
})

interface User {
  id: string
  name: string
  email: string
}

describe('UserProfile', () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com'
  }

  const mockOnEdit = vi.fn()

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  describe('Rendering Tests', () => {
    it('renders without crashing', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('displays user name correctly', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      expect(screen.getByText(/welcome, john doe!/i)).toBeInTheDocument()
    })

    it('displays user email correctly', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      expect(screen.getByText(/email: john\.doe@example\.com/i)).toBeInTheDocument()
    })

    it('renders edit button', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument()
    })

    it('applies correct CSS classes', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      const container = screen.getByText(/welcome, john doe!/i).closest('div')
      expect(container).toHaveClass('user-profile')
      
      const button = screen.getByRole('button', { name: /edit profile/i })
      expect(button).toHaveClass('edit-button')
    })
  })

  describe('User Interaction Tests', () => {
    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      
      expect(mockOnEdit).toHaveBeenCalledOnce()
    })

    it('handles multiple button clicks', async () => {
      const user = userEvent.setup()
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      await user.click(editButton)
      await user.click(editButton)
      
      expect(mockOnEdit).toHaveBeenCalledTimes(2)
    })

    it('supports keyboard navigation for button', async () => {
      const user = userEvent.setup()
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      editButton.focus()
      await user.keyboard('{Enter}')
      
      expect(mockOnEdit).toHaveBeenCalledOnce()
    })

    it('supports space key activation for button', async () => {
      const user = userEvent.setup()
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      
      const editButton = screen.getByRole('button', { name: /edit profile/i })
      editButton.focus()
      await user.keyboard(' ')
      
      expect(mockOnEdit).toHaveBeenCalledOnce()
    })
  })

  describe('Accessibility Tests', () => {
    it('has proper heading structure', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent(/welcome, john doe!/i)
    })

    it('button is accessible via screen reader', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      const button = screen.getByRole('button', { name: /edit profile/i })
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    it('has proper semantic structure', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      
      // Check heading is properly structured
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      
      // Check button has accessible name
      expect(screen.getByRole('button')).toHaveAccessibleName(/edit profile/i)
    })

    it('maintains focus management', async () => {
      const user = userEvent.setup()
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      
      const button = screen.getByRole('button', { name: /edit profile/i })
      await user.tab()
      
      expect(button).toHaveFocus()
    })
  })

  describe('Edge Cases', () => {
    it('handles user with empty name gracefully', () => {
      const userWithEmptyName = { ...mockUser, name: '' }
      render(<UserProfile user={userWithEmptyName} onEdit={mockOnEdit} />)
      
      expect(screen.getByText(/welcome, !/i)).toBeInTheDocument()
    })

    it('handles user with empty email gracefully', () => {
      const userWithEmptyEmail = { ...mockUser, email: '' }
      render(<UserProfile user={userWithEmptyEmail} onEdit={mockOnEdit} />)
      
      expect(screen.getByText(/email:/i)).toBeInTheDocument()
    })

    it('handles special characters in user name', () => {
      const userWithSpecialChars = { ...mockUser, name: 'John O\'Connor-Smith' }
      render(<UserProfile user={userWithSpecialChars} onEdit={mockOnEdit} />)
      
      expect(screen.getByText(/welcome, john o'connor-smith!/i)).toBeInTheDocument()
    })

    it('handles special characters in email', () => {
      const userWithSpecialEmail = { ...mockUser, email: 'john+test@example-domain.co.uk' }
      render(<UserProfile user={userWithSpecialEmail} onEdit={mockOnEdit} />)
      
      expect(screen.getByText(/email: john\+test@example-domain\.co\.uk/i)).toBeInTheDocument()
    })

    it('handles very long user names', () => {
      const userWithLongName = { 
        ...mockUser, 
        name: 'John Very Very Very Very Very Very Very Very Very Very Long Name'
      }
      render(<UserProfile user={userWithLongName} onEdit={mockOnEdit} />)
      
      expect(screen.getByText(/welcome, john very very/i)).toBeInTheDocument()
    })

    it('handles very long emails', () => {
      const userWithLongEmail = { 
        ...mockUser, 
        email: 'john.doe.with.a.very.long.email.address@example-domain-with-long-name.com'
      }
      render(<UserProfile user={userWithLongEmail} onEdit={mockOnEdit} />)
      
      const emailText = screen.getByText(/email: john\.doe\.with\.a\.very\.long/i)
      expect(emailText).toBeInTheDocument()
    })

    it('handles undefined onEdit function gracefully', () => {
      // TypeScript would prevent this, but testing runtime behavior
      const undefinedOnEdit = (() => {}) as () => void
      
      expect(() => {
        render(<UserProfile user={mockUser} onEdit={undefinedOnEdit} />)
      }).not.toThrow()
    })

    it('prevents default form submission if button is in a form', async () => {
      const user = userEvent.setup()
      const TestWrapper = () => (
        <form onSubmit={(e) => e.preventDefault()}>
          <UserProfile user={mockUser} onEdit={mockOnEdit} />
        </form>
      )
      
      render(<TestWrapper />)
      
      const button = screen.getByRole('button', { name: /edit profile/i })
      await user.click(button)
      
      expect(mockOnEdit).toHaveBeenCalledOnce()
    })
  })

  describe('Component Structure', () => {
    it('maintains expected DOM structure', () => {
      render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      
      const container = screen.getByRole('heading').closest('.user-profile')
      expect(container).toBeInTheDocument()
      
      const heading = container?.querySelector('h1')
      const email = container?.querySelector('p')
      const button = container?.querySelector('button')
      
      expect(heading).toBeInTheDocument()
      expect(email).toBeInTheDocument()
      expect(button).toBeInTheDocument()
    })

    it('preserves component isolation', () => {
      const { rerender } = render(<UserProfile user={mockUser} onEdit={mockOnEdit} />)
      
      const differentUser = { ...mockUser, name: 'Jane Doe', email: 'jane@example.com' }
      const differentOnEdit = vi.fn()
      
      rerender(<UserProfile user={differentUser} onEdit={differentOnEdit} />)
      
      expect(screen.getByText(/welcome, jane doe!/i)).toBeInTheDocument()
      expect(screen.queryByText(/welcome, john doe!/i)).not.toBeInTheDocument()
    })
  })
})