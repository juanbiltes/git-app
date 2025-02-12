import { NextApiRequest, NextApiResponse } from 'next';
import handler from './search';
import GithubClient from '~/services/github/GithubClient';

jest.mock('~/services/github/GithubClient', () => ({
  __esModule: true,
  default: {
    search: {
      searchUsers: jest.fn()
    }
  }
}));

describe('Search API', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = {
      query: {}
    };
    mockRes = {
      status: mockStatus
    };
  });

  it('should return search results from GitHub API', async () => {
    const mockSearchResults = {
      total_count: 2,
      incomplete_results: false,
      items: [{ id: 1, login: 'user1' }, { id: 2, login: 'user2' }]
    };
    (GithubClient.search.searchUsers as jest.Mock).mockResolvedValueOnce(mockSearchResults);
    
    mockReq.query = { q: 'test' };

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockSearchResults);
  });

  it('should handle empty search query', async () => {
    const mockSearchResults = {
      total_count: 0,
      incomplete_results: false,
      items: []
    };
    (GithubClient.search.searchUsers as jest.Mock).mockResolvedValueOnce(mockSearchResults);

    await handler(mockReq as NextApiRequest, mockRes as NextApiResponse);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(mockSearchResults);
  });
}); 