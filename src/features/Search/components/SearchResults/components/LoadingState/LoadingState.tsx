import styles from './LoadingState.module.css';

export default function LoadingState() {
    return (
        <div className={styles.container}>
            <div className={styles.spinner} />
            <p className={styles.text}>Loading users...</p>
        </div>
    );
} 