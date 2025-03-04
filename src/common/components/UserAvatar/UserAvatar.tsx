import Image from 'next/image'
import styles from './UserAvatar.module.css'

interface UserAvatarProps {
  username: string
  src: string;
  size?: number
}

export function UserAvatar({ username, src, size = 200 }: UserAvatarProps) {
  return (
    <div className={styles.avatarContainer}>
      <Image
        src={src}
        alt={`${username}'s avatar`}
        width={size}
        height={size}
        className={styles.avatar}
      />
    </div>
  )
} 