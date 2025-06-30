import type {BuildingData, BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../core/core.api.ts";
import type {BuildingState} from "../core/buildings.ts";

export default function BuildingDetails({ buildingId, buildingState, buildingData }: { buildingId: BuildingId, buildingState: BuildingState, buildingData: BuildingData }) {

    let activeProcessInfo;
    if (buildingState.activeProcessId) {
        const activeProcess = coreAPI.getProcessData(buildingState.activeProcessId)
        activeProcessInfo = (
            <p className="text-purple-400">Active Process: {activeProcess.name}</p>
        )
    }

    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold text-yellow-400">{buildingData.name} (Lvl {buildingState?.level})</h3>
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