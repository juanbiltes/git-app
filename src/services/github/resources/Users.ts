import { GithubUser } from '~/types/Users';
import endpoints from '../endpoints';
import { GithubClient } from '../GithubClient';

export class GithubUsersClient {
    constructor(private readonly client: GithubClient) {}

    getUsers() {
        return this.client.get<GithubUser[]>(endpoints.users);
    }

    getUser(login: string) {
        return this.client.get<GithubUser>(endpoints.user(login));
    }
}