import type {ProcessId} from "@/shared/types/process.types.ts";
import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import ResourcePill from "@/components/ResourcePill/ResourcePill.tsx";

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
            <p key={idx}>
                {output.chance && (<span><b>{output.chance * 100}%</b> chance to get <b>{output.amount}</b> of <ResourcePill resourceData={resourceData} /></span>)}
                {output.chance === undefined && (<span><ResourcePill resourceData={resourceData} /> : {output.amount}</span>)}

            </p>
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