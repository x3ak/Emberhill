import type {ProcessId} from "@/shared/types/process.type.ts";
import {coreAPI} from "../core/core.api.ts";

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
        <div className="h-full flex flex-col">
            <h4 className="text-xl font-bold text-yellow-400 mb-2">{processData.name}</h4>
            <p className="text-gray-300 mb-4">{processData.description}</p>
            <p className="text-yellow-300 font-normal mb-2 pt-3"><span></span> {processData.text} </p>

            <div className="flex-grow">
                {outputs}
            </div>

            {isActive ? (
                <button onClick={onUnset}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 mt-4">
                    Stop Process
                </button>
            ) : (
                <button onClick={onPick}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 mt-4">
                    Start Process
                </button>
            )}
        </div>
    )
}