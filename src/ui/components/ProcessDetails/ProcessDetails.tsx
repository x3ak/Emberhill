import type {ProcessId} from "@/shared/types/process.type.ts";
import {coreAPI} from "../../../core/core.api.ts";

type ProcessDetailsProps = {
    processId: ProcessId;
    onPick: () => void;
    onUnset: () => void;
    isActive: boolean;
};

export default function ProcessDetails({processId, onPick, onUnset, isActive}: ProcessDetailsProps) {

    const processData = coreAPI.getProcessData(processId);

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