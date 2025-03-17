import { GithubUser } from '~/types/Users'
import { PropsWithChildren } from 'react'
import styles from './ProfileInfo.module.css'
import { ExternalLinkIcon } from '~/common/components/Icons/ExternalLinkIcon'

function InfoItem({ children, icon, show = true }: PropsWithChildren<{ icon?: React.ReactNode, show?: boolean }>) {
  if (!children || !show) return;
  return (
    <div className={styles.infoItem}>
      <span className={styles.infoIcon}>{ icon }</span>
      <p>
        {children}
      </p>
    </div>

  )
}

interface ProfileInfoProps {
  user: GithubUser
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className={styles.info}>
      <h2 className={styles.infoHeader}>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className={styles.nameLink}>
          {user.login}
          <ExternalLinkIcon />
        </a>
      </h2>
      <InfoItem icon="👤">{user?.bio}</InfoItem>
      <InfoItem show={!!user?.company} icon="🛠️">Working at {user.company}</InfoItem>
      <InfoItem show={!!user?.followers} icon="👥">{ user.followers } followers</InfoItem >
      <InfoItem show={!!user?.created_at} icon="📅">Member since {new Date(user.created_at!).getFullYear()}</InfoItem>
    </div >
  )
} 