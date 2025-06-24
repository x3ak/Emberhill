import {useGameDispatch, useGameState} from "../hooks/useGame.ts";

export default function Building({buildingId}: { buildingId: string }) {

    const gameDispatch = useGameDispatch();
    const gameState = useGameState();
    let buildingState = gameState.buildings[buildingId];
    const assignWisp = () => {
        gameDispatch({type: 'ASSIGN_WISP', payload: {buildingId: buildingId}});
    }
    const unassignWisp = () => {
        gameDispatch({type: 'UNASSIGN_WISP', payload: {buildingId: buildingId}});
    }

    return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 w-56 text-center shadow-lg">
            <h3 className="text-lg font-bold text-yellow-400">{buildingId} (Lvl {buildingState?.level})</h3>
            <p className="text-sm text-gray-400 mt-1">Generates: {buildingState?.production.amount} {buildingState?.production.resource}/sec</p>
            <p className="text-green-400 italic h-6 my-2">{buildingState?.wispAssigned ? 'assigned' : 'unassigned'}</p>

            {buildingState?.wispAssigned && (
                <button onClick={unassignWisp}
                        className="bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded w-full">Unassign
                    wisp</button>
            )}

            {!buildingState?.wispAssigned && (
                <button onClick={assignWisp}
                        className="bg-yellow-500 text-zinc-900 font-bold py-2 px-4 rounded w-full">Assign wisp</button>
            )}

        </div>
    )
}