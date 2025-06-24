import {useGameState} from "../hooks/useGame"
import ResourceDisplay from "./ResourceDisplay";

export default function ResourceBar() {
    const gameState = useGameState();

    return (
        <header className="bg-zinc-800 border-b-2 border-zinc-700 p-3 flex justify-center gap-8 shadow-md">
            <ResourceDisplay name="gold" amount={gameState.resources.gold}/>
            <ResourceDisplay name="lumber" amount={gameState.resources.lumber}/>
            <ResourceDisplay name="tools" amount={gameState.resources.tools}/>
            <ResourceDisplay name="stone" amount={gameState.resources.stone}/>
        </header>
    )
}