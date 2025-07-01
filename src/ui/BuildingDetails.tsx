import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../core/core.api.ts";
import type {BuildingState} from "../core/buildings.ts";
import ProgressBar from "./components/ProgressBar.tsx";

export default function BuildingDetails({buildingId, buildingState, buildingData}: {
    buildingId: BuildingId,
    buildingState: BuildingState,
    buildingData: BuildingData
}) {

    let activeProcessInfo;
    if (buildingState.activeProcess) {
        const activeProcess = coreAPI.getProcessData(buildingState.activeProcess.processId)
        activeProcessInfo = (
            <div>
                <p className="text-purple-400">Active Process: {activeProcess.name}</p>

                <ProgressBar isActive={buildingState.isProcessing} totalDuration={buildingState.activeProcess?.duration}
                             elapsedTime={buildingState.activeProcess?.secondsSpent}/>
            </div>
        )
    }

    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold text-yellow-400">{buildingData.name}</h3>
                    <ul className="list-unstyled">
                        <li><label className="text-purple-400">Level:</label> <b>{buildingState?.level}</b></li>
                        <li><label
                            className="text-purple-400">XP:</label> {buildingState?.xp} / {buildingData.levels[buildingState.level + 1]?.xp}
                        </li>
                    </ul>
                    <p className={`text-lg ${buildingState?.wispAssigned ? 'text-green-400' : 'text-red-400'}`}>
                        {buildingState?.wispAssigned ? 'Wisp Assigned' : 'No Wisp Assigned'}
                    </p>
                    {activeProcessInfo}
                </div>
                <div>
                    {buildingState?.wispAssigned ? (
                        <button
                            onClick={() => coreAPI.building.unassignWisp(buildingId)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                        >
                            Unassign Wisp
                        </button>
                    ) : (
                        <button
                            onClick={() => coreAPI.building.assignWisp(buildingId)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                        >
                            Assign Wisp
                        </button>
                    )}
                </div>
            </div>
        </div>

    );
}