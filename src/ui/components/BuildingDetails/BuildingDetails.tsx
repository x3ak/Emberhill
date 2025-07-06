import type { BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";

import styles from './BuildingDetails.module.css'
import type {ResourceAmount} from "@/shared/types/process.types.ts";
import {useBuildingState} from "@/hooks/useBuildingState.ts";
import {useResourcesState} from "@/hooks/useResourcesState.ts";
import type {ResourcesState} from "@/shared/types/resource.types.ts";

function ResourcesListDetails({resources, resourcesState}: {resources: ResourceAmount[]; resourcesState: ResourcesState}) {
    return resources.filter(resource => resource.type === 'resource').map((resource: ResourceAmount) => {
        const resourceData = coreAPI.getResourceData(resource.id);
        return (
            <li key={resource.id}>
                {resourceData.name}: {resource.amount}, you have: {resourcesState.resources.get(resource.id)}
            </li>
        )
    })
}

export default function BuildingDetails({buildingId}: {
    buildingId: BuildingId,
}) {


    const buildingState = useBuildingState(buildingId);
    const buildingData = coreAPI.building.getData(buildingId);
    const resourcesState = useResourcesState();

    const handleWispToggle = () => {
        if (buildingState?.wispAssigned) {
            coreAPI.building.unassignWisp(buildingId)
        } else {
            coreAPI.building.assignWisp(buildingId)
        }
    }

    const levelUpHandler = () => {
        coreAPI.building.upgrade(buildingId);
    }

    const levelUpData = buildingData.progression[buildingState.level + 1] || null;

    return (
        <div className={styles.buildingDetails}>
            <div>
                <h3 className={styles.name}>{buildingData.name} (Lvl: {buildingState?.level})</h3>
                {levelUpData && (<ul className={styles.properties}>
                    <li className={styles.propertyLine}><label>XP:</label> <b>{buildingState?.xp} / {buildingData.progression[buildingState.level + 1]?.xp}</b></li>
                </ul>)}

                <div>
                    {levelUpData && (<button onClick={levelUpHandler} disabled={!buildingState.canLevelUp}>UPGRADE</button>)}

                    <div>
                        To upgrade the building you need:
                        <ul>
                            {levelUpData && (<ResourcesListDetails resources={levelUpData.resources} resourcesState={resourcesState} />)}
                        </ul>

                    </div>
                </div>

            </div>
            <div className={styles.buildingActions}>
                <div className={styles.toggleContainer}>
                    <input
                        type="checkbox"
                        id={`wisp-toggle-${buildingId}`}
                        className={styles.toggleInput}
                        checked={buildingState?.wispAssigned}
                        onChange={handleWispToggle}
                    />
                    <label
                        htmlFor={`wisp-toggle-${buildingId}`}
                        className={styles.toggleLabel}
                        data-on="Assigned"
                        data-off="Unassigned"
                    >
                        Wisp
                    </label>
                </div>

            </div>
        </div>

    );
}