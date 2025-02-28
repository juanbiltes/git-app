import { renderHook, act } from '@testing-library/react';
import { SWRConfig } from 'swr';
import useUsersSearch from './useUsersSearch';
import githubClient from '~/services/github/GithubClient';
import { useQueryParam } from '~/common/hooks/useQueryParam';

// Mock dependencies
jest.mock('~/common/hooks/useQueryParam');
jest.mock('~/services/github/GithubClient', () => ({
    search: {
        searchUsers: jest.fn()
    },
    users: {
        getUsers: jest.fn()
    }
}));

const mockUseQueryParam = useQueryParam as jest.MockedFunction<typeof useQueryParam>;

describe('useUsersSearch', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseQueryParam.mockReturnValue(['', jest.fn()]);
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SWRConfig value={{
            provider: () => new Map()
        }}>
            {children}
        </SWRConfig>
    );

    it('should return empty users array initially', () => {
        const { result } = renderHook(() => useUsersSearch(), { wrapper });

        expect(result.current.users).toEqual([]);
        expect(result.current.isLoading).toBe(true);
        expect(result.current.error).toBeUndefined();
    });

    it('should fetch users when no search query is present', async () => {
        const mockUsers = [{ id: 1, login: 'user1' }, { id: 2, login: 'user2' }];
        (githubClient.users.getUsers as jest.Mock).mockResolvedValue(mockUsers);

        const { result } = renderHook(() => useUsersSearch(), { wrapper });

        // Wait for the data to be loaded
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.users).toEqual(mockUsers);
        expect(result.current.isLoading).toBe(false);
        expect(githubClient.users.getUsers).toHaveBeenCalled();
    });

    it('should search users when search query is present', async () => {
        const searchQuery = 'test';
        const mockSearchResults = {
            items: [{ id: 1, login: 'test1' }, { id: 2, login: 'test2' }],
            total_count: 2
        };

        mockUseQueryParam.mockReturnValue([searchQuery, jest.fn()]);
        (githubClient.search.searchUsers as jest.Mock).mockResolvedValue(mockSearchResults);

        const { result } = renderHook(() => useUsersSearch(), { wrapper });

        // Wait for the data to be loaded
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.users).toEqual(mockSearchResults.items);
        expect(result.current.isLoading).toBe(false);
        expect(githubClient.search.searchUsers).toHaveBeenCalledWith(searchQuery);
    });

    it('should handle search errors and return default users', async () => {
        const searchQuery = 'test';
        const error = new Error('Search failed');

        const mockUsers = [{ id: 1, login: 'user1' }, { id: 2, login: 'user2' }];
        (githubClient.users.getUsers as jest.Mock).mockResolvedValue(mockUsers);

        mockUseQueryParam.mockReturnValue([searchQuery, jest.fn()]);
        (githubClient.search.searchUsers as jest.Mock).mockRejectedValue(error);

        const { result } = renderHook(() => useUsersSearch(), { wrapper });

        // Wait for the error to be caught
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(result.current.users).toEqual(mockUsers);
        expect(result.current.error).toBe(error);
        expect(result.current.isLoading).toBe(false);
    });

    it('should update search when setSearch is called', async () => {
        const { result } = renderHook(() => useUsersSearch(), { wrapper });

        await act(async () => {
            result.current.setSearch('newSearch');
        });

        expect(githubClient.search.searchUsers).toHaveBeenCalledWith('newSearch');
    });
}); 