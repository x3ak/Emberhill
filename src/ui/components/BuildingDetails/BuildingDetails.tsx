import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import type {BuildingState} from "../../../core/buildings.ts";
import ProgressBar from "@/components/ProgressBar/ProgressBar.tsx";

import styles from './BuildingDetails.module.css'

export default function BuildingDetails({buildingId, buildingState, buildingData}: {
    buildingId: BuildingId,
    buildingState: BuildingState,
    buildingData: BuildingData
}) {
    let activeProcessInfo;

    if (buildingState.activeProcess) {
        const activeProcess = coreAPI.getProcessData(buildingState.activeProcess.processId)
        activeProcessInfo = (
            <div>
                <p>Active Process: {activeProcess.name}</p>

                <ProgressBar isActive={buildingState.isProcessing}
                             totalDuration={buildingState.activeProcess?.duration}
                             elapsedTime={buildingState.activeProcess?.secondsSpent}/>
            </div>
        )
    }


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

                {activeProcessInfo}
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