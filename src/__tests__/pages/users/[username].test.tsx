import { render } from '@testing-library/react';
import ProfilePage, { getServerSideProps } from '../../../pages/users/[username]';
import Profile from '~/features/profile/ProfileFeature';
import { getUser } from '~/services/githubClient';
import { GetServerSidePropsContext } from 'next';
import { GithubUser } from '~/types/Users';

jest.mock('~/features/Profile/ProfileFeature', () => ({
  __esModule: true,
  default: jest.fn(() => null)
}));

jest.mock('~/services/githubClient', () => ({
  getUser: jest.fn()
}));

describe('ProfilePage', () => {
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
    jest.clearAllMocks();
  });

  describe('Component', () => {
    it('renders Profile component with user data', () => {
      render(<ProfilePage user={mockUser} />);

      expect(Profile).toHaveBeenCalledWith(
        expect.objectContaining({
          user: mockUser
        }),
        expect.anything()
      );
    });
  });

  describe('getServerSideProps', () => {
    it('fetches user data for valid username', async () => {
      const mockContext: GetServerSidePropsContext = {
        params: { username: 'testuser' },
        req: {} as any,
        res: {} as any,
        query: {},
        resolvedUrl: '/users/testuser'
      };

      (getUser as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await getServerSideProps(mockContext);

      expect(result).toEqual({
        props: {
          user: mockUser
        }
      });
      expect(getUser).toHaveBeenCalledWith('testuser');
    });

    it('returns null user when username is not provided', async () => {
      const mockContext: GetServerSidePropsContext = {
        params: {},
        req: {} as any,
        res: {} as any,
        query: {},
        resolvedUrl: '/users/'
      };

      const result = await getServerSideProps(mockContext);

      expect(result).toEqual({
        props: {
          user: null
        }
      });
      expect(getUser).not.toHaveBeenCalled();
    });
  });
}); 