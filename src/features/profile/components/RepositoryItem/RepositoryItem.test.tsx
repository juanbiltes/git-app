import { render, screen } from '@testing-library/react'
import { RepositoryItem } from './RepositoryItem'
import { GithubRepository } from '~/types/Repository'

describe('RepositoryItem', () => {
  const mockRepository: GithubRepository = {
    id: 1,
    name: 'test-repo',
    full_name: 'user/test-repo',
    html_url: 'https://github.com/user/test-repo',
    description: 'Test repository description',
    stargazers_count: 10,
    forks_count: 5,
    language: 'TypeScript'
  }

  it('renders repository information correctly', () => {
    render(<RepositoryItem repository={mockRepository} />)

    // Check name
    expect(screen.getByText(mockRepository.name)).toBeInTheDocument()

    // Check description
    expect(screen.getByText(mockRepository.description!)).toBeInTheDocument()

    // Check stats
    expect(screen.getByText('⭐ 10')).toBeInTheDocument()
    expect(screen.getByText('🍴 5')).toBeInTheDocument()

    // Check link
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', mockRepository.html_url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('handles missing description', () => {
    const repoWithoutDescription = {
      ...mockRepository,
      description: null
    }

    render(<RepositoryItem repository={repoWithoutDescription} />)

    // Description should not be rendered
    expect(screen.queryByText('Test repository description')).not.toBeInTheDocument()
  })
}) 