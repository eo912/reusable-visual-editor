import { createEventBus } from "../eventBus";
import type { PersistenceBackend } from "../../types";

const bus = createEventBus();

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Backend di default: localStorage namespaced + sync same-tab via eventBus e
 * cross-tab via l'evento nativo "storage". Nessuna dipendenza esterna.
 */
export function createLocalStorageBackend(namespace: string): PersistenceBackend {
  const storageKey = (key: string) => `${namespace}:${key}`;

  return {
    read(key) {
      if (!isBrowser()) return {};
      try {
        const raw = window.localStorage.getItem(storageKey(key));
        if (!raw) return {};
        const parsed: unknown = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
      } catch {
        return {};
      }
    },
    write(key, value) {
      if (!isBrowser()) return;
      try {
        window.localStorage.setItem(storageKey(key), JSON.stringify(value));
      } catch {
        // storage non disponibile: si prosegue con i soli valori in memoria
      }
      bus.emit();
    },
    subscribe(cb) {
      if (!isBrowser()) return () => {};
      const unsubscribeBus = bus.subscribe(cb);
      window.addEventListener("storage", cb);
      return () => {
        unsubscribeBus();
        window.removeEventListener("storage", cb);
      };
    },
  };
}
