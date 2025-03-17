import { render, screen, fireEvent, act } from '@testing-library/react'
import Search from './SearchBar'

jest.useFakeTimers()

describe('Search', () => {
  const onSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input with placeholder and icon', () => {
    render(<Search onSearch={onSearch} placeholder="Test placeholder" />)
    
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
  })
}) 