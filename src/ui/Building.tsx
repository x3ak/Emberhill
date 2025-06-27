import { useGameDispatch, useGameState } from "../hooks/useGame.ts";
import { Fragment, useState } from "react";
import ProcessDetails from "./ProcessDetails.tsx";
import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../core/core.api.ts";

export default function Building({ buildingId }: { buildingId: BuildingId }) {

    const gameDispatch = useGameDispatch();
    const gameState = useGameState();

    let buildingState = gameState.buildings.get(buildingId);
    let buildingData = coreAPI.getBuildingData(buildingId);

    const unassignWisp = () => {
        gameDispatch({ type: 'UNASSIGN_WISP', payload: { buildingId: buildingId } });
    }

    const assignWisp = () => {
        gameDispatch({ type: 'ASSIGN_WISP', payload: { buildingId: buildingId } });
    }

    const setProcess = (processId: ProcessId) => {
        gameDispatch({ type: 'SET_PROCESS', payload: { buildingId: buildingId, processId: processId } });
    }
    // const unsetProcess = () => {
    //     gameDispatch({ type: 'UNSET_PROCESS', payload: { buildingId: buildingId} });
    // }
    const [selectedProcess, setSelectedProcess] = useState<ProcessId | null>(null);

    const buildingProcesses = coreAPI.getBuildingProcesses(buildingId);

    return (<Fragment>

        <div className="text-center text-lg bg-zinc-800 border grid grid-cols-7 items-center gap-4 p-4">
            <div className="col-span-5 text-left">
                <h3 className="text-lg font-bold text-yellow-400">{buildingData.name} (Lvl {buildingState?.level})</h3>
                <p className="text-green-400 italic mt-1">{buildingState?.wispAssigned ? 'assigned' : 'unassigned'}</p>
            </div>

            <div className="col-span-2 text-right" >
                {buildingState?.wispAssigned ? (
                    <button
                        onClick={unassignWisp}
                        className="bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded w-35"
                    >
                        Unassign wisp
                    </button>
                ) : (
                    <button
                        onClick={assignWisp}
                        className="bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded w-35"
                    >
                        Assign wisp
                    </button>
                )}
            </div>
        </div>

        <div className="flex flex-wrap justify-center items-center mt-6 gap-4">

            <div className="flex flex-wrap justify-center gap-4">
                {buildingProcesses.map((process: ProcessData) => (
                    <button
                        key={process.id}
                        className="text-sm text-purple-400 hover:border-purple-300 hover:border-4 p-4 focus:outline-none w-40 h-40 bg-zinc-800 border border-purple-500 text-center"
                        onClick={() => setSelectedProcess(process.id)}
                    >
                        {process.name}
                    </button>
                ))}
            </div>


            {/* Side panel for process details */}
            {selectedProcess &&
                <ProcessDetails
                    processId={selectedProcess}
                    onPick={() => setProcess(selectedProcess)}
                    onClose={() => setSelectedProcess(null)}
                />}

        </div>

    </Fragment>
    );

}