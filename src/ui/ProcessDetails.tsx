import type {ProcessId} from "@/shared/types/process.type.ts";
import {coreAPI} from "../core/core.api.ts";

type ProcessDetailsProps = {
    processId: ProcessId;
    onClose: () => void;
    onPick: () => void;
};

export default function ProcessDetails({ processId, onClose, onPick }: ProcessDetailsProps) {

    const processData = coreAPI.getProcessData(processId);

    const outputs = processData.outputs.map(output => {
        return (
            <p><span className="font-bold"></span> <span className="text-amber-200 font-bold"> {output.id} :  {output.amount}
                </span></p>
        )
    })

    return (
        <div className="mt-0 p-4 bg-zinc-700 rounded-lg shadow-lg w-64 h-fit text-sm text-gray-200 relative z-99">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              X  
            </button>
            <h4 className="text-yellow-300 font-semibold mb-2">{processData.name}</h4>
            
            <p>{processData.description}</p>
            <p className="text-yellow-300 font-normal mb-2 pt-3"><span ></span> {processData.text} </p>

            {outputs}
            <button onClick={onPick} className="hover:text-amber-600">Start Process</button>
            
            {/* Add more fields here */}
        </div>

    )
}