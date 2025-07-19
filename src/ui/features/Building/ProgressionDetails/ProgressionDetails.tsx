import type {BuildingLevelUp, UnlockReward} from "@/shared/types/game.types.ts";
import styles from "@/features/Building/ProgressionList/ProgressionList.module.css";
import {RewardDisplay} from "@/components/RewardDisplay/RewardDisplay.tsx";
import IconWithAmount from "@/components/Pieces/IconWithAmount.tsx";
import xpIcon from "@/icons/xp_icon.png";
import {ResourceAmountDisplay} from "@/components/ResourceAmountDisplay/ResourceAmountDisplay.tsx";

export default function ProgressionDetails({levelUpData}: { levelUpData: BuildingLevelUp }) {

    return (<div>

        <h1>Requires</h1>
        <div className={styles.progressionRequirements}>
            <span className={styles.progressionLineItem}>
                {levelUpData.xp > 0 && (<span> <IconWithAmount icon={xpIcon} iconAlt="Experience"
                                                               amount={levelUpData.xp}/></span>)}
            </span>

            {levelUpData.resources.length > 0 && (
                levelUpData.resources.map((resource, index) => (
                    <span className={styles.progressionLineItem} key={index}>
                        <ResourceAmountDisplay resourceAmount={resource} showTownAmount={true}/>
                    </span>
                ))
            )}
        </div>

        <h1>Grants</h1>
        <span className={styles.progressionLineItem}>
            {levelUpData.rewards.map((reward: UnlockReward, index) => (
                <RewardDisplay key={index} reward={reward}/>))}
        </span>

    </div>)
}