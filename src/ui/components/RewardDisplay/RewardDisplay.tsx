import type {UnlockReward} from "@/shared/types/progression.types.ts";
import {coreAPI} from "@/core/core.api.ts";

export function RewardDisplay({reward}: {reward: UnlockReward}) {
    switch (reward.type) {
        case "unlock_process":
            const processData = coreAPI.getProcessData(reward.processId)
            return (<span>Unlocks the process: <b>{processData?.name}</b></span>)
        case "unlock_building":
            const buildingData = coreAPI.building.getData(reward.buildingId)
            return (<span>Unlocks the building: <b>{buildingData?.name}</b></span>)
        default:
            return (<span>{JSON.stringify(reward)}</span>)
    }

}
