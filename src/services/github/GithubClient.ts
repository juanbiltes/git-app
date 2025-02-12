import { GithubSearchResponse } from '~/types/Search';
import { HttpClient } from '../HttpClient';
import { GithubUser } from '~/types/Users';
import endpoints from './endpoints';
import { GithubSearchClient } from './resources/Search';
import { GithubUsersClient } from './resources/Users';

export class GithubClient extends HttpClient {
    public readonly search: GithubSearchClient;
    public readonly users: GithubUsersClient;

    constructor() {
        super({
            baseUrl: process.env.GITHUB_BASE_URL
        });
        
        this.search = new GithubSearchClient(this);
        this.users = new GithubUsersClient(this);
    }

    protected handleError({ error }: { error: unknown }): never {
        if (error instanceof Response) {
            console.error(`GitHub API error: ${error.status} - ${error.statusText}`);
        }
        throw error;
    }
}

export default new GithubClient();