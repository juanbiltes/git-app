import { createApiClient } from './ApiClient';
import { GithubUser } from '~/types/Users';

const GITHUB_API_ENDPOINTS = {
  users: '/users',
  user: (username: string) => `/users/${username}`,
  searchUsers: '/search/users',
} as const;

export type GithubSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GithubUser[];
};

// Add a default value for the base URL
const GITHUB_API_BASE_URL = process.env.NEXT_PUBLIC_GITHUB_BASE_URL || 'https://api.github.com';

const client = createApiClient({
  baseUrl: GITHUB_API_BASE_URL,
  defaultHeaders: {
    'Accept': 'application/vnd.github.v3+json',
  },
  errorHandler: ({ error }) => {
    if (error instanceof Response) {
      console.error(`GitHub API error: ${error.status} - ${error.statusText}`);
    }
    throw error;
  },
});

export const getUsers = () => 
  client.get<GithubUser[]>(GITHUB_API_ENDPOINTS.users);

export const getUser = (username: string) => 
  client.get<GithubUser>(GITHUB_API_ENDPOINTS.user(username));

export const searchUsers = (query: string) => {
  const params = new URLSearchParams();
  params.append('q', query);
  return client.get<GithubSearchResponse>(`${GITHUB_API_ENDPOINTS.searchUsers}?${params}`);
}; 