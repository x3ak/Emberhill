import styles from './TownStorage.module.css'
import {useResourcesState} from "@/hooks/useResourcesState.ts";
import {ResourceAmountDisplay} from "@/components/ResourceAmountDisplay/ResourceAmountDisplay.tsx";

export default function TownStorage() {

    const resourcesState = useResourcesState();
    const resourcesList = [...resourcesState.resources].map(([resourceId, amount]) => {
        return (
            <ResourceAmountDisplay key={resourceId} resourceAmount={{type: "resource", id: resourceId, amount: amount}}
                                   showOnlyDescription={true}/>
        )
    })

    return (
        <div className={styles.storageGrid}>

            {resourcesList}

        </div>
    )
}
