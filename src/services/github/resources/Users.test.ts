import { GithubClient } from '../GithubClient';
import { GithubUsersClient } from './Users';

describe('GithubUsersClient', () => {
    let usersClient: GithubUsersClient;
    let mockGithubClient: jest.Mocked<GithubClient>;

    beforeEach(() => {
        mockGithubClient = {
            get: jest.fn(),
        } as unknown as jest.Mocked<GithubClient>;

        usersClient = new GithubUsersClient(mockGithubClient);
    });

    describe('getUsers', () => {
        it('should make correct API call', async () => {
            const mockUsers = [{ id: 1, login: 'user1' }];
            mockGithubClient.get.mockResolvedValueOnce(mockUsers);

            const result = await usersClient.getUsers();

            expect(result).toBe(mockUsers);
            expect(mockGithubClient.get).toHaveBeenCalledWith('/users');
        });

        it('should handle errors', async () => {
            const error = new Error('API Error');
            mockGithubClient.get.mockRejectedValueOnce(error);

            await expect(usersClient.getUsers()).rejects.toThrow(error);
        });
    });

    describe('getUser', () => {
        it('should make correct API call', async () => {
            const mockUser = { id: 1, login: 'testuser' };
            mockGithubClient.get.mockResolvedValueOnce(mockUser);

            const result = await usersClient.getUser('testuser');

            expect(result).toBe(mockUser);
            expect(mockGithubClient.get).toHaveBeenCalledWith('/users/testuser');
        });

        it('should handle errors', async () => {
            const error = new Error('API Error');
            mockGithubClient.get.mockRejectedValueOnce(error);

            await expect(usersClient.getUser('testuser')).rejects.toThrow(error);
        });
    });
}); 