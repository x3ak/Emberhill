import { useGameState } from "../hooks/useGame"

export default function Hearhstone() {
    const gameState = useGameState();
    const vitality = (gameState.warmstone.currentVitality / gameState.warmstone.maxVitality) * 100;
    return (
        <div className="bg-zinc-800 border-2 border-purple-500 rounded-lg p-6 w-72 text-center shadow-xl">
            <h3 className="text-xl font-bold text-purple-400">The Warmstone</h3>
            <p className="text-sm text-gray-400 mt-1">Keep the stone's heart aglow!</p>
            {(vitality < 50) && <p className="text-green-400 italic h-6 my-2">Darkness gathers as the stone fades!</p>}
           <div className="pt-6">
            <div className="w-full bg-gray-200 rounded-full h-3.5 dark:bg-gray-700">
                <div className="bg-purple-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: vitality.toString().concat("%") }}>{vitality}%</div>
            </div>
            </div>
        </div >
    )
}