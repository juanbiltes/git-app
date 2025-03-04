import { GithubUser } from '~/types/Users'
import styles from './UsersList.module.css'
import { UserItem } from '../UserItem'

interface UsersListProps {
    users: GithubUser[];
}

export function UsersList({ users }: UsersListProps) {
    return (
        <ul className={styles.resultsList}>
            {users.map(user => <UserItem key={user.login} user={user} />)}
        </ul>
    )
} 