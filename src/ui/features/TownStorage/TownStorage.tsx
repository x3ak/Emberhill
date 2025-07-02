import {useGameState} from "../../../hooks/useGame.ts";
import {AllResourceIds} from "@/shared/types/resource.types.ts";
import ResourceDisplay from "@/components/ResourceDisplay/ResourceDisplay.tsx";
import {coreAPI} from "../../../core/core.api.ts";
import styles from './TownStorage.module.css'

export default function TownStorage() {

    const gameState = useGameState();

    let resourcesList = AllResourceIds.map((resourceId) => {
        return (
            <ResourceDisplay key={resourceId} name={coreAPI.getResourceData(resourceId).name}
                             amount={gameState.resources[resourceId]}/>
        )
    })

    return (
        <div className={styles.storageGrid}>

            {resourcesList}
            {resourcesList}
            {resourcesList}
            {resourcesList}
            {resourcesList}
            {resourcesList}

        </div>
    )
}
