import {useGameState} from "../../../hooks/useGame.ts";
import {useEffect, useState} from "react";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import BuildingDetails from "../../components/BuildingDetails/BuildingDetails.tsx";
import ProcessDetails from "../../components/ProcessDetails/ProcessDetails.tsx";
import styles from './Building.module.css';

export default function Building({buildingId}: { buildingId: BuildingId }) {

    const gameState = useGameState();

    const buildingState = gameState.buildings.get(buildingId);
    const buildingData = coreAPI.building.getData(buildingId);
    const buildingProcesses = buildingData.processes;

    const [selectedProcess, setSelectedProcess] = useState<ProcessId | null>(null);

    useEffect(() => {
        if (buildingState?.activeProcess) {
            setSelectedProcess(buildingState?.activeProcess.processId)
        } else {
            setSelectedProcess(buildingProcesses[0].id)
        }
    }, [buildingId]);

    return (
        <div>
            {buildingState && (
                <BuildingDetails buildingId={buildingId} buildingState={buildingState} buildingData={buildingData}/>)}

            <div className={styles.container}>
                <ul className={styles.processesList}>
                    {buildingProcesses.map((process: ProcessData) => (
                        <li
                            key={process.id}
                            className={`${styles.processButton} ${selectedProcess === process.id ? styles.active : ''}`}
                            onClick={() =>  setSelectedProcess(process.id)}

                        >
                            {process.name}
                        </li>
                    ))}
                </ul>

                <div className={styles.processDetails}>
                    {selectedProcess ? (
                        <ProcessDetails
                            processId={selectedProcess}
                            onPick={() => coreAPI.building.setProcess(buildingId, selectedProcess) }
                            onUnset={() => coreAPI.building.unsetProcess(buildingId) }
                            isActive={buildingState?.activeProcess?.processId === selectedProcess}
                        />
                    ) : (
                        <div>
                            <p>Select a process to see its details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}