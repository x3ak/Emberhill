import {useState} from "react";
import {coreAPI} from "@/core/core.api.ts";
import {ProgressionList} from "@/features/Building/ProgressionList/ProgressionList.tsx";

import type {BuildingLevelUp, BuildingState} from "@/shared/types/game.types.ts";
import styles from "./Building.module.css"
import ProgressionDetails from "@/features/Building/ProgressionDetails/ProgressionDetails.tsx";

export default function BuildingProgression({buildingState}:
                                            { buildingState: BuildingState }) {

    const [levelUpData, setLevelUpData] = useState<BuildingLevelUp>();
    const buildingData = coreAPI.building.getData(buildingState.id);
    const currentLevelUpData = buildingData.progression[buildingState.level + 1] || null;

    const levelUpHandler = () => {
        coreAPI.building.upgrade(buildingState.id);
    }

    return (<div className={styles.progression}>

        {currentLevelUpData && (
            <button onClick={levelUpHandler} disabled={!buildingState.canLevelUp}>UPGRADE</button>)}


        <ProgressionList levelReached={buildingState.level} progression={buildingData.progression}
                         setLevelUpData={setLevelUpData}/>
        <div className={styles.progressionListDetails}>
            {levelUpData && <ProgressionDetails levelUpData={levelUpData}/>}
        </div>

    </div>)
}
