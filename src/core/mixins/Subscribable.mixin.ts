type Constructor<T = {}> = new (...args: any[]) => T;

export function Subscribable<TState, TBase extends Constructor>(Base: TBase) {
    abstract class Subscribable extends Base {
        protected listeners = new Set<() => void>();
        protected hasChanged = false;
        protected cachedSnapshot: TState | undefined = undefined;

        public subscribe(onStoreChange: () => void): () => void {
            this.listeners.add(onStoreChange);
            return () => this.listeners.delete(onStoreChange)
        }

        public postUpdate() {
            if (this.hasChanged) {
                this.listeners.forEach(listener => listener());
            }
        }

        protected setDirty() {
            this.hasChanged = true;
        }

        public getSnapshot() {
            if (!this.hasChanged && this.cachedSnapshot) {

                return this.cachedSnapshot;
            }

            this.cachedSnapshot = this.computeSnapshot();
            this.hasChanged = false;

            return this.cachedSnapshot;
        }

        protected abstract computeSnapshot(): TState;

    }

    return Subscribable;
}

export class EmptyBase {}