import type {ProcessId} from "@/shared/types/process.types.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";

type ProcessDetailsProps = {
    buildingId: BuildingId;
    processId: ProcessId;
};

export default function ProcessDetails({buildingId, processId}: ProcessDetailsProps) {

    const processData = coreAPI.getProcessData(buildingId, processId);

    if (!processData) {
        return (<b>no process data found</b>)
    }

    const outputs = processData.outputs.map((output, idx) => {
        const resourceData = coreAPI.getResourceData(output.id);
        return (
            <p key={idx}><span className="font-bold"></span> <span
                className="text-amber-200 font-bold"> {resourceData.name} : {output.amount}
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
        </div>
    )
}