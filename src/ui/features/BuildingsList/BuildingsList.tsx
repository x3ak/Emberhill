import {AllBuildingIds, type BuildingId} from "@/shared/types/building.types.ts";

import type {MainContentSection} from "@/features/MainContentArea/MainContentArea.tsx";
import {BuildingListItem} from "@/features/BuildingsList/BuildingListItem.tsx";

type BuildingListProps = {
    onSelect: (buildingId: BuildingId) => void;
    activeSection : MainContentSection;
};

export default function BuildingsList({onSelect, activeSection}: BuildingListProps) {

    const buildings = AllBuildingIds.map((buildingId: BuildingId) => {
        const isSelected = activeSection.type === 'building' && activeSection.buildingId === buildingId;

        return (
            <BuildingListItem key={buildingId} buildingId={buildingId} isSelected={isSelected} onSelect={onSelect} />

        )
    })
    return (
        <ul className="nav-list">
            {buildings}
        </ul>
    );
}