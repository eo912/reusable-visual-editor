import type { AssetSource } from "../../types";

/**
 * Punto di estensione documentato: il Core non scansiona mai cartelle né
 * bundler-specific API (es. import.meta.glob). Ogni progetto implementa la
 * propria enumerazione (Vite glob, fetch, cartella condivisa, Drive...).
 */
export function defineAssetSource(source: AssetSource): AssetSource {
  return source;
}
