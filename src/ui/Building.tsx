import {useGameDispatch, useGameState} from "../hooks/useGame.ts";
import {useState} from "react";
import ProcessDetails from "./ProcessDetails.tsx";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../core/core.api.ts";
import BuildingDetails from "./BuildingDetails.tsx";

export default function Building({buildingId}: { buildingId: BuildingId }) {

    const gameDispatch = useGameDispatch();
    const gameState = useGameState();

    const buildingState = gameState.buildings.get(buildingId);
    const buildingData = coreAPI.building.getData(buildingId);
    const buildingProcesses = buildingData.processes;

    const [selectedProcess, setSelectedProcess] = useState<ProcessId | null>(null);

    const setProcess = (processId: ProcessId) => {
        gameDispatch({type: 'SET_PROCESS', payload: {buildingId: buildingId, processId: processId}});
    }

    const unsetProcess = () => {
        gameDispatch({type: 'UNSET_PROCESS', payload: {buildingId: buildingId}});
    }

    return (
        <div className="flex flex-col gap-4">
            {JSON.stringify(buildingState, null, 2)}
            {buildingState && (
                <BuildingDetails buildingId={buildingId} buildingState={buildingState} buildingData={buildingData}/>)}

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 bg-zinc-800 p-4 rounded-lg shadow-lg">
                    <h4 className="text-xl font-bold text-yellow-400 mb-2">Processes</h4>
                    {buildingProcesses.map((process: ProcessData) => (
                        <button
                            key={process.id}
                            className={`p-3 rounded-lg text-left transition-colors ${
                                selectedProcess === process.id
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-zinc-700 hover:bg-zinc-600 text-purple-300'
                            }`}
                            onClick={() => setSelectedProcess(process.id)}
                        >
                            {process.name}
                        </button>
                    ))}
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg shadow-lg h-full">
                    {selectedProcess ? (
                        <ProcessDetails
                            processId={selectedProcess}
                            onPick={() => setProcess(selectedProcess)}
                            onUnset={unsetProcess}
                            isActive={buildingState?.activeProcess?.processId === selectedProcess}
                        />
                    ) : (
                        <div className="text-center text-gray-400 flex items-center justify-center h-full">
                            <p>Select a process to see its details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}