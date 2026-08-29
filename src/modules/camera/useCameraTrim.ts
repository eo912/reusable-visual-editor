import { useCallback, useEffect, useState } from "react";
import { useEditorContext } from "../../core/EditorProvider";
import type { LayoutKey } from "../../types";
import { clampTrim } from "./applyCameraTrim";
import { NO_TRIM, type CameraTrim, type CameraTrimLimits } from "./types";

type Store = Partial<Record<LayoutKey, Partial<Record<string, CameraTrim>>>>;

const DOMAIN = "camera-trim";

/**
 * Correttivo camera per scena (id generico) e layout corrente. `sceneId` non
 * è più un union fisso "intro"|"journey": lo definisce l'adapter.
 */
export function useCameraTrim(sceneId: string, builtin: CameraTrim = NO_TRIM, limits?: CameraTrimLimits) {
  const { adapter, layout, editingEnabled } = useEditorContext();
  const backend = adapter.persistence.backend;
  const [store, setStore] = useState<Store>({});

  useEffect(() => {
    if (!editingEnabled) return;
    setStore(backend.read(DOMAIN) as Store);
    return backend.subscribe(() => setStore(backend.read(DOMAIN) as Store));
  }, [backend, editingEnabled]);

  const trim = editingEnabled
    ? clampTrim(store[layout]?.[sceneId] ?? builtin, limits)
    : clampTrim(builtin, limits);

  const setTrim = useCallback(
    (next: Partial<CameraTrim>) => {
      if (!editingEnabled) return;
      setStore((prev) => {
        const current = clampTrim(prev[layout]?.[sceneId] ?? builtin, limits);
        const merged = clampTrim({ ...current, ...next }, limits);
        const out = { ...prev, [layout]: { ...(prev[layout] ?? {}), [sceneId]: merged } };
        backend.write(DOMAIN, out as Record<string, unknown>);
        return out;
      });
    },
    [backend, builtin, editingEnabled, layout, limits, sceneId],
  );

  const resetTrim = useCallback(() => {
    if (!editingEnabled) return;
    setStore((prev) => {
      const scenes = { ...(prev[layout] ?? {}) };
      delete scenes[sceneId];
      const out = { ...prev, [layout]: scenes };
      backend.write(DOMAIN, out as Record<string, unknown>);
      return out;
    });
  }, [backend, editingEnabled, layout, sceneId]);

  return { trim, setTrim, resetTrim };
}
