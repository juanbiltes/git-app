import { GithubRepository } from '~/types/Repository'
import styles from './RepositoryItem.module.css'

interface RepositoryItemProps {
  repository: GithubRepository
}

export function RepositoryItem({ repository }: RepositoryItemProps) {
  return (
    <a href={repository.html_url} target="_blank" rel="noopener noreferrer" className={styles.container}>
      <div className={styles.info}>
        <h3 className={styles.name}>{repository.name}</h3>
        {repository.description && <p className={styles.description}>{repository.description}</p>}
      </div>
      <div className={styles.stats}>
        <span className={styles.stat}>⭐ {repository.stargazers_count}</span>
        <span className={styles.stat}>🍴 {repository.forks_count}</span>
      </div>
    </a>
  )
} 