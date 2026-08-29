import type { EditorAdapter } from "../types";

/**
 * Helper con inferenza di tipo per costruire un adapter conforme al
 * contratto EditorAdapter. Le istanze concrete (MappaViva, Safe Drive Lab...)
 * restano nei rispettivi repository: qui vive solo il contratto.
 */
export function defineAdapter<TAdapter extends EditorAdapter>(adapter: TAdapter): TAdapter {
  return adapter;
}
