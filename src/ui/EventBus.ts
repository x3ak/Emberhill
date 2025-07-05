type Listener<T> = (data: T) => void;

export class EventBus<TEventMap extends Record<string, any>> {
    private listeners: { [K in keyof TEventMap]?: Set<Listener<TEventMap[K]>> } = {};

    /**
     * Subscribes a listener to a specific event topic.
     * @param event The topic to listen to (e.g., 'building-sawmill').
     * @param listener The function to call when the event is published.
     * @returns An unsubscribe function.
     */
    public on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): () => void {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
        }
        this.listeners[event]!.add(listener);

        return () => {
            this.listeners[event]!.delete(listener);
        };
    }

    /**
     * Publishes data to all listeners of a specific event topic.
     * @param event The topic to publish to.
     * @param data The data to send to the listeners.
     */
    public emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void {
        const eventListeners = this.listeners[event];
        if (eventListeners) {
            eventListeners.forEach(listener => listener(data));
        }
    }
}