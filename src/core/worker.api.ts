import type {PlayerCommand} from "@/shared/types/player.commands.ts";
import type {WorkerEvent} from "@/shared/types/worker.events.ts";

const gameWorker = new Worker(new URL('./engine.worker.ts', import.meta.url), {
    type: 'module',
});

export const workerAPI = {
    // Renamed for clarity
    subscribeToEvents(callback: (event: WorkerEvent) => void) {
        gameWorker.onmessage = (msg: MessageEvent<WorkerEvent>) => {
            callback(msg.data);
        };
    },

    requestInitialState() {
        gameWorker.postMessage({type: "REQUEST_INITIAL_STATE"});
    },

    dispatch(action: PlayerCommand) {
        console.log(`---> ${action.type}`);
        gameWorker.postMessage(action);
    },
};