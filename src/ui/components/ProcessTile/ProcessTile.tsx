import type { ProcessId} from "@/shared/types/processes.types.ts";
import styles from "./ProcessTile.module.css";
import {coreAPI} from "@/core/core.api.ts";
import DynamicProgressBar from "@/components/DynamicProgressBar/DynamicProgressBar.tsx";
import {useProcessState} from "@/hooks/useProcessState.ts";
import type {BuildingState} from "@/shared/types/building.types.ts";


export default function ProcessTile({processId, isActive, setSelectedProcess}: {
    buildingState: BuildingState,
    processId: ProcessId,
    isActive: boolean,
    setSelectedProcess: any
}) {
    const processState = useProcessState(processId);
    const processData = coreAPI.getProcessData(processId);

    if (processState.isUnlocked) {

        return (
            <div
                className={`${styles.tile} ${isActive ? styles.active : ''}`}
                onClick={() => setSelectedProcess(processId)}
                style={{backgroundImage: `url(${processData?.icon})`}}
            >
                <div className={styles.details}>
                    {processData?.name}<br />
                    {processState.status}<br />
                    {processState?.secondsSpent.toFixed(2)}
                </div>
                <div>
                    <DynamicProgressBar playing={processState.isProcessing && processState.isActive}
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