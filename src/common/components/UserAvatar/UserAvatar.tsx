import Image from 'next/image'
import styles from './UserAvatar.module.css'
import FavoriteButton from '../FavoritesButton';

interface UserAvatarProps {
  username: string
  src: string;
  size?: number
  withFavorite?: boolean;
}

export function UserAvatar({ username, src, size = 200, withFavorite }: UserAvatarProps) {
  return (
    <div className={styles.avatarContainer}>
      <Image
        src={src}
        alt={`${username}'s avatar`}
        width={size}
        height={size}
        className={styles.avatar}
      />
      <div className={styles.favoriteButtonRelativeContainer}>
        {
          withFavorite ? (
            <div className={styles.favoriteButtonAbsoluteContainer}>
              <FavoriteButton username={username} />
            </div>
          ) : null
        }
      </div>
    </div>
  )
} 