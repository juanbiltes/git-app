import { GithubUser } from '~/types/Users'
import styles from './ProfileFeature.module.css'
import { ProfileInfo, ProfileLinks, ProfileCard } from './components'
import { UserAvatar } from '~/common/components/UserAvatar'

interface ProfileProps {
  user: GithubUser
}

export default function Profile({ user }: ProfileProps) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <ProfileCard>
          <UserAvatar username={user.login} src={user.avatar_url} />
          <ProfileInfo user={user} />
        </ProfileCard>
        <ProfileLinks user={user} />
      </main>
    </div>
  )
}