import { useGameState} from "../hooks/useGame"
import ResourceDisplay from "./ResourceDisplay.tsx";
import {coreAPI} from "../core/core.api.ts";
import {AllResourceIds} from "@/shared/types/resource.types.ts";

export default function ResourceBar() {
    const gameState = useGameState();

    let resourcesList = AllResourceIds.map((resourceId) => {
        return (
            <ResourceDisplay name={coreAPI.getResourceData(resourceId).name} amount={gameState.resources[resourceId]}/>
        )
    })

    return (
        <header className="bg-zinc-800 border-b-2 border-zinc-700 p-3 flex justify-center gap-8 shadow-md">

            {resourcesList}

        </header>
    )
}