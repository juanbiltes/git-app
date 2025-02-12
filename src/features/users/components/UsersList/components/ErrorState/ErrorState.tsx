import styles from './ErrorState.module.css';

interface ErrorStateProps {
    message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
    return (
        <div className={styles.container}>
            <p className={styles.message}>{message}</p>
            <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
            >
                Retry
            </button>
        </div>
    );
} 