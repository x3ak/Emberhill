import {useGameDispatch, useGameState} from "../hooks/useGame"
import ResourceDisplay from "./ResourceDisplay";

export default function ResourceBar() {
    const gameState = useGameState();
    const gameDispatch = useGameDispatch();


    const startBurning = () => {
        gameDispatch({type: 'START_PROCESS', payload: {buildingId: 'warmstone', processId: 'burn_log_oak'}})
    }

    return (
        <header className="bg-zinc-800 border-b-2 border-zinc-700 p-3 flex justify-center gap-8 shadow-md">
            <ResourceDisplay name="gold" amount={gameState.resources.gold}/>
            <ResourceDisplay name="lumber" amount={gameState.resources.log_oak}/>

            <button onClick={startBurning}>Start burning oak log</button>
        </header>
    )
}