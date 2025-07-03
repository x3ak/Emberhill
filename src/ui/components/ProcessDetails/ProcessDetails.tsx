import type {ProcessData, ProcessId} from "@/shared/types/process.type.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";

type ProcessDetailsProps = {
    processData: ProcessData | null;
    onPick: () => void;
    onUnset: () => void;
    isActive: boolean;
    buildingId: BuildingId;
    processId: ProcessId;
};

export default function ProcessDetails({buildingId, processId, onPick, onUnset, isActive}: ProcessDetailsProps) {

    const processData = coreAPI.getProcessData(buildingId, processId);

    if (!processData) {
        return (<b>no process data found</b>)
    }

    const outputs = processData.outputs.map((output, idx) => {
        return (
            <p key={idx}><span className="font-bold"></span> <span
                className="text-amber-200 font-bold"> {output.id} : {output.amount}
                </span></p>
        )
    })

    return (
        <div>
            <h4>{processData.name}</h4>
            <p>{processData.description}</p>
            <p><span></span> {processData.text} </p>

            <div className="flex-grow">
                {outputs}
            </div>

            {isActive ? (
                <button onClick={onUnset}>
                    Stop Process
                </button>
            ) : (
                <button onClick={onPick}>
                    Start Process
                </button>
            )}
        </div>
    )
}