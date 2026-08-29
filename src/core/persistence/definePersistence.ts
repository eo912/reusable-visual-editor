import type { PersistenceBackend, PersistenceConfig } from "../../types";
import { createLocalStorageBackend } from "./localStorageBackend";

/** Se non viene fornito un backend, usa localStorage namespaced come default. */
export function definePersistence(config: {
  namespace: string;
  backend?: PersistenceBackend;
}): PersistenceConfig {
  return {
    namespace: config.namespace,
    backend: config.backend ?? createLocalStorageBackend(config.namespace),
  };
}
