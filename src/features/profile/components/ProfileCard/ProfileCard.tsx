import { PropsWithChildren } from 'react'
import styles from './ProfileCard.module.css'

export function ProfileCard({ children }: PropsWithChildren) {
  return (
    <div className={styles.card}>
      {children}
    </div>
  )
} 