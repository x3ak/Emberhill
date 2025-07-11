import type {BuildingState} from "@/shared/types/building.types.ts";
import {coreAPI} from "@/core/core.api.ts";
import {ProgressionList} from "@/components/ProgressionList/ProgressionList.tsx";

export default function BuildingProgression ({buildingState}:
{buildingState: BuildingState}) {

    const buildingData = coreAPI.building.getData(buildingState.id);
    const levelUpData = buildingData.progression[buildingState.level + 1] || null;

    const levelUpHandler = () => {
        coreAPI.building.upgrade(buildingState.id);
    }

    return (<div>

        {levelUpData && (
            <button onClick={levelUpHandler} disabled={!buildingState.canLevelUp}>UPGRADE</button>)}

        <ProgressionList levelReached={buildingState.level} progression={buildingData.progression} />

    </div>)
}
