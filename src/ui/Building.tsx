export default function Building({ buildingId }: {buildingId: string}) {
    
    return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 w-56 text-center shadow-lg">
            <h3 className="text-lg font-bold text-yellow-400">{buildingId} (Lvl 12)</h3>
            <p className="text-sm text-gray-400 mt-1">Generates: 33 Wood/sec</p>
            <p className="text-green-400 italic h-6 my-2">[Wisp Assigned]</p>
            <button className="bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded w-full">Unassign Wisp</button>
        </div>
    )
}