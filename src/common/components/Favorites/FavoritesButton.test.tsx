import { render, screen, fireEvent } from '@testing-library/react'
import { FavoriteButton } from './FavoritesButton'
import { useFavorites } from './hooks/useFavorites'

// Mock the useFavorites hook
jest.mock('./hooks/useFavorites')

describe('FavoriteButton', () => {
  const mockAddFavorite = jest.fn()
  const mockRemoveFavorite = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders unfavorited state correctly', () => {
    (useFavorites as jest.Mock).mockReturnValue({
      isFavorite: () => false,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite
    })

    render(<FavoriteButton username="testuser" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Add to favorites')
    expect(button).toHaveTextContent('☆')
  })

  it('renders favorited state correctly', () => {
    (useFavorites as jest.Mock).mockReturnValue({
      isFavorite: () => true,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite
    })

    render(<FavoriteButton username="testuser" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Remove from favorites')
    expect(button).toHaveTextContent('★')
  })

  it('calls addFavorite when clicking unfavorited button', () => {
    (useFavorites as jest.Mock).mockReturnValue({
      isFavorite: () => false,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite
    })

    render(<FavoriteButton username="testuser" />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockAddFavorite).toHaveBeenCalledWith('testuser')
  })

  it('calls removeFavorite when clicking favorited button', () => {
    (useFavorites as jest.Mock).mockReturnValue({
      isFavorite: () => true,
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite
    })

    render(<FavoriteButton username="testuser" />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockRemoveFavorite).toHaveBeenCalledWith('testuser')
  })
}) 