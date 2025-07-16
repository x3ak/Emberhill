import ResourceDisplay from "@/features/TownStorage/ResourceDisplay.tsx";
import {coreAPI} from "@/core/core.api.ts";
import styles from './TownStorage.module.css'
import {useResourcesState} from "@/hooks/useResourcesState.ts";

export default function TownStorage() {

    const resourcesState = useResourcesState();

    let resourcesList = [... resourcesState.resources].map(([resourceId, amount]) => {
        const resourceData = coreAPI.getResourceData(resourceId);

        return (
            <ResourceDisplay key={resourceId} resourceData={resourceData}
                             amount={amount}/>
        )
    })

    return (
        <div className={styles.storageGrid}>

            {resourcesList}

        </div>
    )
}
