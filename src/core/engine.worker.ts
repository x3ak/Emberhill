import {gameInstance} from "./engine.ts";
import type {PlayerCommand} from "@/shared/types/player.commands.ts";

console.log("Game Worker thread started.");



self.onmessage = (event: MessageEvent<PlayerCommand>) => {
    if(event.data.type == "REQUEST_INITIAL_STATE") {
        self.postMessage({
            type: "INITIAL_STATE",
            payload: gameInstance.computeFullGameSnapshot(),
        })

        return;
    }

    gameInstance.dispatch(event.data)
}

gameInstance.start();

gameInstance.getBuildings().forEach(building => {
    building.subscribe(() => {
        self.postMessage({
            type: "BUILDING_UPDATE",
            payload: building.getSnapshot(),
        })
    })

    building.getProcesses().forEach(process => {
        process.subscribe(() => {
            self.postMessage({
                type: "PROCESS_UPDATE",
                payload: process.getSnapshot(),
            })
        })
    });
});

gameInstance.resources.subscribe(() => {
    self.postMessage({
        type: "RESOURCE_UPDATE",
        payload: gameInstance.resources.getSnapshot(),
    })
})

gameInstance.warmstone.subscribe(() => {
    self.postMessage({
        type: "WARMSTONE_UPDATE",
        payload: gameInstance.warmstone.getSnapshot(),
    })
})