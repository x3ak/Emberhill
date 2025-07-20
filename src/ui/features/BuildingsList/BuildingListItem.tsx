import React from 'react';
import type {BuildingId} from '@/shared/types/building.types';
import {useBuildingState} from '@/hooks/useBuildingState';
import {coreAPI} from "@/core/core.api.ts"; // Your granular hook

import wispIcon from '@/icons/wisp.png'

interface BuildingListItemProps {
    buildingId: BuildingId;
    isSelected: boolean;
    onSelect: (buildingId: BuildingId) => void;
}

export const BuildingListItem: React.FC<BuildingListItemProps> = React.memo(({
                                                                                 buildingId,
                                                                                 isSelected,
                                                                                 onSelect,
                                                                             }) => {
    const buildingState = useBuildingState(buildingId);

    const buildingData = coreAPI.building.getData(buildingId);

    if (!buildingState.isUnlocked) {
        return null;
    }

    const listItemClasses = `nav-item ${isSelected ? 'active' : ''}`;

    return (
        <li
            className={listItemClasses}
            onClick={() => onSelect(buildingId)}
        >
            {buildingState.wispAssigned ? <img src={wispIcon} alt="wisp" width="14" /> : ""}
            {buildingData.name}
            {buildingState.canLevelUp ? " 🔴 " : ""}
        </li>
    );
});