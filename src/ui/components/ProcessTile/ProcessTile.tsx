import type { ProcessId} from "@/shared/types/process.type.ts";
import styles from "./ProcessTile.module.css";
import {useProcessState} from "@/hooks/useGame.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import ProgressBar from "@/components/ProgressBar/ProgressBar.tsx";


export default function ProcessTile({buildingId, processId, isActive, setSelectedProcess}: {
    buildingId: BuildingId,
    processId: ProcessId,
    isActive: boolean,
    setSelectedProcess: any
}) {
    const processState = useProcessState(buildingId, processId);
    const processData = coreAPI.getProcessData(buildingId, processId);

    return (
        <div
            className={`${styles.tile} ${isActive ? styles.active : ''}`}
            onClick={() => setSelectedProcess(processId)}

        >
            <div className={styles.details}>
                {processData?.name}
            </div>
            <div>
                <ProgressBar playing={processState.isProcessing && processState.isActive}
                             totalDuration={processState?.duration}
                             elapsedTime={processState?.secondsSpent}/>
            </div>
        </div>
    )
}