import { createApiClient, ErrorHandlerParams } from './ApiClient';

describe('apiClient', () => {
  let mockFetch: jest.Mock;
  const mockErrorHandler = jest.fn((params: ErrorHandlerParams): never => {
    throw new Error('Mock error');
  });

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    mockErrorHandler.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('makes successful GET request', async () => {
    const client = createApiClient({ baseUrl: 'https://api.example.com' });
    const mockResponse = { data: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await client.get('/test');

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      new URL('/test', 'https://api.example.com'),
      {
        method: 'GET',
        headers: {},
        body: undefined
      }
    );
  });

  it('makes successful POST request with body', async () => {
    const client = createApiClient({ baseUrl: 'https://api.example.com' });
    const mockResponse = { success: true };
    const requestBody = { data: 'test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await client.post('/test', JSON.stringify(requestBody));

    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledWith(
      new URL('/test', 'https://api.example.com'),
      {
        method: 'POST',
        headers: {},
        body: JSON.stringify(requestBody)
      }
    );
  });

  it('uses default error handler when not provided', async () => {
    const client = createApiClient({ baseUrl: 'https://api.example.com' });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const errorResponse = new Response(null, { status: 404, statusText: 'Not Found' });
    mockFetch.mockResolvedValueOnce(errorResponse);

    await expect(client.get('/test')).rejects.toEqual(errorResponse);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('merges default headers with request headers', async () => {
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      defaultHeaders: { 'X-Default': 'default' },
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await client.get('/test', {
      headers: { 'X-Custom': 'custom' },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      new URL('/test', 'https://api.example.com'),
      {
        method: 'GET',
        headers: {
          'X-Default': 'default',
          'X-Custom': 'custom'
        },
        body: undefined
      }
    );
  });

  it('handles network errors', async () => {
    const client = createApiClient({ baseUrl: 'https://api.example.com' });
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(networkError);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await expect(client.get('/test')).rejects.toThrow(networkError);
    expect(consoleSpy).toHaveBeenCalled();
  });
}); 