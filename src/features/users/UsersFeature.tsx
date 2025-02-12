import { Geist, Geist_Mono } from "next/font/google";
import useSWR from 'swr'
import styles from "./UsersFeature.module.css";
import UsersList from "./components/UsersList";
import Search from "./components/Search";
import { useState, ReactNode } from "react";
import { GithubUser } from "~/types/Users";
import { GithubSearchResponse } from "~/types/Search";
import httpClient from "~/services/HttpClient";
import { useQueryParam } from "~/common/hooks/useQueryParam";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Users() {
    const [querySearch] = useQueryParam('search');
    const [currentSearch, setCurrentSearch] = useState(querySearch);

    const { data: searchData, error: searchError, isLoading: isSearchLoading } = useSWR<GithubSearchResponse>(currentSearch.length ? `/api/search?q=${currentSearch}` : null, httpClient.get)
    const { data: usersData, error: usersError,isLoading: isUsersLoading } = useSWR<GithubUser[]>('/api/users', httpClient.get)

    return (
        <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
            <main className={styles.main}>
                <Search placeholder="Buscar usuario..." onSearch={setCurrentSearch} />
                <UsersList
                    users={searchData?.items || usersData || []}
                    isLoading={isUsersLoading || isSearchLoading}
                    error={searchError || usersError}
                />
            </main>
        </div>
    );
}