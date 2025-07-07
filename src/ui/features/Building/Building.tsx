import {useEffect, useState} from "react";
import type {ProcessData, ProcessId, ResourceAmount} from "@/shared/types/process.types.ts";
import type {BuildingId, BuildingState} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import BuildingDetails from "../../components/BuildingDetails/BuildingDetails.tsx";
import styles from './Building.module.css';
import ProcessTile from "@/components/ProcessTile/ProcessTile.tsx";
import ProcessDetails from "@/components/ProcessDetails/ProcessDetails.tsx";
import {useBuildingState} from "@/hooks/useBuildingState.ts";
import type {ResourcesState} from "@/shared/types/resource.types.ts";
import ResourcePill from "@/components/ResourcePill/ResourcePill.tsx";
import {useResourcesState} from "@/hooks/useResourcesState.ts";
import type {UnlockReward} from "@/shared/types/progression.types.ts";

type BuildingSubSection =
    | 'processes'
    | 'progression'
    | 'statistics';

export default function Building({buildingId}: { buildingId: BuildingId }) {

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
        <div>
            <BuildingDetails buildingId={buildingId} />

            <BuildingNavigation
                currentSection={selectedSubSection}
                onNavigate={setSelectedSubSection} />

            {selectedSubSection === 'progression' && <BuildingProgression buildingState={buildingState} />}

            {selectedSubSection === 'processes' && <BuildingProcessList
                buildingId={buildingId}
                processes={buildingProcesses}
                buildingState={buildingState}
                setSelectedProcess={setSelectedProcess}
                selectedProcess={selectedProcess} />}


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

function BuildingNavigation({onNavigate, currentSection}: {onNavigate: (section: BuildingSubSection) => void, currentSection: BuildingSubSection}) {
    return (
        <ul className={styles.buildingNavigation}>
            <li onClick={() => onNavigate('processes')} className={ currentSection === 'processes' ? styles.active : ''}>🔨 Tasks</li>
            <li onClick={() => onNavigate('progression')} className={ currentSection === 'progression' ? styles.active : ''}>↑ Upgrade</li>
            <li onClick={() => onNavigate('statistics')} className={ currentSection === 'statistics' ? styles.active : ''}>📊 Statistics</li>
        </ul>
    )
}

function ResourcesListDetails({resources, resourcesState}: {
    resources: ResourceAmount[];
    resourcesState: ResourcesState
}) {
    return resources.filter(resource => resource.type === 'resource').map((resource: ResourceAmount) => {
        const resourceData = coreAPI.getResourceData(resource.id);
        return (
            <li key={resource.id}>
                <ResourcePill resourceData={resourceData}/>
                : {resource.amount}, you have: {resourcesState.resources.get(resource.id)}
            </li>
        )
    })
}

function RewardDisplay({reward}: {reward: UnlockReward}) {
    switch (reward.type) {
        case "unlock_process":
            const processData = coreAPI.getProcessData(reward.processId)
            return (<span>Unlocks the process: <b>{processData?.name}</b></span>)
        default:
            return (<span>{JSON.stringify(reward)}</span>)
    }

}

function BuildingProgression ({buildingState}: {buildingState: BuildingState}) {

    const resourcesState = useResourcesState();
    const buildingData = coreAPI.building.getData(buildingState.id);
    const levelUpData = buildingData.progression[buildingState.level + 1] || null;

    const levelUpHandler = () => {
        coreAPI.building.upgrade(buildingState.id);
    }

    const progressionLevels = Object.keys(buildingData.progression)
        .map(levelString => parseInt(levelString, 10))
        .sort((a, b) => a - b) // sorting from lowest to highest
        .map(level => {
            const progression = buildingData.progression[level];

            const isUnlocked = buildingState.level >= level;

            return (
                <div key={level} className={styles.progressionLine}>
                    <span>{isUnlocked ? '[✅]' : '[❌]'}</span>
                    <span>Level {level}</span>
                    {progression.xp > 0 && (<span>XP Required: {progression.xp}</span>) }
                    {progression.resources.length > 0 && (<span>requires: {JSON.stringify(progression.resources)}</span>)}
                    <span>
                        {progression.rewards.map(reward => (<RewardDisplay reward={reward} />))}
                    </span>

                </div>
            )
        })


    return (<div>
            To upgrade the building you need:
            <ul>
                {levelUpData && (<ResourcesListDetails resources={levelUpData.resources}
                                                       resourcesState={resourcesState}/>)}
            </ul>

            {levelUpData && (
                <button onClick={levelUpHandler} disabled={!buildingState.canLevelUp}>UPGRADE</button>)}

            <div className={styles.progression}>
                {progressionLevels}
            </div>

        </div>)
}
