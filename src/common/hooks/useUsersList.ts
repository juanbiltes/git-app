import { useState, useEffect } from 'react'
import { GithubUser } from '~/types/Users'

interface UseUsersListOptions {
  username: string
  fetchUsers: (username: string) => Promise<GithubUser[]>
  errorMessage?: string
}

export function useUsersList({ 
  username, 
  fetchUsers, 
  errorMessage = 'Failed to load users' 
}: UseUsersListOptions) {
  const [users, setUsers] = useState<GithubUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUsers(username)
        setUsers(data)
      } catch (error) {
        console.log(error);
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [username, fetchUsers, errorMessage])

  return { users, isLoading, error }
} 