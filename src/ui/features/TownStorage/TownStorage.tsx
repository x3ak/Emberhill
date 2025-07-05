import { useResourcesState} from "@/hooks/useGame.ts";
import ResourceDisplay from "@/components/ResourceDisplay/ResourceDisplay.tsx";
import {coreAPI} from "../../../core/core.api.ts";
import styles from './TownStorage.module.css'

export default function TownStorage() {

    const resourcesState = useResourcesState();

    let resourcesList = [... resourcesState.resources].map(([resourceId, amount]) => {
        const resourceData = coreAPI.getResourceData(resourceId);

        return (
            <ResourceDisplay key={resourceId} name={resourceData.name}
                             amount={amount}/>
        )
    })

    return (
        <div className={styles.storageGrid}>

            {resourcesList}

        </div>
    )
}
