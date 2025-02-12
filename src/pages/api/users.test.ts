import { NextApiRequest, NextApiResponse } from 'next';
import handler from './users';
import githubClient from '~/services/github/GithubClient';

jest.mock('~/services/github/GithubClient', () => ({
  __esModule: true,
  default: {
    users: {
      getUsers: jest.fn()
    }
  }
}));

describe('Users API', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = {};
    mockRes = {
      status: mockStatus
    };
  });

  it('should return users from GitHub API', async () => {
    const mockUsers = [{ id: 1, login: 'user1' }, { id: 2, login: 'user2' }];
    (githubClient.users.getUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockUsers);
  });

  it('should handle API errors with status', async () => {
    const mockError = {
      status: 403,
      statusText: 'Forbidden'
    };
    (githubClient.users.getUsers as jest.Mock).mockRejectedValueOnce(mockError);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockStatus).toHaveBeenCalledWith(403);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Forbidden' });
  });

  it('should handle unknown errors', async () => {
    const mockError = new Error('Unknown error');
    (githubClient.users.getUsers as jest.Mock).mockRejectedValueOnce(mockError);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Something went wrong' });
  });
}); 