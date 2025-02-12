import merge from 'lodash.merge';

export type HttpClientConfig = {
    baseUrl?: string;
    defaultOptions?: Partial<RequestInit>;
}

const defaultOptions: Partial<RequestInit> = {
    method: 'GET',
};

export class HttpClient {
    protected baseUrl?: string;
    protected defaultOptions: Partial<RequestInit>;

    constructor(config: HttpClientConfig = { defaultOptions }) {
        this.baseUrl = config.baseUrl;
        this.defaultOptions = merge({}, defaultOptions, config.defaultOptions);
        this.fetch = this.fetch.bind(this);
        this.get = this.get.bind(this);
    }

    protected createUrl(path: string): string {
        return this.baseUrl ? (new URL(path, this.baseUrl)).toString() : path;
    }

    protected mergeOptions(options?: RequestInit): RequestInit {
        return merge({}, this.defaultOptions, options);
    }

    protected async handleError({ error, path, options }: { error: unknown, path: string, options?: RequestInit }): Promise<never> {
        // Add telemetry or any other generic error handling here
        console.error(`Failed ${options?.method} to ${path}`, error);
        throw error;
    }

    async fetch<T>(path: string, options?: RequestInit): Promise<T> {
        const mergedOptions = this.mergeOptions(options);

        try {
            const url = this.createUrl(path);
            const response = await fetch(url, mergedOptions);

            if (!response.ok) {
                throw response;
            }

            return await response.json();
        } catch (error) {
            return this.handleError({
                path, options: mergedOptions, error
            });
        }
    }

    async get<T>(path: string, options?: RequestInit): Promise<T> {
        return this.fetch<T>(path, { ...options, method: 'GET' });
    }

    // TODO: Add post, put, delete methods.
}

const httpClient = new HttpClient();
export default httpClient;