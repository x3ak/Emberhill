import type { BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import ProgressBar from "@/components/ProgressBar/ProgressBar.tsx";

import styles from './BuildingDetails.module.css'
import {useBuildingState, useProcessState} from "@/hooks/useGame.ts";
import type {ProcessId} from "@/shared/types/process.type.ts";

function ActiveProcessInfo({buildingId, processId}: {buildingId: BuildingId, processId: ProcessId}) {
    const process = useProcessState(buildingId, processId);
    const activeProcess = coreAPI.getProcessData(buildingId, processId)
    return (
        <div>
            <p>Active Process: {activeProcess?.name}</p>
            {process.isProcessing ? 'processing...' : 'stopped'}
            {process.secondsSpent.toFixed(2)}
            <ProgressBar playing={process.isProcessing}
                         totalDuration={process?.duration}
                         elapsedTime={process?.secondsSpent}/>
        </div>
    )
}

export default function BuildingDetails({buildingId}: {
    buildingId: BuildingId,
}) {
    let activeProcessInfo;

    const buildingState = useBuildingState(buildingId);
    const buildingData = coreAPI.building.getData(buildingId);

    if (buildingState.currentProcessId) {

        activeProcessInfo = (
            <ActiveProcessInfo buildingId={buildingId} processId={buildingState.currentProcessId} />
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