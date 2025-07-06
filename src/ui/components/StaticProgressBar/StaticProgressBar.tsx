import {clamp} from "@/shared/Utils.ts";
import styles from "./StaticProgressBar.module.css"

export default function StaticProgressBar({value} :{value:number}) {
    const safeValue = clamp(value, 0, 100);
    return (
        <div className={styles.container}>
           <div
               className={styles.progressBar}
               style={{width: safeValue.toString().concat("%")}} > </div>
        </div>
    )
}