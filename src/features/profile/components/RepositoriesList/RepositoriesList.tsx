import { useState, useEffect } from 'react'
import { GithubRepository } from '~/types/Repository'
import { getUserRepositories } from '~/services/githubClient'
import { ItemsList } from '~/common/components/ItemsList'
import { RepositoryItem } from '~/features/profile/components/RepositoryItem/RepositoryItem'

interface RepositoriesListProps {
  username: string
}

export function RepositoriesList({ username }: RepositoriesListProps) {
  const [repositories, setRepositories] = useState<GithubRepository[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRepositories() {
      try {
        const data = await getUserRepositories(username)
        setRepositories(data)
      } catch (e) {
        console.log(e);
        setError('Failed to load repositories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepositories()
  }, [username])

  return (
    <ItemsList
      items={repositories}
      renderItem={(repository) => <RepositoryItem repository={repository} />}
      isLoading={isLoading}
      error={error}
    />
  )
} 