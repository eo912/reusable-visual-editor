import { useCallback, useEffect, useState } from "react";
import type { ElementId, LayoutKey, Transform } from "../types";
import { DEFAULT_TRANSFORM } from "../types";
import { useEditorContext } from "./EditorProvider";

export type TransformStore = Partial<Record<LayoutKey, Partial<Record<ElementId, Partial<Transform>>>>>;

/**
 * Sostituisce useLabelOffsets / useIllustrationOffsets / la metà "transform"
 * di useOverlayModules: un unico hook generico, per elemento e per layout.
 * In produzione (editingEnabled=false) ritorna sempre e solo il default del
 * progetto, senza mai toccare lo storage.
 */
export function useEditableTransform(domain: string, elementId: ElementId, base: Partial<Transform> = {}) {
  const { adapter, layout, editingEnabled } = useEditorContext();
  const backend = adapter.persistence.backend;
  const [store, setStore] = useState<TransformStore>({});

  useEffect(() => {
    if (!editingEnabled) return;
    setStore(backend.read(domain) as TransformStore);
    return backend.subscribe(() => setStore(backend.read(domain) as TransformStore));
  }, [backend, domain, editingEnabled]);

  const resolvedBase: Transform = { ...DEFAULT_TRANSFORM, ...base };
  const transform: Transform = editingEnabled
    ? { ...resolvedBase, ...(store[layout]?.[elementId] ?? {}) }
    : resolvedBase;

  const patch = useCallback(
    (next: Partial<Transform>) => {
      if (!editingEnabled) return;
      setStore((prev) => {
        const layoutSlice = { ...(prev[layout] ?? {}) };
        layoutSlice[elementId] = { ...(layoutSlice[elementId] ?? {}), ...next };
        const out = { ...prev, [layout]: layoutSlice };
        backend.write(domain, out as Record<string, unknown>);
        return out;
      });
    },
    [backend, domain, editingEnabled, elementId, layout],
  );

  const reset = useCallback(() => {
    if (!editingEnabled) return;
    setStore((prev) => {
      const layoutSlice = { ...(prev[layout] ?? {}) };
      delete layoutSlice[elementId];
      const out = { ...prev, [layout]: layoutSlice };
      backend.write(domain, out as Record<string, unknown>);
      return out;
    });
  }, [backend, domain, editingEnabled, elementId, layout]);

  return { transform, patch, reset };
}
