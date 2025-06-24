import { useSyncExternalStore } from "react";
import { game } from "../core/engine";

export function useGame() {
  return useSyncExternalStore(
    game.subscribe.bind(game), 
    game.getState.bind(game)
  );
}