import { GithubUser } from '~/types/Users'
import { ItemsList } from '../ItemsList'
import { UserItem } from './components/UserItem'

interface UsersListProps {
    users: GithubUser[]
    isLoading?: boolean
    error?: string | null
}

export function UsersList({ users, isLoading, error }: UsersListProps) {
    return (
        <ItemsList
            items={users}
            renderItem={(user) => <UserItem key={user.login} user={user} />}
            isLoading={isLoading}
            error={error}
        />
    )
} 