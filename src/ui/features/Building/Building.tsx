import {useEffect, useState} from "react";
import type {ProcessData, ProcessId} from "@/shared/types/process.types.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import BuildingDetails from "../../components/BuildingDetails/BuildingDetails.tsx";
import styles from './Building.module.css';
import ProcessTile from "@/components/ProcessTile/ProcessTile.tsx";
import ProcessDetails from "@/components/ProcessDetails/ProcessDetails.tsx";
import {useBuildingState} from "@/hooks/useBuildingState.ts";

export default function Building({buildingId}: { buildingId: BuildingId }) {


    const buildingState = useBuildingState(buildingId);

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
        if (buildingState?.currentProcessId) {
            setSelectedProcess(buildingState?.currentProcessId)
        } else {
            setSelectedProcess(buildingProcesses[0].id)
        }
    }, [buildingId]);

    useEffect(() => {
        coreAPI.building.setProcess(buildingId, selectedProcess as ProcessId);
    }, [selectedProcess]);

    return (
        <div>

            <BuildingDetails buildingId={buildingId} />

            <div className={styles.processGrid}>
                {buildingProcesses.map((process: ProcessData) => (
                    <ProcessTile
                        key={process.id}
                        buildingState={buildingState}
                        processId={process.id}
                        setSelectedProcess={setSelectedProcess}
                        isActive={selectedProcess === process.id}
                    />

                ))}


            </div>

            <div className={styles.processDetails}>
                {selectedProcess ? (
                    <ProcessDetails
                        buildingId={buildingId}
                        processId={selectedProcess}
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