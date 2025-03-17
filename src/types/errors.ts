export const API_ERROR_TYPES = {
  RATE_LIMIT: 'rate_limit',
  NOT_FOUND: 'not_found',
  UNKNOWN: 'unknown'
} as const;

export type ApiErrorType = typeof API_ERROR_TYPES[keyof typeof API_ERROR_TYPES];

export interface ApiError {
  readonly status: number;
  readonly message: string;
  readonly type: ApiErrorType;
}

export interface WithApiErrorProps {
  readonly error?: ApiError;
} 