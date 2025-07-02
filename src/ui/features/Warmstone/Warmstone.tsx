import {useGameState} from "../../../hooks/useGame.ts"

export default function Warmstone() {
    const gameState = useGameState();

    const vitality = Math.floor((gameState.warmstone.currentVitality / gameState.warmstone.maxVitality) * 100);
    let progressbarText;
    if (vitality > 50) {
        progressbarText = "A defiant blaze against the gloom."
    }
    if (vitality < 50) {
        progressbarText = "Darkness gathers as the stone fades!"
    }
    if (vitality < 10) {
        progressbarText = "When the final ember dies, a shadow on thy spirit lies."
    }
    if (vitality <= 0) {
        progressbarText = "The final spark has fled, leaving naught but shadow's dread."
    }

    function LevelUpHandler() {
        console.log("clicked")
    }

    return (
        <div className="bg-zinc-800 border-2 border-purple-500 rounded-lg p-6 w-72 text-center shadow-xl">
            <h3 className="text-xl font-bold text-purple-400">The Warmstone</h3>
            <p className="text-sm text-gray-400 mt-2">Next Lvl: 400 Wood, 200 Stone</p>
            <p className="text-sm text-yellow-400 mt-2">Keep the stone's heart aglow!</p>
            <p className="text-green-400 italic h-6 my-2">{progressbarText}</p>


            <div id="progress-bar" className="pt-6">
                <div className="w-full bg-gray-200 rounded-full h-3.5 dark:bg-gray-700">
                    <div
                        className="bg-purple-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                        style={{width: vitality.toString().concat("%")}}>{vitality}%
                    </div>
                </div>
                <button
                    className="bg-purple-600 text-white font-bold py-2 px-6 rounded mt-4 w-full disabled:bg-zinc-600 disabled:cursor-not-allowed"
                    onClick={LevelUpHandler}>
                    Level Up
                </button>
            </div>
        </div>
    )
}