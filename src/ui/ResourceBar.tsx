import { useGameState} from "../hooks/useGame"
import ResourceDisplay from "./ResourceDisplay.tsx";

export default function ResourceBar() {
    const gameState = useGameState();


    return (
        <header className="bg-zinc-800 border-b-2 border-zinc-700 p-3 flex justify-center gap-8 shadow-md">
            <ResourceDisplay name="Oak Log" amount={gameState.resources.LOG_OAK}/>
            <ResourceDisplay name="Birch Log" amount={gameState.resources.LOG_BIRCH}/>

        </header>
    )
}