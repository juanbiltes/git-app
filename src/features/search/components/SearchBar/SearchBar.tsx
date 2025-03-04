import type React from "react"
import { SearchIcon } from "~/common/components/Icons/SearchIcon"
import { useQueryParam } from "~/common/hooks/useQueryParam"
import { useDebounce } from "~/common/hooks/useDebounce"
import { useEffect, useState } from "react"
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = "Search..." }: SearchBarProps) {
  const [queryParam, setQueryParam] = useQueryParam('search')
  const [query, setQuery] = useState(queryParam)
  const debouncedQuery = useDebounce(query, 300)
  
  useEffect(() => {
    onSearch(debouncedQuery)
    setQueryParam(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
      />
      <span className={styles.searchIcon}>
        <SearchIcon />
      </span>
    </div>
  )
}

