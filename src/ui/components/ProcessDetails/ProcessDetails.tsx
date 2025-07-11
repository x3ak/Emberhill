import type {ProcessId} from "@/shared/types/process.types.ts";
import {coreAPI} from "@/core/core.api.ts";
import {ResourceAmountDisplay} from "@/components/ResourceAmountDisplay/ResourceAmountDisplay.tsx";

type ProcessDetailsProps = {
    processId: ProcessId;
};

export default function ProcessDetails({processId}: ProcessDetailsProps) {

    const processData = coreAPI.getProcessData(processId);

    if (!processData) {
        return (<b>no process data found</b>)
    }

    const outputs = processData.outputs.map((output, idx) => {
        return (
            <p key={idx}>
                {output.chance && (<span><b>{output.chance * 100}%</b> chance to get <ResourceAmountDisplay resourceAmount={output} /></span>)}
                {output.chance === undefined && (<ResourceAmountDisplay resourceAmount={output} />)}

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