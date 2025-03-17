import LoadingState from '~/common/components/LoadingState'
import styles from './ItemsList.module.css'

interface ItemsListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  isLoading?: boolean
  error?: string | null
}

export function ItemsList<T>({ items, renderItem, isLoading, error }: ItemsListProps<T>) {
  if (isLoading) {
    return <LoadingState />
  }
  if (error) return <div>{error}</div>
  if (!items.length) return <div>No items found</div>

  return (
    <ul className={styles.list}>
      {items.map((item, index) => (
        <li key={index} className={styles.item}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
} 