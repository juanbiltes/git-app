import { HttpClient } from './HttpClient';

describe('HttpClient', () => {
    let client: HttpClient;
    let mockFetch: jest.Mock;

    beforeEach(() => {
        mockFetch = jest.fn();
        global.fetch = mockFetch;
        client = new HttpClient();
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should initialize with default values', () => {
            const client = new HttpClient();
            expect(client['baseUrl']).toBeUndefined();
            expect(client['defaultOptions']).toEqual({ method: 'GET' });
        });

        it('should initialize with provided config', () => {
            const config = {
                baseUrl: 'https://api.example.com',
                defaultOptions: { 
                    mode: 'cors' as RequestMode,
                    headers: { 'Content-Type': 'application/json' }
                }
            };
            const client = new HttpClient(config);
            expect(client['baseUrl']).toBe(config.baseUrl);
            expect(client['defaultOptions']).toEqual({
                method: 'GET',
                ...config.defaultOptions
            });
        });
    });

    describe('fetch', () => {
        it('should make successful request', async () => {
            const mockResponse = { data: 'test' };
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            });

            const result = await client.fetch('/test');

            expect(result).toEqual(mockResponse);
        });

        it('should handle error response', async () => {
            jest.spyOn(console, 'error').mockImplementation(() => {});
            const errorResponse = new Response(null, { status: 404 });
            mockFetch.mockResolvedValueOnce(errorResponse);
            
            await expect(client.fetch('/test')).rejects.toEqual(errorResponse);
            expect(console.error).toHaveBeenCalledWith('Failed GET to /test', errorResponse);
        });

        it('should merge options correctly', async () => {
            const customClient = new HttpClient({
                defaultOptions: { 
                    credentials: 'include' as RequestCredentials,
                    headers: { 'X-Default': 'default' }
                }
            });

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({})
            });

            await customClient.fetch('/test', {
                headers: { 'X-Custom': 'custom' },
                method: 'POST'
            });

            expect(mockFetch).toHaveBeenCalledWith('/test', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-Default': 'default',
                    'X-Custom': 'custom'
                }
            });
        });

        it('should prepend baseUrl to request path', async () => {
            const clientWithBase = new HttpClient({
                baseUrl: 'https://api.example.com'
            });
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({})
            });

            await clientWithBase.fetch('/test');

            expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/test', 
                expect.objectContaining({
                    method: 'GET'
                })
            );
        });
    });

    describe('get', () => {
        it('should make GET request', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({})
            });

            await client.get('/test');
            expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
                method: 'GET'
            }));
        });
    });
}); 