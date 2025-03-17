import styles from './LoadingState.module.css';

export default function LoadingState() {
    return (
        <div className={styles.container}>
            <div 
                className={styles.spinner} 
                role="status" 
                aria-label="Loading..."
                aria-live="polite"
            />
        </div>
    );
} 