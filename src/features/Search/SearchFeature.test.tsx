import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SWRConfig } from 'swr'
import UsersFeature from './SearchFeature'
import githubClient from '~/services/github/GithubClient'
import type { GithubUser } from '~/types/Users'
import type { GithubSearchResponse } from '~/types/Search'
import { useFavorites } from '~/common/components/FavoritesButton/hooks/useFavorites'

// Mock dependencies consistently with useUsersSearch.test.ts
jest.mock('~/services/github/GithubClient', () => ({
    search: {
        searchUsers: jest.fn()
    },
    users: {
        getUsers: jest.fn()
    }
}));

jest.mock('~/common/components/FavoritesButton/hooks/useFavorites')

const mockBaseUser: GithubUser = {
    id: 1,
    login: 'testuser',
    avatar_url: 'https://avatar.url',
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
}

const mockUsers: GithubUser[] = [
    mockBaseUser,
    { ...mockBaseUser, id: 2, login: 'testuser-2' }
]

const mockSearchResults: GithubSearchResponse = {
    total_count: 2,
    incomplete_results: false,
    items: [
        { ...mockBaseUser, id: 3, login: 'searchuser', score: 1 },
        { ...mockBaseUser, id: 4, login: 'searchuser-2', score: 0.8 }
    ]
}

describe('SearchFeature', () => {
    const mockAddFavorite = jest.fn()
    const mockRemoveFavorite = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks();

        // Update mock implementation for Github client methods
        (githubClient.users.getUsers as jest.Mock).mockResolvedValue(mockUsers);
        (githubClient.search.searchUsers as jest.Mock).mockResolvedValue(mockSearchResults);

        // Setup default favorites mock
        (useFavorites as jest.Mock).mockReturnValue({
            favorites: [],
            isFavorite: jest.fn().mockReturnValue(false),
            addFavorite: mockAddFavorite,
            removeFavorite: mockRemoveFavorite
        })
    })

    it('renders users list and search functionality', async () => {
        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <UsersFeature />
            </SWRConfig>
        )

        // Check loading state
        expect(screen.getByText('Loading users...')).toBeInTheDocument()

        // Wait for initial users to load
        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument()
            expect(screen.getByText('testuser-2')).toBeInTheDocument()
        })

        // Perform search
        const searchInput = screen.getByPlaceholderText('Buscar usuario...')
        fireEvent.change(searchInput, { target: { value: 'searchuser' } })

        // Wait for search results
        await waitFor(() => {
            expect(screen.getByText('searchuser')).toBeInTheDocument()
            expect(screen.getByText('searchuser-2')).toBeInTheDocument()
        })
    })

    it('handles favorites functionality correctly', async () => {
        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <UsersFeature />
            </SWRConfig>
        )

        // Wait for users to load
        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument()
        })

        // Get favorite buttons
        const favoriteButtons = screen.getAllByRole('button', { name: /add to favorites/i })
        expect(favoriteButtons).toHaveLength(2)

        // Click favorite button for first user
        fireEvent.click(favoriteButtons[0])
        expect(mockAddFavorite).toHaveBeenCalledWith('testuser')

            // Mock favorite state for first user
            ; (useFavorites as jest.Mock).mockReturnValue({
                favorites: ['testuser'],
                isFavorite: (username: string) => username === 'testuser',
                addFavorite: mockAddFavorite,
                removeFavorite: mockRemoveFavorite
            })

        // Rerender to update favorite state
        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <UsersFeature />
            </SWRConfig>
        )

        // Wait for rerender and check favorite state
        await waitFor(() => {
            const updatedButton = screen.getAllByRole('button', { name: /remove from favorites/i })[0]
            expect(updatedButton).toHaveTextContent('★')
        })
    })

    it('maintains favorites state during search', async () => {
        // Setup initial favorite
        ; (useFavorites as jest.Mock).mockReturnValue({
            favorites: ['searchuser'],
            isFavorite: (username: string) => username === 'searchuser',
            addFavorite: mockAddFavorite,
            removeFavorite: mockRemoveFavorite
        })

        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <UsersFeature />
            </SWRConfig>
        )

        // Wait for initial users to load
        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument()
        })

        // Perform search
        const searchInput = screen.getByPlaceholderText('Buscar usuario...')
        fireEvent.change(searchInput, { target: { value: 'searchuser' } })

        // Wait for search results and check favorite state
        await waitFor(() => {
            expect(screen.getByText('searchuser')).toBeInTheDocument()
            const favoriteButton = screen.getAllByRole('button', { name: /remove from favorites/i })[0]
            expect(favoriteButton).toHaveTextContent('★')
        })
    })

    it('handles no results appropriately', async () => {
        // Override the mock for this specific test
        (githubClient.users.getUsers as jest.Mock).mockResolvedValue([]);
        (githubClient.search.searchUsers as jest.Mock).mockResolvedValue({ 
            items: [], 
            total_count: 0, 
            incomplete_results: false 
        });

        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <UsersFeature />
            </SWRConfig>
        )

        // Should show loading first
        expect(screen.getByText('Loading users...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText("No results available")).toBeInTheDocument()
        })
    })

    it('handles error states appropriately', async () => {
        // Override the mock for this specific test
        (githubClient.users.getUsers as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
        (githubClient.search.searchUsers as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <UsersFeature />
            </SWRConfig>
        )

        // Should show loading first
        expect(screen.getByText('Loading users...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText("Service is currently unavailable")).toBeInTheDocument()
        })
    })
}) 