export interface ErrorHandlerParams {
    path: string;
    options?: {
        method?: string;
    };
    error: Error;
    response?: Response;
}

const defaultErrorHandler = ({ error, path, options }: ErrorHandlerParams): never => {
    if (error instanceof Response) {
        console.error(`API error: ${error.status} - ${error.statusText}`);
    } else {
        console.error(`Failed ${options?.method || 'GET'} to ${path}:`, error);
    }
    throw error;
};

interface ApiClientConfig {
    baseUrl?: string;
    defaultHeaders?: HeadersInit;
    errorHandler?: (params: ErrorHandlerParams) => Promise<never>;
};
const createApiClient = (config: ApiClientConfig = {}) => {
    const handleError = config.errorHandler || defaultErrorHandler;

    const request = async <T>(path: string, options: RequestInit): Promise<T> => {
        try {
            const url = new URL(path, config.baseUrl);

            const body = options.body && typeof options.body === 'object'
                ? JSON.stringify(options.body)
                : options.body;

            const response = await fetch(url, {
                ...options,
                body,
                headers: {
                    ...config.defaultHeaders,
                    ...options?.headers,
                },
            });

            if (!response.ok) {
                throw response;
            }

            return response.json();
        } catch (e) {
            const error = e as Error;
            return handleError({ error, path, options });
        }
    };

    return {
        get: <T>(path: string, options?: RequestInit): Promise<T> =>
            request(path, { ...options, method: 'GET' }),

        post: <T>(path: string, body?: RequestInit['body'], options?: RequestInit): Promise<T> =>
            request(path, { ...options, method: 'POST', body }),
    };
};

export type ApiClient = ReturnType<typeof createApiClient>;
export { createApiClient }; 