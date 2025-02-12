import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

export function useQueryParam(key: string) {
  const router = useRouter();
  const [value, setValue] = useState(() => router.query[key] as string || '')

  const setQueryParam = useCallback((newValue: string) => {
    setValue(newValue)
    const query = { ...router.query }
    
    if (newValue) {
      query[key] = newValue
    } else {
      delete query[key]
    }

    router.replace({ query }, undefined, { shallow: true })
  }, [router.query])

  return [value, setQueryParam] as const
} 