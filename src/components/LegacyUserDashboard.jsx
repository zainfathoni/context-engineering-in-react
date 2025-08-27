import React, { Component } from 'react'

class LegacyUserDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      posts: [],
      loading: true,
      error: null,
      selectedPost: null
    }
    this.handlePostSelect = this.handlePostSelect.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount() {
    this.fetchUserData()
    this.timer = setInterval(this.fetchUserData.bind(this), 30000)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUserData()
    }
  }

  fetchUserData = async () => {
    try {
      this.setState({ loading: true, error: null })
      
      const [userResponse, postsResponse] = await Promise.all([
        fetch(`/api/users/${this.props.userId}`),
        fetch(`/api/users/${this.props.userId}/posts`)
      ])
      
      if (!userResponse.ok || !postsResponse.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const user = await userResponse.json()
      const posts = await postsResponse.json()
      
      this.setState({
        user,
        posts,
        loading: false
      })
    } catch (error) {
      this.setState({
        error: error.message,
        loading: false
      })
    }
  }

  handlePostSelect(postId) {
    const selectedPost = this.state.posts.find(post => post.id === postId)
    this.setState({ selectedPost })
    
    if (this.props.onPostSelect) {
      this.props.onPostSelect(selectedPost)
    }
  }

  handleRefresh() {
    this.fetchUserData()
  }

  renderError() {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{this.state.error}</p>
        <button onClick={this.handleRefresh} className="retry-button">
          Try Again
        </button>
      </div>
    )
  }

  renderLoading() {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading user dashboard...</p>
      </div>
    )
  }

  renderUserInfo() {
    const { user } = this.state
    if (!user) return null

    return (
      <div className="user-info">
        <img src={user.avatar} alt={`${user.name}'s avatar`} className="avatar" />
        <div className="user-details">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p>Member since: {new Date(user.joinDate).toLocaleDateString()}</p>
          <p>Posts: {this.state.posts.length}</p>
        </div>
      </div>
    )
  }

  renderPosts() {
    const { posts, selectedPost } = this.state

    return (
      <div className="posts-section">
        <h2>Recent Posts</h2>
        <div className="posts-list">
          {posts.map(post => (
            <div
              key={post.id}
              className={`post-item ${selectedPost?.id === post.id ? 'selected' : ''}`}
              onClick={() => this.handlePostSelect(post.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  this.handlePostSelect(post.id)
                }
              }}
            >
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
        
        {selectedPost && (
          <div className="post-preview">
            <h3>{selectedPost.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
          </div>
        )}
      </div>
    )
  }

  render() {
    const { loading, error } = this.state

    if (loading) {
      return this.renderLoading()
    }

    if (error) {
      return this.renderError()
    }

    return (
      <div className="legacy-user-dashboard">
        <header className="dashboard-header">
          <h1>User Dashboard</h1>
          <button onClick={this.handleRefresh} className="refresh-button">
            Refresh
          </button>
        </header>
        
        {this.renderUserInfo()}
        {this.renderPosts()}
      </div>
    )
  }
}

LegacyUserDashboard.defaultProps = {
  userId: null,
  onPostSelect: null
}

export default LegacyUserDashboard