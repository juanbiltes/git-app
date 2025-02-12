import { GithubClient } from './GithubClient';

describe('GithubClient', () => {
    let client: GithubClient;

    beforeEach(() => {
        process.env.GITHUB_BASE_URL = 'https://api.github.com';
        client = new GithubClient();
    });

    it('should initialize with correct base URL', () => {
        expect(client['baseUrl']).toBe(process.env.GITHUB_BASE_URL);
    });

    it('should initialize search client', () => {
        expect(client.search).toBeDefined();
    });

    it('should initialize users client', () => {
        expect(client.users).toBeDefined();
    });

    describe('handleError', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        afterEach(() => {
            consoleSpy.mockClear();
        });

        it('should handle Response error', () => {
            const error = new Response(null, { status: 404, statusText: 'Not Found' });
            
            expect(() => client['handleError']({error, path: 'users'})).toThrow();
            expect(consoleSpy).toHaveBeenCalledWith(
                'GitHub API error: 404 - Not Found'
            );
        });

        it('should handle generic error', () => {
            const error = new Error('Generic error');
            
            expect(() => client['handleError']({error, path: 'users'})).toThrow(error);
        });
    });
}); 