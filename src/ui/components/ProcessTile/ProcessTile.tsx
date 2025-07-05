import type { ProcessId} from "@/shared/types/process.type.ts";
import styles from "./ProcessTile.module.css";
import {coreAPI} from "../../../core/core.api.ts";
import ProgressBar from "@/components/ProgressBar/ProgressBar.tsx";
import type {BuildingState} from "../../../core/Building.ts";
import {useProcessState} from "@/hooks/useProcessState.ts";


export default function ProcessTile({buildingState, processId, isActive, setSelectedProcess}: {
    buildingState: BuildingState,
    processId: ProcessId,
    isActive: boolean,
    setSelectedProcess: any
}) {
    const processState = useProcessState(processId);
    const processData = coreAPI.getProcessData(buildingState.id, processId);

    if (processState.isUnlocked) {

        return (
            <div
                className={`${styles.tile} ${isActive ? styles.active : ''}`}
                onClick={() => setSelectedProcess(processId)}

            >
                <div className={styles.details}>
                    {processData?.name}<br />
                    {processState.status}<br />
                    {processState?.secondsSpent.toFixed(2)}
                </div>
                <div>
                    <ProgressBar playing={processState.isProcessing && processState.isActive}
                                 totalDuration={processState?.duration}
                                 elapsedTime={processState?.secondsSpent}/>
                </div>
            </div>
        )
    } else {
        return (
            <div className={styles.tile}>???</div>
        )
    }
}