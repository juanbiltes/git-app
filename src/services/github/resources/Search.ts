import { GithubSearchResponse } from '~/types/Search';
import endpoints from '../endpoints';
import { GithubClient } from '../GithubClient';

export class GithubSearchClient {
    constructor(private readonly client: GithubClient) {
        this.client = client;
        this.searchUsers = this.searchUsers.bind(this);
    }

    searchUsers(query: string) {
        const queryString = new URLSearchParams({
            q: encodeURIComponent(query)
        });

        return this.client.get<GithubSearchResponse>(`${endpoints.searchUsers}?${queryString.toString()}`);
    }
}