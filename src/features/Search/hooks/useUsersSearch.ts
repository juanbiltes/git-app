import useSWR from 'swr';
import { GithubUser } from "~/types/Users";
import { GithubSearchResponse } from "~/types/Search";
import { useQueryParam } from "~/common/hooks/useQueryParam";
import githubClient from '~/services/github/GithubClient';
import { useState } from 'react';

export default function useUsersSearch() {
    const [querySearch] = useQueryParam('search');
    const [currentSearch, setCurrentSearch] = useState(querySearch);

    const { data: searchData, error: searchError, isLoading: isSearchLoading } = useSWR<GithubSearchResponse>(
        currentSearch?.length ? currentSearch : null,
        githubClient.search.searchUsers
    );

    const { data: usersData, error: usersError, isLoading: isUsersLoading } = useSWR<GithubUser[]>(
        'users',
        githubClient.users.getUsers
    );

    return {
        users: searchData?.items || usersData || [],
        isLoading: isUsersLoading || isSearchLoading,
        error: searchError || usersError,
        setSearch: setCurrentSearch,
    };
} 