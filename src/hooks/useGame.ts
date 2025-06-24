import {useSyncExternalStore} from "react";
import {game, type GameAction, type GameState} from "../core/engine";

export type Dispatch = (action: GameAction) => void;

export function useGameState(): GameState {
    return useSyncExternalStore(
        game.subscribe.bind(game),
        game.getState.bind(game)
    );
}

export function useGameDispatch(): Dispatch {
    return game.dispatch.bind(game);
}