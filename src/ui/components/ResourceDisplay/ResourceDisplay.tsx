import styles from './ResourceDisplay.module.css'

import type {ResourceData} from "@/shared/types/game.types.ts";

interface ResourceDisplayProps {
    resourceData: ResourceData;
    amount: number;
}

export default function ResourceDisplay({resourceData, amount}: ResourceDisplayProps) {
    return (
        <div className={styles.slot}>
            <span className={styles.name}>{resourceData.name}</span>
            <img src={resourceData.icon} alt={resourceData.name} width="100%" />
            <span className={styles.amount}>{Math.floor(amount)}</span>
        </div>
    )
}