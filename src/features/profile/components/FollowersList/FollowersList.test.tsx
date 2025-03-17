import { render, screen, waitFor } from '@testing-library/react'
import { FollowersList } from './FollowersList'
import { getUserFollowers } from '~/services/githubClient'

jest.mock('~/services/githubClient')

const mockFollowers = [
  {
    id: 1,
    login: 'follower1',
    avatar_url: 'https://avatar1.url',
    node_id: 'node1',
    gravatar_id: '',
    url: 'https://api.github.com/users/follower1',
    html_url: 'https://github.com/follower1',
    followers_url: 'https://api.github.com/users/follower1/followers',
    following_url: 'https://api.github.com/users/follower1/following{/other_user}',
    gists_url: 'https://api.github.com/users/follower1/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/follower1/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/follower1/subscriptions',
    organizations_url: 'https://api.github.com/users/follower1/orgs',
    repos_url: 'https://api.github.com/users/follower1/repos',
    events_url: 'https://api.github.com/users/follower1/events{/privacy}',
    received_events_url: 'https://api.github.com/users/follower1/received_events',
    type: 'User',
    site_admin: false,
    user_view_type: 'PUBLIC'
  }
]

describe('FollowersList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    (getUserFollowers as jest.Mock).mockReturnValue(new Promise(() => {}))
    
    render(<FollowersList username="testuser" />)
    
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
  })

  it('renders followers list when data is loaded', async () => {
    (getUserFollowers as jest.Mock).mockResolvedValue(mockFollowers)
    
    render(<FollowersList username="testuser" />)
    
    await waitFor(() => {
      expect(screen.getByText('follower1')).toBeInTheDocument()
    })
    
    expect(getUserFollowers).toHaveBeenCalledWith('testuser')
  })

  it('shows error message when request fails', async () => {
    (getUserFollowers as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))
    
    render(<FollowersList username="testuser" />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load followers')).toBeInTheDocument()
    })
  })
}) 