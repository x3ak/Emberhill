import {useGameState} from "../hooks/useGame";
import {AllBuildingIds} from "@/shared/types/building.types.ts";
import {coreAPI} from "../core/core.api.ts";

type SidebarProps = {
    onSelect: (section: string) => void;
};

export default function Sidebar({onSelect}: SidebarProps) {
    const gameState = useGameState();

    // let buildings;
    const buildings = AllBuildingIds.map((buildingId: BuildingId) => {
        const buildingData = coreAPI.getBuildingData(buildingId);
        return (

            <button
                key={buildingId}
                onClick={() => onSelect(buildingId)}
                className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition"
            >
                {buildingData.name}
            </button>
        )
    })
    return (
        <nav className="flex flex-col gap-4">
            {buildings}
        </nav>
    );
}