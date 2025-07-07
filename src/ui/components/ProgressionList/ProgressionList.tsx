import type {ProgressionData, UnlockReward} from "@/shared/types/progression.types.ts";
import styles from "./ProgressionList.module.css";
import {RewardDisplay} from "@/components/RewardDisplay/RewardDisplay.tsx";
import {ResourceAmountDisplay} from "@/components/ResourceAmountDisplay/ResourceAmountDisplay.tsx";

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
                        {progressionData.xp > 0 && (<span >XP Required: {progressionData.xp}</span>) }
                    </span>
                    <span className={styles.progressionLineItem}>
                    {progressionData.resources.length > 0 && (
                        progressionData.resources.map((resource, index) => (<ResourceAmountDisplay key={index} resourceAmount={resource} />)))}
                    </span>
                    <span className={styles.progressionLineItem}>
                        {progressionData.rewards.map((reward: UnlockReward, index) => (<RewardDisplay key={index} reward={reward} />))}
                    </span>
                </div>
            )
        });

    return (
        <div className={styles.progression}>
            {progressionLevels}
        </div>
    );
}