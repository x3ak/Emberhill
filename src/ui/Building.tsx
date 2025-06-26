import { useGameDispatch, useGameState } from "../hooks/useGame.ts";
import { Fragment, useState } from "react";
import ProcessDetails from "./ProcessDetails.tsx";
import type { ProcessData} from "../core/data/processes-data.ts";

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
  
       
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 w-56 text-center shadow-lg">
            <h3 className="text-lg font-bold text-yellow-400">{buildingState?.name} (Lvl {buildingState?.level})</h3>
            {/* <p className="text-sm text-gray-400 mt-1">Process: {buildingProcess?.name}</p> */}
            {/* {processes} */}
            {processId && (
                <div className=" text-zinc-900 font-bold py-2 px-4 rounded w-full">
                    {buildingState.availableProcesses.map((process) => (
                        <button
                            key={process.id}
                            onClick={() => setSelectedProcess(process)}
                            className="text-sm text-purple-400 hover:underline focus:outline-none"
                        >
                            {process.name}
                        </button>
                    ))}
                </div>
            )}
            <p className="text-green-400 italic h-6 my-2">{buildingState?.wispAssigned ? 'assigned' : 'unassigned'} </p>

            {buildingState?.wispAssigned && (
                <button onClick={unassignWisp}
                    className="bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded w-full">Unassign
                    wisp</button>
            )}

            {!buildingState?.wispAssigned && (
                <button onClick={startProcess}
                    className="bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded w-full">Assign wisp</button>
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