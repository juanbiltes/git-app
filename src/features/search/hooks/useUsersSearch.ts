import useSWR from 'swr';
import { GithubUser } from "~/types/Users";
import { GithubSearchResponse } from "~/services/githubClient";
import { useQueryParam } from "~/common/hooks/useQueryParam";
import { getUsers, searchUsers } from '~/services/githubClient';
import { useState } from 'react';

export default function useUsersSearch() {
    const [querySearch] = useQueryParam('search');
    const [currentSearch, setCurrentSearch] = useState(querySearch);

    const { data: searchData, error: searchError, isLoading: isSearchLoading } = useSWR<GithubSearchResponse>(
        currentSearch?.length ? currentSearch : null,
        searchUsers
    );

    const { data: usersData, error: usersError, isLoading: isUsersLoading } = useSWR<GithubUser[]>(
        'users',
        getUsers
    );

    return {
        users: searchData?.items || usersData || [],
        isLoading: isUsersLoading || isSearchLoading,
        error: searchError || usersError,
        setSearch: setCurrentSearch,
    };
} 