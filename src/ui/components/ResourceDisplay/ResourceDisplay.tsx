import styles from './ResourceDisplay.module.css'

interface ResourceDisplayProps {
    name: string;
    amount: number;
}

export default function ResourceDisplay({name, amount}: ResourceDisplayProps) {
    return (
        <div className={styles.slot}>
            <span className={styles.name}>{name}</span>
            <span className={styles.amount}>{Math.floor(amount)}</span>
        </div>
    )
}