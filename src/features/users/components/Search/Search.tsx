import type React from "react"
import SearchIcon from "@/public/icons/SearchIcon.svg"
import { useQueryParam } from "~/common/hooks/useQueryParam"
import { useDebounce } from "~/common/hooks/useDebounce"
import { useEffect, useState } from "react"
import styles from './Search.module.css';

interface SearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function Search({ onSearch, placeholder = "Search..." }: SearchProps) {
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

