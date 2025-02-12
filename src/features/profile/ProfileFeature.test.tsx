import { render, screen, within } from '@testing-library/react'
import ProfileFeature from './ProfileFeature'
import { useFavorites } from '~/common/components/Favorites/hooks/useFavorites'
import type { GithubUser } from '~/types/Users'

// Mock the favorites hook
jest.mock('~/common/components/Favorites/hooks/useFavorites')

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
    jest.clearAllMocks();
    
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      isFavorite: jest.fn().mockReturnValue(false),
      addFavorite: jest.fn(),
      removeFavorite: jest.fn()
    });
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
    expect(screen.getByRole('heading', { name: userWithInfo.login })).toBeInTheDocument()
    
    // Check bio and company info
    expect(screen.getByText(userWithInfo.bio)).toBeInTheDocument()
    expect(screen.getByText(`Working at ${userWithInfo.company}`)).toBeInTheDocument()
    
    // Check followers and member since info
    expect(screen.getByText(`${userWithInfo.followers} followers`)).toBeInTheDocument()
    expect(screen.getByText('Member since: 2020')).toBeInTheDocument()

    // Check GitHub profile link
    const githubLink = screen.getByRole('link', { name: /view github profile/i })
    expect(githubLink).toHaveAttribute('href', userWithInfo.html_url)

    // Check avatar - using Next.js Image component URL format
    const avatar = screen.getByRole('img', { name: `${userWithInfo.login}'s avatar` })
    expect(avatar).toHaveAttribute('src', expect.stringContaining(encodeURIComponent(userWithInfo.avatar_url)))
  })

  it('renders profile links correctly', () => {
    render(<ProfileFeature  user={mockUser} />)

    // Check profile links
    const followersLink = screen.getByRole('link', { name: /followers/i })
    expect(followersLink).toHaveAttribute('href', mockUser.followers_url)
    
    const reposLink = screen.getByRole('link', { name: /repositories/i })
    expect(reposLink).toHaveAttribute('href', mockUser.repos_url)
    
    const gistsLink = screen.getByRole('link', { name: /gists/i })
    expect(gistsLink).toHaveAttribute('href', mockUser.gists_url)
  })

  it('integrates with favorites functionality', () => {
    const mockAddFavorite = jest.fn();
    const mockRemoveFavorite = jest.fn();
    
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      isFavorite: jest.fn().mockReturnValue(false),
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite
    })

    const { rerender } = render(<ProfileFeature user={mockUser} />)

    // Check unfavorited state
    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    expect(favoriteButton).toHaveTextContent('☆');

    // Setup favorites mock for favorited state
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      isFavorite: jest.fn().mockReturnValue(true),
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite
    })

    // Rerender with new favorites state
    rerender(<ProfileFeature user={mockUser} />)

    // Check favorited state
    expect(favoriteButton).toHaveTextContent('★')
    expect(favoriteButton).toHaveAttribute('aria-label', 'Remove from favorites')
  })

  it('handles missing optional user information gracefully', () => {
    render(<ProfileFeature user={mockUser} />)

    // Optional fields should not be present
    expect(screen.queryByText('Test bio')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Company')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /website/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /twitter/i })).not.toBeInTheDocument()
  })
}) 