import { GithubUser } from '~/types/Users'
import styles from './UserItem.module.css'
import Link from 'next/link'
import { UserAvatar } from '~/common/components/UserAvatar'
import FavoriteButton from '~/common/components/FavoritesButton'

interface UserItemProps {
    user: GithubUser
}

export function UserItem({ user }: UserItemProps) {
    return (
        <div className={styles.resultItem}>
            <Link className={styles.userInfo} href={`/users/${user.login}`}>
                <div className={styles.avatarContainer}>
                    <UserAvatar username={user.login} src={user.avatar_url} size={48} />
                </div>
                <p className={styles.userName}>
                    {user.login}
                </p>
            </Link>
            <div className={styles.favoritesContainer}>
                <FavoriteButton username={user.login} />
            </div>
        </div>
    )
} 