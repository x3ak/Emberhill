import {AllBuildingIds, type BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../core/core.api.ts";
import {useGameState} from "../hooks/useGame.ts";

type SidebarProps = {
    onSelect: (section: string) => void;
    activeSection: string;
};

export default function Sidebar({onSelect, activeSection}: SidebarProps) {
    const gameState = useGameState();

    const buildings = AllBuildingIds.map((buildingId: BuildingId) => {
        const buildingData = coreAPI.building.getData(buildingId);
        const buildingState = gameState.buildings.get(buildingId);
        const isWispAssigned = buildingState?.wispAssigned || false;
        const isSelected = activeSection === buildingId;

        const buttonClasses = `px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600 transition ${
            isWispAssigned ? 'animated-background' : ''
        } ${
            isSelected ? 'border-2 border-yellow-400' : 'border-2 border-transparent'
        }`;

        return (

            <button
                key={buildingId}
                onClick={() => onSelect(buildingId)}
                className={buttonClasses}
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