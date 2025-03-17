import { getUserFollowing } from '~/services/githubClient'
import { UsersList } from '~/common/components/UsersList'
import { useUsersList } from '~/common/hooks/useUsersList'

interface FollowingListProps {
  username: string
}

export function FollowingList({ username }: FollowingListProps) {
  const { users, isLoading, error } = useUsersList({
    username,
    fetchUsers: getUserFollowing,
    errorMessage: 'Failed to load following'
  })

  return (
    <UsersList
      users={users}
      isLoading={isLoading}
      error={error}
    />
  )
} 