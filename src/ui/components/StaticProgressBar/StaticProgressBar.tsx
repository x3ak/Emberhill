import {clamp} from "@/shared/Utils.ts";
import styles from "./StaticProgressBar.module.css"

type props = {
    value: number,
    height?: string
}

export default function StaticProgressBar({value, height='24'} : props) {
    const safeValue = clamp(value, 0, 100);
    return (
        <div className={styles.container} style={{height: height}}>
           <div
               className={styles.progressBar}
               style={{width: safeValue.toString().concat("%")}} > </div>
        </div>
    )
}