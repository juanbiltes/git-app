import { GithubUser } from "~/types/Users";
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { UsersList } from './components/UsersList'

interface SearchResultsProps {
    users: GithubUser[];
    isLoading?: boolean;
    error?: Error | null;
    isSearchError?: boolean;
}

export default function SearchResults({ users, isLoading, error }: SearchResultsProps) {
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
        <div>
            <UsersList users={users} />
        </div>
    );
} 