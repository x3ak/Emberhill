import type {ProcessData} from "@/shared/types/process.type.ts";
import styles from "./ProcessTile.module.css";


export default function ProcessTile({processData, isActive, setSelectedProcess}: {
    processData: ProcessData,
    isActive: boolean,
    setSelectedProcess: any
}) {
    return (
        <div
            key={processData.id}
            className={`${styles.tile} ${isActive ? styles.active : ''}`}
            onClick={() => setSelectedProcess(processData.id)}

        >
            {processData.name}
        </div>
    )
}