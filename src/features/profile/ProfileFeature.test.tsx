import { render, screen } from '@testing-library/react'
import { ProfileFeature } from './ProfileFeature'
import { useFavorites } from '~/common/components/FavoritesButton/hooks/useFavorites'
import type { GithubUser } from '~/types/Users'
import { useRouter } from 'next/router'

// Mock the favorites hook
jest.mock('~/common/components/FavoritesButton/hooks/useFavorites')

// Mock the router differently
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

// Create mock router object
const mockRouter = {
  query: {},
  push: jest.fn(),
  pathname: '',
  route: '',
  asPath: '',
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  }
}

const mockUser: GithubUser = {
  id: 1,
  node_id: 'node1',
  login: 'testuser',
  avatar_url: 'https://avatar.url',
  gravatar_id: '',
  url: 'https://api.github.com/users/testuser',
  html_url: 'https://github.com/testuser',
  followers_url: 'https://api.github.com/users/testuser/followers',
  following_url: 'https://api.github.com/users/testuser/following{/other_user}',
  gists_url: 'https://api.github.com/users/testuser/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/testuser/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/testuser/subscriptions',
  organizations_url: 'https://api.github.com/users/testuser/orgs',
  repos_url: 'https://api.github.com/users/testuser/repos',
  events_url: 'https://api.github.com/users/testuser/events{/privacy}',
  received_events_url: 'https://api.github.com/users/testuser/received_events',
  type: 'User',
  site_admin: false,
  public_repos: 30,
  public_gists: 78,
  followers: 100,
  following: 173,
  created_at: '2020-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z',
  user_view_type: 'PUBLIC'
}

describe('ProfileFeature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Set up router mock for each test
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    
    // Set up favorites mock
    ;(useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      isFavorite: jest.fn().mockReturnValue(false),
      addFavorite: jest.fn(),
      removeFavorite: jest.fn()
    })
  })

  it('renders profile information correctly', () => {
    const userWithInfo = {
      ...mockUser,
      bio: 'Test bio',
      company: 'Test Company',
      created_at: '2020-01-02T00:00:00Z',
    }
    
    render(<ProfileFeature user={userWithInfo} />)

    // Check if main user information is displayed
    expect(screen.getByText(userWithInfo.login)).toBeInTheDocument()
    
    // Check bio and company info
    expect(screen.getByText(userWithInfo.bio)).toBeInTheDocument()
    expect(screen.getByText(`Working at ${userWithInfo.company}`)).toBeInTheDocument()
    
    // Check followers and member since info
    expect(screen.getByText(`${userWithInfo.followers} followers`)).toBeInTheDocument()
    expect(screen.getByText('Member since 2020')).toBeInTheDocument()

    // Check avatar
    const avatar = screen.getByRole('img', { name: `${userWithInfo.login}'s avatar` })
    expect(avatar).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(userWithInfo.avatar_url)))
  })

  it('renders profile links correctly', () => {
    render(<ProfileFeature user={mockUser} />)

    // Check profile links
    const followersLink = screen.getByRole('tab', { name: /followers/i })
    expect(followersLink).toBeInTheDocument()
    
    const reposLink = screen.getByRole('tab', { name: /repositories/i })
    expect(reposLink).toBeInTheDocument()
    
    const followingLink = screen.getByRole('tab', { name: /following/i })
    expect(followingLink).toBeInTheDocument()
  })

  it('renders profile tabs correctly', () => {
    // Update router query for this specific test
    mockRouter.query = { tab: 'repositories' }
    
    render(<ProfileFeature user={mockUser} />)

    const tabs = screen.getAllByRole('tab')
    const navigationTabs = tabs.filter(tab => 
      ['Followers', 'Repositories', 'Following'].includes(tab.textContent || '')
    )
    expect(navigationTabs).toHaveLength(3)
    
    expect(navigationTabs[0]).toHaveTextContent('Followers')
    expect(navigationTabs[1]).toHaveTextContent('Repositories')
    expect(navigationTabs[2]).toHaveTextContent('Following')
  })
}) 