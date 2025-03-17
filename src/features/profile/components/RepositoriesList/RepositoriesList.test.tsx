import { render, screen, waitFor } from '@testing-library/react'
import { RepositoriesList } from './RepositoriesList'
import { getUserRepositories } from '~/services/githubClient'

jest.mock('~/services/githubClient')

const mockRepositories = [
  {
    id: 1,
    name: 'repo1',
    full_name: 'user/repo1',
    html_url: 'https://github.com/user/repo1',
    description: 'First test repository',
    stargazers_count: 10,
    forks_count: 5,
    language: 'TypeScript'
  },
  {
    id: 2,
    name: 'repo2',
    full_name: 'user/repo2',
    html_url: 'https://github.com/user/repo2',
    description: 'Second test repository',
    stargazers_count: 20,
    forks_count: 8,
    language: 'JavaScript'
  }
]

describe('RepositoriesList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    (getUserRepositories as jest.Mock).mockReturnValue(new Promise(() => {}))
    
    render(<RepositoriesList username="testuser" />)
    
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
  })

  it('renders repositories list when data is loaded', async () => {
    (getUserRepositories as jest.Mock).mockResolvedValue(mockRepositories)
    
    render(<RepositoriesList username="testuser" />)
    
    await waitFor(() => {
      expect(screen.getByText('repo1')).toBeInTheDocument()
      expect(screen.getByText('repo2')).toBeInTheDocument()
    })
    
    expect(getUserRepositories).toHaveBeenCalledWith('testuser')

    // Check if repository details are rendered
    expect(screen.getByText('First test repository')).toBeInTheDocument()
    expect(screen.getByText('Second test repository')).toBeInTheDocument()
    expect(screen.getByText('⭐ 10')).toBeInTheDocument()
    expect(screen.getByText('⭐ 20')).toBeInTheDocument()
  })

  it('shows error message when request fails', async () => {
    (getUserRepositories as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))
    
    render(<RepositoriesList username="testuser" />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load repositories')).toBeInTheDocument()
    })
  })

  it('shows no repositories message when list is empty', async () => {
    (getUserRepositories as jest.Mock).mockResolvedValue([])
    
    render(<RepositoriesList username="testuser" />)
    
    await waitFor(() => {
      expect(screen.getByText('No items found')).toBeInTheDocument()
    })
  })
}) 