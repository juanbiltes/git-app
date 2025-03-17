import { createApiClient } from './ApiClient';
import { GithubUser } from '~/types/Users';
import { GithubRepository } from '~/types/Repository';
import { ApiError, API_ERROR_TYPES } from '~/types/errors';

const GITHUB_API_ENDPOINTS = {
    users: '/users',
    user: (username: string) => `/users/${username}`,
    searchUsers: '/search/users',
    followers: (username: string) => `/users/${username}/followers`,
    following: (username: string) => `/users/${username}/following`,
    repositories: (username: string) => `/users/${username}/repos`,
} as const;

export interface GithubSearchResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GithubUser[];
}

interface GitHubErrorResponse {
    message: string;
    documentation_url?: string;
}

const GITHUB_API_BASE_URL = process.env.NEXT_PUBLIC_GITHUB_BASE_URL ?? 'https://api.github.com';

const isRateLimitError = (status: number, message: string): boolean =>
    status === 403 && message.toLowerCase().includes('api rate limit exceeded');

const createApiError = (status: number, message: string): ApiError => {
    if (isRateLimitError(status, message)) {
        return { status, message, type: API_ERROR_TYPES.RATE_LIMIT };
    }
    if (status === 404) {
        return { status, message, type: API_ERROR_TYPES.NOT_FOUND };
    }
    return { status, message, type: API_ERROR_TYPES.UNKNOWN };
};

const handleApiError = async (error: Response) => {
    const status = error.status;
    const data = await error.json() as GitHubErrorResponse;
    throw createApiError(status, data.message);
};

const client = createApiClient({
    baseUrl: GITHUB_API_BASE_URL,
    defaultHeaders: {
        'Accept': 'application/vnd.github.v3+json',
    },
    errorHandler: async ({ error }) => {
        if (error instanceof Response) {
            return await handleApiError(error);
        }
        throw createApiError(500, 'An unexpected error occurred');
    },
});

// Type-safe API functions
export const getUsers = (): Promise<GithubUser[]> =>
    client.get(GITHUB_API_ENDPOINTS.users);

export const getUser = (username: string): Promise<GithubUser> =>
    client.get(GITHUB_API_ENDPOINTS.user(username));

export const searchUsers = (query: string): Promise<GithubSearchResponse> => {
    const params = new URLSearchParams({ q: query });
    return client.get(`${GITHUB_API_ENDPOINTS.searchUsers}?${params}`);
};

export const getUserFollowers = (username: string): Promise<GithubUser[]> =>
    client.get(GITHUB_API_ENDPOINTS.followers(username));

export const getUserFollowing = (username: string): Promise<GithubUser[]> =>
    client.get(GITHUB_API_ENDPOINTS.following(username));

export const getUserRepositories = (username: string): Promise<GithubRepository[]> =>
    client.get(GITHUB_API_ENDPOINTS.repositories(username)); 