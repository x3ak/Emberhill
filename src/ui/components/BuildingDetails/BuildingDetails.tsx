import type { BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";

import styles from './BuildingDetails.module.css'
import {useBuildingState} from "@/hooks/useGame.ts";

export default function BuildingDetails({buildingId}: {
    buildingId: BuildingId,
}) {

    const buildingState = useBuildingState(buildingId);
    const buildingData = coreAPI.building.getData(buildingId);

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

    const levelUpData = buildingData.levels[buildingState.level + 1] || null;

    return (
        <div className={styles.buildingDetails}>
            <div>
                <h3 className={styles.name}>{buildingData.name} (Lvl: {buildingState?.level})</h3>
                {levelUpData && (<ul className={styles.properties}>
                    <li className={styles.propertyLine}><label>XP:</label> <b>{buildingState?.xp} / {buildingData.levels[buildingState.level + 1]?.xp}</b></li>
                </ul>)}

                {levelUpData && (<button onClick={levelUpHandler} disabled={!buildingState.canLevelUp}>Level up</button>)}

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