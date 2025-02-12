import { GithubClient } from '../GithubClient';
import { GithubSearchClient } from './Search';

describe('GithubSearchClient', () => {
    let searchClient: GithubSearchClient;
    let mockGithubClient: jest.Mocked<GithubClient>;

    beforeEach(() => {
        mockGithubClient = {
            get: jest.fn(),
        } as unknown as jest.Mocked<GithubClient>;

        searchClient = new GithubSearchClient(mockGithubClient);
    });

    describe('searchUsers', () => {
        it('should make correct API call', async () => {
            const query = 'testuser';
            const mockResponse = { items: [] };
            mockGithubClient.get.mockResolvedValueOnce(mockResponse);

            const result = await searchClient.searchUsers(query);

            expect(result).toBe(mockResponse);
            expect(mockGithubClient.get).toHaveBeenCalledWith(
                expect.stringContaining('/search/users?q=')
            );
            expect(mockGithubClient.get).toHaveBeenCalledWith(
                expect.stringContaining(encodeURIComponent(query))
            );
        });

        it('should handle errors', async () => {
            const error = new Error('API Error');
            mockGithubClient.get.mockRejectedValueOnce(error);

            await expect(searchClient.searchUsers('test')).rejects.toThrow(error);
        });
    });
}); 