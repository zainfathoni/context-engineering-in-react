import { useState } from 'react'
import './App.css'
import LegacyUserDashboard from './components/LegacyUserDashboard.jsx'
import { ComplexDataTable } from './components/ComplexDataTable'
import { UserProfile } from './components/UserProfile'

interface User {
  id: string
  name: string
  email: string
}

// Mock data for ComplexDataTable
const mockTableData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active' as const,
    role: 'Admin',
    lastLogin: '2025-08-27',
    createdAt: '2025-01-15',
    department: 'Engineering'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'pending' as const,
    role: 'User',
    lastLogin: '2025-08-26',
    createdAt: '2025-02-10',
    department: 'Marketing'
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    status: 'inactive' as const,
    role: 'User',
    lastLogin: '2025-08-20',
    createdAt: '2025-03-05',
    department: 'Sales'
  }
]

type DemoView = 'basic' | 'legacy' | 'complex'

function App() {
  const [user] = useState<User>({
    id: '123',
    name: 'John Doe', 
    email: 'john@example.com'
  })

  const [currentDemo, setCurrentDemo] = useState<DemoView>('basic')

  const handleEdit = () => {
    alert('Edit profile clicked!')
  }

  const handleRowSelect = (item: any) => {
    console.log('Row selected:', item)
  }

  const handleBulkAction = (action: string, selectedIds: number[]) => {
    console.log('Bulk action:', action, selectedIds)
  }

  return (
    <div className="app">
      <h1>Context Engineering in React Demo</h1>
      
      <nav style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Demo Components:</h3>
        <button 
          onClick={() => setCurrentDemo('basic')}
          style={{ 
            margin: '0 10px', 
            padding: '8px 16px', 
            backgroundColor: currentDemo === 'basic' ? '#007bff' : '#f8f9fa',
            color: currentDemo === 'basic' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          1. Basic UserProfile
        </button>
        <button 
          onClick={() => setCurrentDemo('legacy')}
          style={{ 
            margin: '0 10px', 
            padding: '8px 16px', 
            backgroundColor: currentDemo === 'legacy' ? '#007bff' : '#f8f9fa',
            color: currentDemo === 'legacy' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          2. Legacy Dashboard
        </button>
        <button 
          onClick={() => setCurrentDemo('complex')}
          style={{ 
            margin: '0 10px', 
            padding: '8px 16px', 
            backgroundColor: currentDemo === 'complex' ? '#007bff' : '#f8f9fa',
            color: currentDemo === 'complex' ? 'white' : 'black',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          3. Complex DataTable
        </button>
      </nav>

      <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', minHeight: '400px' }}>
        {currentDemo === 'basic' && (
          <div>
            <h2>Basic Component Demo</h2>
            <UserProfile user={user} onEdit={handleEdit} />
          </div>
        )}
        
        {currentDemo === 'legacy' && (
          <div>
            <h2>Legacy Component Demo</h2>
            <LegacyUserDashboard userId="123" onPostSelect={handleRowSelect} />
          </div>
        )}
        
        {currentDemo === 'complex' && (
          <div>
            <h2>Complex Component Demo</h2>
            <ComplexDataTable 
              data={mockTableData}
              pageSize={10}
              onRowSelect={handleRowSelect}
              onBulkAction={handleBulkAction}
              virtualScrolling={false}
              realTimeUpdates={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
