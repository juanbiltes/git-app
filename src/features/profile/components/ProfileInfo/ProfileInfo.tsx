import { GithubUser } from '~/types/Users'
import { PropsWithChildren } from 'react'
import FavoriteButton from '~/common/components/FavoritesButton/FavoritesButton'
import styles from './ProfileInfo.module.css'

function InfoItem({ children, show = true }: PropsWithChildren<{ show?: boolean }>) {
  if (!children || !show) return;
  return (
    <p className={styles.infoItem}>
      {children}
    </p>
  )
}

interface ProfileInfoProps {
  user: GithubUser
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className={styles.info}>
      <span className={styles.infoHeader}>
        <h2>{user.login}</h2>
        <FavoriteButton username={user.login} />
      </span>
      <InfoItem>{user?.bio}</InfoItem>
      <InfoItem show={!!user?.company}>Working at {user.company}</InfoItem>
      <InfoItem show={!!user?.followers}>{user.followers} followers</InfoItem>
      <InfoItem show={!!user?.created_at}>Member since: {new Date(user.created_at!).getFullYear()}</InfoItem>
      <a href={user.html_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        View GitHub Profile
      </a>
    </div>
  )
} 