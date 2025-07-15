import {useEffect, useState} from "react";
import type {ProcessId} from "@/shared/types/process.types.ts";
import type {BuildingId, BuildingState} from "@/shared/types/building.types.ts";
import {coreAPI} from "@/core/core.api.ts";
import BuildingDetails from "../../components/BuildingDetails/BuildingDetails.tsx";
import styles from './Building.module.css';
import ProcessTile from "@/components/ProcessTile/ProcessTile.tsx";
import ProcessDetails from "@/components/ProcessDetails/ProcessDetails.tsx";
import {useBuildingState} from "@/hooks/useBuildingState.ts";
import BuildingProgression from "@/features/Building/BuildingProgression.tsx";
import BuildingNavigation, {type BuildingSubSection} from "@/features/Building/BuildingNavigation.tsx";
import type {ProcessData} from "@/shared/types/game.types.ts";

export function Building({buildingId}: { buildingId: BuildingId }) {

    const [selectedSubSection, setSelectedSubSection] = useState<BuildingSubSection>('processes');

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
        <div className={styles.buildingScreen}>
            <BuildingDetails buildingId={buildingId}/>

            <BuildingNavigation
                currentSection={selectedSubSection}
                onNavigate={setSelectedSubSection}
                buildingState={buildingState}

            />

            {selectedSubSection === 'progression' && <BuildingProgression buildingState={buildingState}/>}

            {selectedSubSection === 'processes' && <BuildingProcessList
                buildingId={buildingId}
                processes={buildingProcesses}
                buildingState={buildingState}
                setSelectedProcess={setSelectedProcess}
                selectedProcess={selectedProcess}/>}


        </div>
    );
}

type BuildingProcessListProps = {
    buildingId: BuildingId,
    processes: ProcessData[],
    buildingState: BuildingState,
    setSelectedProcess: any,
    selectedProcess: ProcessId | null
};

function BuildingProcessList({processes, buildingState, setSelectedProcess, selectedProcess}: BuildingProcessListProps) {
    return (
        <div>
            <div className={styles.processGrid}>
                {processes.map((process: ProcessData) => (
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
                {processes && selectedProcess ? (
                    <ProcessDetails
                        processId={selectedProcess}
                    />
                ) : (
                    <div>
                        <p>Select a process to see its details.</p>
                    </div>
                )}
            </div>
        </div>
    )
}



