import { useGameState} from "../hooks/useGame"
import ResourceDisplay from "./ResourceDisplay";

export default function ResourceBar() {
    const gameState = useGameState();

    return (
        <header className="bg-zinc-800 border-b-2 border-zinc-700 p-3 flex justify-center gap-8 shadow-md">
            <ResourceDisplay name="Gold" amount={gameState.resources.gold}/>
            <ResourceDisplay name="Oak Log" amount={gameState.resources.log_oak}/>

        </header>
    )
}