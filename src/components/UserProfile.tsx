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