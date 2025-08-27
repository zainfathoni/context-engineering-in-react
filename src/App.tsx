import { useState } from 'react'
import './App.css'

interface User {
  id: string
  name: string
  email: string
}

interface UserProfileProps {
  user: User
  onEdit: () => void
}

export const UserProfile = ({ user, onEdit }: UserProfileProps) => (
  <div className="user-profile">
    <h1>Welcome, {user.name}!</h1>
    <p>Email: {user.email}</p>
    <button onClick={onEdit} className="edit-button">
      Edit Profile
    </button>
  </div>
)

function App() {
  const [user] = useState<User>({
    id: '123',
    name: 'John Doe', 
    email: 'john@example.com'
  })

  const handleEdit = () => {
    alert('Edit profile clicked!')
  }

  return (
    <div className="app">
      <h1>Context Engineering in React Demo</h1>
      <UserProfile user={user} onEdit={handleEdit} />
    </div>
  )
}

export default App
