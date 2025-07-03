import {useGameState} from "../../../hooks/useGame.ts";
import {useEffect, useState} from "react";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import BuildingDetails from "../../components/BuildingDetails/BuildingDetails.tsx";
import ProcessDetails from "../../components/ProcessDetails/ProcessDetails.tsx";
import styles from './Building.module.css';
import ProcessTile from "@/components/ProcessTile/ProcessTile.tsx";

export default function Building({buildingId}: { buildingId: BuildingId }) {

    const gameState = useGameState();

    const buildingState = gameState.buildings.get(buildingId);
    const buildingData = coreAPI.building.getData(buildingId);

    const buildingProcesses: ProcessData[] = [];
    for (const processId in buildingData.processes) {
        let process = buildingData.processes[processId as ProcessId];
        if (process) {
            buildingProcesses.push(process);
        }
    }

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

            <div className={styles.processGrid}>
                {buildingProcesses.map((process: ProcessData) => (
                    <ProcessTile
                        processData={process}
                        setSelectedProcess={setSelectedProcess}
                        isActive={selectedProcess === process.id}
                    />

                ))}


            </div>

            <div className={styles.processDetails}>
                {selectedProcess ? (
                    <ProcessDetails
                        processData={coreAPI.getProcessData(buildingId, selectedProcess)}
                        onPick={() => coreAPI.building.setProcess(buildingId, selectedProcess)}
                        onUnset={() => coreAPI.building.unsetProcess(buildingId)}
                        isActive={buildingState?.activeProcess?.processId === selectedProcess}
                    />
                ) : (
                    <div>
                        <p>Select a process to see its details.</p>
                    </div>
                )}
            </div>
        </div>
    );
}