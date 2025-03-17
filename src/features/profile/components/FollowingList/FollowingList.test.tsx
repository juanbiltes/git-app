import { render, screen, waitFor } from '@testing-library/react'
import { FollowingList } from './FollowingList'
import { getUserFollowing } from '~/services/githubClient'

jest.mock('~/services/githubClient')

const mockUsers = [
  {
    id: 1,
    login: 'user1',
    avatar_url: 'https://example.com/avatar1.jpg',
    node_id: 'node1',
    gravatar_id: '',
    url: 'https://api.github.com/users/user1',
    html_url: 'https://github.com/user1',
    followers_url: 'https://api.github.com/users/user1/followers',
    following_url: 'https://api.github.com/users/user1/following{/other_user}',
    gists_url: 'https://api.github.com/users/user1/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/user1/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/user1/subscriptions',
    organizations_url: 'https://api.github.com/users/user1/orgs',
    repos_url: 'https://api.github.com/users/user1/repos',
    events_url: 'https://api.github.com/users/user1/events{/privacy}',
    received_events_url: 'https://api.github.com/users/user1/received_events',
    type: 'User',
    site_admin: false,
    user_view_type: 'PUBLIC'
  }
]

describe('FollowingList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    (getUserFollowing as jest.Mock).mockReturnValue(new Promise(() => {}))
    
    render(<FollowingList username="testuser" />)
    
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
  })

  it('renders following list when data is loaded', async () => {
    (getUserFollowing as jest.Mock).mockResolvedValue(mockUsers)
    
    render(<FollowingList username="testuser" />)
    
    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument()
    })
    
    expect(getUserFollowing).toHaveBeenCalledWith('testuser')
  })

  it('shows error message when request fails', async () => {
    (getUserFollowing as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))
    
    render(<FollowingList username="testuser" />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load following')).toBeInTheDocument()
    })
  })

  it('shows no following message when list is empty', async () => {
    (getUserFollowing as jest.Mock).mockResolvedValue([])
    
    render(<FollowingList username="testuser" />)
    
    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument()
    })
  })
}) 