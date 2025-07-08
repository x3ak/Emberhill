import {useWarmstoneState} from "@/hooks/useWarmstoneState.ts";
import {coreAPI} from "../../../core/core.api.ts";
import StaticProgressBar from "@/components/StaticProgressBar/StaticProgressBar.tsx";
import styles from './Warmstone.module.css'
export default function Warmstone() {

    const state = useWarmstoneState();

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
            <StaticProgressBar value={progressBarValue }/>

            <div id="progress-bar" className="pt-6">
                <div className="w-full bg-gray-200 rounded-full h-3.5 dark:bg-gray-700">
                    <div
                        className="bg-purple-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                        style={{width: vitality.toString().concat("%")}}>Vitality: {vitality}%
                    </div>
                    <div>Essence: {essence}</div>
                </div>
                <button className={styles.button} onClick={handleUpgrade} disabled={!state.canLevelUp}>
                    Level Up
                </button>
            </div>
        </div>
    )
}