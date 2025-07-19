import styles from "./ProgressionList.module.css";
import {RewardDisplay} from "@/components/RewardDisplay/RewardDisplay.tsx";
import {ResourceAmountDisplay} from "@/components/ResourceAmountDisplay/ResourceAmountDisplay.tsx";
import type {ProgressionData, UnlockReward} from "@/shared/types/game.types.ts";
import IconWithAmount from "@/components/Pieces/IconWithAmount.tsx";
import xpIcon from '@/icons/xp_icon.png'
type ProgressionListProps = {
    levelReached: number;
    progression: ProgressionData;
};


export function ProgressionList({progression, levelReached}: ProgressionListProps) {
    const progressionLevels = Object.keys(progression)
        .map(levelString => parseInt(levelString, 10))
        .sort((a, b) => a - b) // sorting from lowest to highest
        .map(level => {
            const progressionData = progression[level];

            const isUnlocked = levelReached >= level;

            return (
                <div key={level} className={styles.progressionLine}>
                    <span className={styles.progressionLineItem}>{isUnlocked ? '[✅]' : '[❌]'}</span>
                    <span className={styles.progressionLineItem}>Level {level}</span>

                    <span className={styles.progressionLineItem}>
                        {progressionData.rewards.map((reward: UnlockReward, index) => (<RewardDisplay key={index} reward={reward} />))}
                    </span>

                    <div className={styles.progressionRequirements}>
                        <span className={styles.progressionLineItem}>
                            {progressionData.xp > 0 && (<span> <IconWithAmount icon={xpIcon} iconAlt="Experience" amount={progressionData.xp} /></span>) }
                        </span>

                        {progressionData.resources.length > 0 && (
                            progressionData.resources.map((resource, index) => (
                                <span className={styles.progressionLineItem} key={index}>
                                    <ResourceAmountDisplay resourceAmount={resource} showTownAmount={true} />
                                </span>
                            )))}
                    </div>

                </div>
            )
        });

    return (
        <div className={styles.progression}>
            {progressionLevels}
        </div>
    );
}