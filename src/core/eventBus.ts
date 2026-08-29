export type Listener = () => void;

/** Pub/sub minimale in-memory, riusato da persistence e da modules/interaction. */
export function createEventBus() {
  const listeners = new Set<Listener>();
  return {
    emit() {
      for (const l of listeners) l();
    },
    subscribe(cb: Listener) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
  };
}

export type EventBus = ReturnType<typeof createEventBus>;
