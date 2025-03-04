import { getUsers, getUser, searchUsers } from './githubClient';
import { ApiClient, createApiClient } from './ApiClient';
import { GithubUser } from '~/types/Users';

jest.mock('./ApiClient', () => {
  const mockGet = jest.fn();
  const mockPost = jest.fn();
  return {
    createApiClient: jest.fn(() => ({
      get: mockGet,
      post: mockPost
    })),
    __mockGet: mockGet, 
    __mockPost: mockPost
  };
});

describe('githubClient', () => {
  const mockGet = (jest.requireMock('./ApiClient').__mockGet as jest.Mock);

  const mockUser: GithubUser = {
    id: 1,
    login: 'testuser',
    avatar_url: 'https://example.com/avatar.jpg',
    node_id: 'node1',
    gravatar_id: '',
    url: 'https://api.github.com/users/testuser',
    html_url: 'https://github.com/testuser',
    followers_url: 'https://api.github.com/users/testuser/followers',
    following_url: 'https://api.github.com/users/testuser/following{/other_user}',
    gists_url: 'https://api.github.com/users/testuser/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/testuser/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/testuser/subscriptions',
    organizations_url: 'https://api.github.com/users/testuser/orgs',
    repos_url: 'https://api.github.com/users/testuser/repos',
    events_url: 'https://api.github.com/users/testuser/events{/privacy}',
    received_events_url: 'https://api.github.com/users/testuser/received_events',
    type: 'User',
    site_admin: false,
    user_view_type: 'PUBLIC'
  };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_GITHUB_BASE_URL = 'https://api.github.com';
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_GITHUB_BASE_URL;
  });

  describe('getUsers', () => {
    it('should fetch users from the correct endpoint', async () => {
      const mockUsers = [mockUser];
      mockGet.mockResolvedValueOnce(mockUsers);

      const result = await getUsers();

      expect(mockGet).toHaveBeenCalledWith('/users');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUser', () => {
    it('should fetch a single user by username', async () => {
      mockGet.mockResolvedValueOnce(mockUser);

      const result = await getUser(mockUser.login);

      expect(mockGet).toHaveBeenCalledWith(`/users/${mockUser.login}`);
      expect(result).toEqual(mockUser);
    });
  });

  describe('searchUsers', () => {
    it('should search users with the correct query', async () => {
      const mockResponse = {
        items: [mockUser],
        total_count: 1,
        incomplete_results: false
      };

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await searchUsers('test');

      expect(mockGet).toHaveBeenCalledWith('/search/users?q=test');
      expect(result).toEqual(mockResponse);
    });

    it('should properly encode complex search queries', async () => {
      const mockResponse = {
        items: [],
        total_count: 0,
        incomplete_results: false
      };

      mockGet.mockResolvedValueOnce(mockResponse);

      await searchUsers('test user @company');

      expect(mockGet).toHaveBeenCalledWith('/search/users?q=test+user+%40company');
    });
  });
}); 