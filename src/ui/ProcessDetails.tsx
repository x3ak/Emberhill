type Process = {

    name: string;
    description: string;
    duration: number;

    // Add other fields if needed
};

type ProcessDetailsProps = {
    process: Process;
    output: {
        type: string;
        id: string;
        amount: number
    };
    onClose: () => void;
};

export default function ProcessDetails({ process, onClose, output }: ProcessDetailsProps) {
    return (
        <div className="mt-0 p-4 bg-zinc-700 rounded-lg shadow-lg w-64 h-fit text-sm text-gray-200 relative z-99">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
                
            </button>
            <h4 className="text-yellow-300 font-semibold mb-2">{process.name}</h4>
            
            <p>{process.description}</p>
            <p className="text-yellow-300 font-normal mb-2 pt-3"><span ></span> The forest offers: </p>

            {output &&
                <p><span className="font-bold"></span> <span className="text-amber-200 font-bold"> {output.id} :  {output.amount}
                </span></p>

            }

            {/* Add more fields here */}
        </div>

    )
}