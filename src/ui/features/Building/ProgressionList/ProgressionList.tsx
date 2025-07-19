import styles from "./ProgressionList.module.css";
import {RewardDisplay} from "@/components/RewardDisplay/RewardDisplay.tsx";
import type {BuildingLevelUp, ProgressionData, UnlockReward} from "@/shared/types/game.types.ts";

type ProgressionListProps = {
    levelReached: number;
    progression: ProgressionData;
    setLevelUpData: (levelUpData: BuildingLevelUp) => void;
};


export function ProgressionList({progression, levelReached, setLevelUpData}: ProgressionListProps) {
    const progressionLevels = Object.keys(progression)
        .map(levelString => parseInt(levelString, 10))
        .sort((a, b) => a - b) // sorting from lowest to highest
        .map(level => {
            const progressionData = progression[level];

            const isUnlocked = levelReached >= level;

            return (
                <div key={level} className={styles.progressionLine} onClick={() => {
                    setLevelUpData(progressionData)
                }}>
                    <span className={styles.progressionLineItem}>{isUnlocked ? '[✅]' : '[❌]'}</span>
                    <span className={styles.progressionLineItem}>Level {level}</span>

                    <span className={styles.progressionLineItem}>
                        {progressionData.rewards.map((reward: UnlockReward, index) => (
                            <RewardDisplay key={index} reward={reward}/>))}
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