import styles from "./UsersList.module.css";
import { GithubUser } from "~/types/Users";
import Link from "next/link";
import { FavoriteButton } from "~/common/components/Favorites/FavoritesButton";
import { UserAvatar } from '~/common/components/UserAvatar'
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';

interface UserItemProps { user: GithubUser }
function UserItem({ user }: UserItemProps) {
    return (
        <li className={styles.userItem}>
            <Link className={styles.userInfo} href={`/users/${user.login}`}>
                <div className={styles.userAvatarContainer}>
                    <UserAvatar username={user.login} src={user.avatar_url} size={48} />
                </div>
                <p className={styles.userName}>
                    {user.login}
                </p>
            </Link>
            <div className={styles.favoritesContainer}>
                <FavoriteButton username={user.login} />
            </div>

        </li>
    )
}

interface UsersListProps {
    users: GithubUser[];
    isLoading?: boolean;
    error?: Error | null;
    isSearchError?: boolean;
}

export default function UsersList({ users, isLoading, error }: UsersListProps) {
    if (isLoading) {
        return <LoadingState />;
    }

    const errorMessage = error ? "Service is currently unavailable" : !users.length ? 'No results available' : '';
    if (error || !users.length) {
        return (
            <ErrorState 
                message={errorMessage} 
            />
        );
    }

    return (
        <div className={styles.container}>
            <ul className={styles.usersList}>
                {users.map(user => <UserItem key={user.login} user={user} />)}
            </ul>
        </div>
    );
}