
# Project Architecture Documentation

This document outlines the architecture of the Emberhill game, focusing on the connection between the core game logic and the user interface.

## Core Game Logic

The core game logic is encapsulated within the `Engine` class, located in `src/core/engine.ts`. This class is the central hub for managing the game state, processing game events, and executing game commands.

### Key Components of the Core Logic:

*   **`Engine` (`src/core/engine.ts`):** The main game engine. It holds the game state, including information about buildings, resources, and wisps. It also contains the main game loop and command handler.
*   **Game Data (`src/core/data/`):** This directory contains the static data for the game, such as building specifications, resource types, and production processes.
*   **Commands (`src/core/commands.ts`):** Defines the commands that can be executed to change the game state. These commands are dispatched from the UI and handled by the `Engine`.
*   **Core API (`src/core/core.api.ts`):** This file defines the `CoreApi` interface, which exposes the core game logic to the UI. The `Engine` class implements this interface.

## User Interface (UI)

The UI is built using React and is located in the `src/ui/` directory. It is responsible for rendering the game state and providing a way for the user to interact with the game.

### Key Components of the UI:

*   **`App.tsx` (`src/ui/App.tsx`):** The root component of the React application. It sets up the main layout and routing.
*   **`useGame.ts` (`src/hooks/useGame.ts`):** This custom React hook is the primary bridge between the UI and the core game logic. It creates an instance of the `Engine` and provides it to the UI components through a React Context. This allows any component in the application to access the game state and dispatch commands.
*   **UI Components (`src/ui/components/` and `src/ui/features/`):** These are the individual React components that make up the UI. They use the `useGame` hook to get the current game state and render it. They also dispatch commands to the `Engine` in response to user actions.

## Connecting the UI and Core Logic

The connection between the UI and the core game logic is established through the `useGame` hook and the `CoreApi` interface.

1.  **Initialization:** When the application starts, the `App` component calls the `useGame` hook. This hook creates a new instance of the `Engine`.
2.  **State Management:** The `useGame` hook makes the `Engine` instance available to all UI components via a React Context. Components can then access the current game state from the `Engine`.
3.  **User Interaction:** When the user interacts with the UI (e.g., clicks a button to construct a building), the corresponding UI component dispatches a command using the `Engine`'s command handler.
4.  **Game State Updates:** The `Engine` receives the command, updates the game state accordingly, and notifies the UI of the changes.
5.  **UI Re-rendering:** The UI components, being subscribed to the game state through the `useGame` hook, automatically re-render to reflect the updated state.

This architecture creates a clear separation of concerns between the game logic and the UI, making the codebase easier to understand, maintain, and extend.
