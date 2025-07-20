import type {ProcessId} from "@/shared/types/processes.types.ts";
import {coreAPI} from "@/core/core.api.ts";
import {ResourceAmountDisplay} from "@/components/ResourceAmountDisplay/ResourceAmountDisplay.tsx";
import processingIcon from "@/icons/processing.png"
import xpIcon from "@/icons/xp_icon.png"
import styles from "./ProcessDetails.module.css";
import IconWithAmount from "@/components/Pieces/IconWithAmount.tsx";

type ProcessDetailsProps = {
    processId: ProcessId;
};


export default function ProcessDetails({processId}: ProcessDetailsProps) {

    const processData = coreAPI.getProcessData(processId);

    if (!processData) {
        return (<b>no process data found</b>)
    }

    const renderInputs = () => {
        return processData.inputs.map((input, index) => {
            return (
                <div key={index}>
                    <ResourceAmountDisplay resourceAmount={input} showTownAmount={true}  />
                </div>
            )
        })
    }

    const outputs = processData.outputs.map((output, idx) => {
        return (
            <div key={idx}>
                {/*{output.chance && (<span><b>{output.chance * 100}%</b> chance to get <ResourceAmountDisplay resourceAmount={output} /></span>)}*/}
                {output.chance === undefined && (<ResourceAmountDisplay resourceAmount={output} showOnlyDescription={true} />)}

            </div>
        )
    });

    return (
        <div>
            <h4>{processData.name}</h4>
            <p>{processData.description}</p>
            <p><span></span> {processData.text} </p>
            <h1>Inputs</h1>
            <div className={styles.inputs}>
                {renderInputs()}
            </div>
            <h1>Outputs</h1>
            <div className={styles.output}>
                <IconWithAmount icon={processingIcon} iconAlt={"Processing..."} amount={processData.duration} />
                <IconWithAmount icon={xpIcon} iconAlt={"Experience"} amount={processData.xp} />

                {outputs}
            </div>
        </div>
    )
}