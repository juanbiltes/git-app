import useUsersSearch from './hooks/useUsersSearch';
import SearchResults from "./components/SearchResults";
import SearchBar from "./components/SearchBar";

export default function SearchFeature() {
    const { users, isLoading, error, setSearch } = useUsersSearch();

    return (
        <>
            <SearchBar placeholder="Buscar usuario..." onSearch={setSearch} />
            <SearchResults
                users={users}
                isLoading={isLoading}
                error={error}
            />
        </>
    );
}