import { render, screen } from '@testing-library/react'
import { ItemsList } from './ItemsList'

describe('ItemsList', () => {
  const mockItems = ['item1', 'item2', 'item3']
  const renderItem = (item: string) => <div>{item}</div>

  it('renders list of items', () => {
    render(<ItemsList items={mockItems} renderItem={renderItem} />)

    mockItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument()
    })
  })

  it('shows loading state', () => {
    render(<ItemsList items={[]} renderItem={renderItem} isLoading={true} />)
    
    expect(screen.getByLabelText('Loading...')).toBeInTheDocument()
  })

  it('shows error message', () => {
    const errorMessage = 'Test error'
    render(<ItemsList items={[]} renderItem={renderItem} error={errorMessage} />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('shows empty state message', () => {
    render(<ItemsList items={[]} renderItem={renderItem} />)
    
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })
}) 