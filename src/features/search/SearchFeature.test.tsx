import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SWRConfig } from 'swr'
import SearchFeature from './SearchFeature'
import { getUsers, searchUsers } from '~/services/githubClient'
import type { GithubUser } from '~/types/Users'
import type { GithubSearchResponse } from '~/services/githubClient'
import { useFavorites } from '~/common/components/FavoritesButton/hooks/useFavorites'

jest.mock('~/services/githubClient', () => ({
    getUsers: jest.fn(),
    searchUsers: jest.fn()
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
        { ...mockBaseUser, id: 3, login: 'searchuser' },
        { ...mockBaseUser, id: 4, login: 'searchuser-2' }
    ]
}

describe('SearchFeature', () => {
    const mockAddFavorite = jest.fn()
    const mockRemoveFavorite = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks();
        (getUsers as jest.Mock).mockResolvedValue(mockUsers);
        (searchUsers as jest.Mock).mockResolvedValue(mockSearchResults);

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
                <SearchFeature />
            </SWRConfig>
        )

        expect(screen.getByText('Loading users...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument()
            expect(screen.getByText('testuser-2')).toBeInTheDocument()
        })

        const searchInput = screen.getByPlaceholderText('Buscar usuario...')
        fireEvent.change(searchInput, { target: { value: 'searchuser' } })

        await waitFor(() => {
            expect(screen.getByText('searchuser')).toBeInTheDocument()
            expect(screen.getByText('searchuser-2')).toBeInTheDocument()
        })
    })

    it('handles favorites functionality correctly', async () => {
        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <SearchFeature />
            </SWRConfig>
        )

        await waitFor(() => {
            expect(screen.getByText('testuser')).toBeInTheDocument()
        })

        const favoriteButtons = screen.getAllByRole('button', { name: /add to favorites/i })
        expect(favoriteButtons).toHaveLength(2)

        fireEvent.click(favoriteButtons[0])
        expect(mockAddFavorite).toHaveBeenCalledWith('testuser');

        (useFavorites as jest.Mock).mockReturnValue({
            favorites: ['testuser'],
            isFavorite: (username: string) => username === 'testuser',
            addFavorite: mockAddFavorite,
            removeFavorite: mockRemoveFavorite
        })

        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <SearchFeature />
            </SWRConfig>
        )

        await waitFor(() => {
            const updatedButton = screen.getAllByRole('button', { name: /remove from favorites/i })[0]
            expect(updatedButton).toHaveTextContent('★')
        })
    })

    it('handles no results appropriately', async () => {
        (getUsers as jest.Mock).mockResolvedValue([]);
        (searchUsers as jest.Mock).mockResolvedValue({ 
            items: [], 
            total_count: 0, 
            incomplete_results: false 
        });

        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <SearchFeature />
            </SWRConfig>
        )

        expect(screen.getByText('Loading users...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText("No results available")).toBeInTheDocument()
        })
    })

    it('handles error states appropriately', async () => {
        (getUsers as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
        (searchUsers as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

        render(
            <SWRConfig value={{ provider: () => new Map() }}>
                <SearchFeature />
            </SWRConfig>
        )

        expect(screen.getByText('Loading users...')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText("Service is currently unavailable")).toBeInTheDocument()
        })
    })
}) 