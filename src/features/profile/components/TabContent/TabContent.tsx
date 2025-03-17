import { GithubUser } from '~/types/Users'
import { FollowersList } from '../FollowersList'
import { FollowingList } from '../FollowingList'
import { RepositoriesList } from '../RepositoriesList'
import { useProfileTab } from '~/common/hooks/useProfileTab'

interface TabContentProps {
  user: GithubUser
}

export function TabContent({ user }: TabContentProps) {
  const [activeTab] = useProfileTab()

  switch (activeTab) {
    case 'followers':
      return <FollowersList username={user.login} />
    case 'repositories':
      return <RepositoriesList username={user.login} />
    case 'following':
      return <FollowingList username={user.login} />
    default:
      return null
  }
} 