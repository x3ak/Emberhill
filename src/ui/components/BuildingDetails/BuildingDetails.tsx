import type {BuildingId} from "@/shared/types/building.types.ts";
import {coreAPI} from "@/core/core.api.ts";
import styles from './BuildingDetails.module.css'
import {useBuildingState} from "@/hooks/useBuildingState.ts";
import StaticProgressBar from "@/components/StaticProgressBar/StaticProgressBar.tsx";
import {motion} from "framer-motion";

export default function BuildingDetails({buildingId}: {
    buildingId: BuildingId,
}) {

    const buildingState = useBuildingState(buildingId);
    const buildingData = coreAPI.building.getData(buildingId);

    const handleWispToggle = () => {
        if (buildingState?.wispAssigned) {
            coreAPI.building.unassignWisp(buildingId)
        } else {
            coreAPI.building.assignWisp(buildingId)
        }
    }

    const levelUpData = buildingData.progression[buildingState.level + 1] || null;
    const progressToNextLevel = levelUpData ? buildingState.xp / levelUpData.xp * 100 : 0;

    return (
        <div className={styles.buildingDetails}>
            <div>
                <h3 className={styles.name}>{buildingData.name} - Level {buildingState?.level}</h3>

                <div>
                    <StaticProgressBar value={progressToNextLevel} height='8px'/>
                </div>
                {levelUpData && (<ul className={styles.properties}>
                    <li className={styles.propertyLine}>
                        <label>XP: </label>
                        <b>{buildingState?.xp} / {buildingData.progression[buildingState.level + 1]?.xp}</b>
                    </li>
                </ul>)}


            </div>
            <div className={styles.buildingActions}>
                <motion.div className={styles.toggleContainer}
                            whileTap={{scale: 1.05}}>
                    <input

                        type="checkbox"
                        id={`wisp-toggle-${buildingId}`}
                        className={styles.toggleInput}
                        checked={buildingState?.wispAssigned}
                        onChange={handleWispToggle}
                    />
                    <label
                        htmlFor={`wisp-toggle-${buildingId}`}
                        className={styles.toggleLabel}
                        data-on="Assigned"
                        data-off="Unassigned"
                    >
                        Wisp
                    </label>
                </motion.div>

            </div>
        </div>

    );
}