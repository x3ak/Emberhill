import { useGameDispatch, useGameState } from "../hooks/useGame.ts";
import { Fragment, useState } from "react";
import ProcessDetails from "./ProcessDetails.tsx";
import type { ProcessData } from "../core/data/processes-data.ts";

export default function Building({ buildingId, processId }: { buildingId: string, processId: string }) {


    const gameDispatch = useGameDispatch();
    const gameState = useGameState();

    let buildingState = gameState.buildings[buildingId];
    // let buildingProcess = buildingState?.currentProcess;

    const unassignWisp = () => {
        gameDispatch({ type: 'UNASSIGN_WISP', payload: { buildingId: buildingId } });
    }

    const startProcess = () => {
        gameDispatch({ type: 'START_PROCESS', payload: { buildingId: buildingId, processId: processId } });
    }

    const [selectedProcess, setSelectedProcess] = useState<ProcessData | null>(null);

    return (<Fragment>

        <div className="text-center text-lg bg-zinc-800 border grid grid-cols-7 items-center gap-4 p-4">
            <div className="col-span-5 text-left">
                <h3 className="text-lg font-bold text-yellow-400">{buildingState?.name} (Lvl {buildingState?.level})</h3>
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
                        onClick={startProcess}
                        className="bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded w-35"
                    >
                        Assign wisp
                    </button>
                )}
            </div>
        </div>

        <div className="flex flex-wrap justify-center items-center mt-6 gap-4">
            {processId && (
                <div className="flex flex-wrap justify-center gap-4">
                    {buildingState.availableProcesses.map((process) => (
                        <button
                            className="text-sm text-purple-400 hover:border-purple-300 hover:border-4 p-4 focus:outline-none w-40 h-40 bg-zinc-800 border border-purple-500 text-center"
                            key={process.id}
                            onClick={() => setSelectedProcess(process)}
                        >
                            {process.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Side panel for process details */}
            {selectedProcess &&
                <ProcessDetails
                    process={selectedProcess}

                    onClose={() => setSelectedProcess(null)}
                />}

        </div>

    </Fragment>
    );

}