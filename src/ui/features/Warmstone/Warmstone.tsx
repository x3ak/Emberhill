import {useWarmstoneState} from "@/hooks/useWarmstoneState.ts";
import {coreAPI} from "@/core/core.api.ts";
import StaticProgressBar from "@/components/StaticProgressBar/StaticProgressBar.tsx";
import styles from './Warmstone.module.css'
import {ProgressionList} from "@/features/Building/ProgressionList/ProgressionList.tsx";
import {useState} from "react";
import type {BuildingLevelUp} from "@/shared/types/game.types.ts";

export default function Warmstone() {

    const state = useWarmstoneState();

    const [levelUpData, setLevelUpData] = useState<BuildingLevelUp>();

    const vitality = state.currentVitality;
    const essence = state.essence;

    let progressbarText;
    if (vitality > 50) {
        progressbarText = "A defiant blaze against the gloom."
    }
    if (vitality < 50) {
        progressbarText = "Darkness gathers as the stone fades!"
    }
    if (vitality < 10) {
        progressbarText = "When the final ember dies, a shadow on thy spirit lies."
    }
    if (vitality <= 0) {
        progressbarText = "The final spark has fled, leaving naught but shadow's dread."
    }

    function handleUpgrade() {
        coreAPI.upgradeWarmstone();
    }

    const progressBarValue = state.essenceForNextLevel > 0 ? (state.essence / state.essenceForNextLevel) * 100 : 0;


    return (
        <div className={styles.body}>

            <h3 className="text-xl font-bold text-purple-400">The Warmstone</h3>
            <p className="text-sm text-gray-400 mt-2">Level {state.currentLevel}</p>
            <p>Till next level: {state.essenceForNextLevel} essence</p>
            <p className="text-sm text-yellow-400 mt-2">Keep the stone's heart aglow!</p>
            <p className="text-green-400 italic h-6 my-2">{progressbarText}</p>
            <StaticProgressBar value={progressBarValue}/>

            <div id="progress-bar" className="pt-6">
                <div >
                    <div>Essence: {essence}</div>
                </div>
                <button className={styles.button} onClick={handleUpgrade} disabled={!state.canLevelUp}>
                    Level Up
                </button>
            </div>

            <ProgressionList levelReached={state.currentLevel} progression={coreAPI.getWarmstoneProgression()}
                             setLevelUpData={setLevelUpData}/>

            {JSON.stringify(levelUpData, null, 2)}
        </div>
    )
}