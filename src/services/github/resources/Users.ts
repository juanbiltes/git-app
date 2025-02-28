import { GithubUser } from '~/types/Users';
import endpoints from '../endpoints';
import { GithubClient } from '../GithubClient';

export class GithubUsersClient {
    constructor(private readonly client: GithubClient) {
        this.client = client;
        this.getUsers = this.getUsers.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    getUsers() {
        return this.client.get<GithubUser[]>(endpoints.users);
    }

    getUser(login: string) {
        return this.client.get<GithubUser>(endpoints.user(login));
    }
}