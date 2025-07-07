import type {ResourceAmount} from "@/shared/types/process.types.ts";
import {coreAPI} from "../../../core/core.api.ts";

import styles from './ResourceAmountDisplay.module.css'

export function ResourceAmountDisplay({resourceAmount}: {resourceAmount: ResourceAmount}) {

    switch (resourceAmount.type) {
        case "resource":
            const resourceData = coreAPI.getResourceData(resourceAmount.id);
            return (

                <span className={styles.amountNeededPill}>
                    {resourceData.icon && (
                        <img
                            src={resourceData.icon}
                            alt={resourceData.name}
                            className={styles.icon}
                        />
                    )}
                    <span>{resourceData.name} x {resourceAmount.amount}</span>
                </span>

            );
        default:
            return (<span>UNSUPPORTED RESOURCE AMOUNT: {resourceAmount.type}</span>);
    }

}