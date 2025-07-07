import type {ResourceData} from "@/shared/types/resource.types.ts";
import styles from './ResourcePill.module.css'

export default function ResourcePill({resourceData}: {resourceData: ResourceData}) {
    return (
        <div className={styles.pill}>
            {resourceData.icon && (
                <img
                    src={resourceData.icon}
                    alt={resourceData.name}
                    className={styles.icon} // Apply the .icon class
                />
            )}
            {/* The text doesn't need a special class unless you want to style it further */}
            <span>{resourceData.name}</span>
        </div>
    )
}