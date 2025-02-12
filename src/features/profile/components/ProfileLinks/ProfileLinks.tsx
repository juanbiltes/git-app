import { GithubUser } from '~/types/Users'
import styles from './ProfileLinks.module.css'

interface ProfileLinksProps {
  user: GithubUser
}

export function ProfileLinks({ user }: ProfileLinksProps) {
  return (
    <div className={styles.links}>
      <a href={user.followers_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        Followers
      </a>
      <a href={user.repos_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        Repositories
      </a>
      <a href={user.gists_url} target="_blank" rel="noopener noreferrer" className={styles.link}>
        Gists
      </a>
    </div>
  )
} 