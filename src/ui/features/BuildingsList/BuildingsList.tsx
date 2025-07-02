import {AllBuildingIds, type BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "../../../core/core.api.ts";
import {useGameState} from "../../../hooks/useGame.ts";

import type {MainContentSection} from "@/features/MainContentArea/MainContentArea.tsx";

type BuildingListProps = {
    onSelect: (buildingId: BuildingId) => void;
    activeSection : MainContentSection;
};

export default function BuildingsList({onSelect, activeSection}: BuildingListProps) {
    const gameState = useGameState();

    const buildings = AllBuildingIds.map((buildingId: BuildingId) => {
        const buildingData = coreAPI.building.getData(buildingId);
        const buildingState = gameState.buildings.get(buildingId);
        const isWispAssigned = buildingState?.wispAssigned || false;
        const isSelected = activeSection.type === 'building' && activeSection.buildingId === buildingId;

        const listItemClasses = `nav-item ${isSelected ? 'active' : ''}`;

        return (
            <li key={buildingId} className={listItemClasses} onClick={() => {onSelect(buildingId)} }>
                {buildingData.name}

                {isWispAssigned && (" [wispAssigned]")}
            </li>

        )
    })
    return (
        <ul className="nav-list">
            {buildings}
        </ul>
    );
}