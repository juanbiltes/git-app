import { ApiError, API_ERROR_TYPES } from '~/types/errors';
import styles from './ApiErrorMessage.module.css';

interface ApiErrorMessageProps {
  readonly error: ApiError;
}

const ERROR_MESSAGES = {
  [API_ERROR_TYPES.RATE_LIMIT]: {
    title: 'API Rate Limit Exceeded',
    additionalMessage: 'Please try again later when the rate limit has reset.',
    icon: '⏳'
  },
  [API_ERROR_TYPES.NOT_FOUND]: {
    title: 'Not Found',
    additionalMessage: 'The requested resource could not be found.',
    icon: '🔍'
  },
  [API_ERROR_TYPES.UNKNOWN]: {
    title: 'Error',
    additionalMessage: 'An unexpected error occurred.',
    icon: '⚠️'
  }
} as const;

export function ApiErrorMessage({ error }: ApiErrorMessageProps): JSX.Element {
  const errorConfig = ERROR_MESSAGES[error.type];
  
  return (
    <div className={styles.container}>
      <div className={styles.card} role="alert">
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>{errorConfig.icon}</span>
        </div>
        <br />
        <h1 className={styles.title}>{errorConfig.title}</h1>
        <p className={styles.additionalMessage}>{errorConfig.additionalMessage}</p>
      </div>
    </div>
  );
} 