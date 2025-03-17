import { getUserFollowers } from '~/services/githubClient'
import { UsersList } from '~/common/components/UsersList'
import { useUsersList } from '~/common/hooks/useUsersList'

interface FollowersListProps {
  username: string
}

export function FollowersList({ username }: FollowersListProps) {
  const { users, isLoading, error } = useUsersList({
    username,
    fetchUsers: getUserFollowers,
    errorMessage: 'Failed to load followers'
  })

  return (
    <UsersList
      users={users}
      isLoading={isLoading}
      error={error}
    />
  )
} 