import { useCallback, useEffect, useMemo, useState } from "react";
import { useEditorContext } from "../../core/EditorProvider";
import type { ElementId, LayoutKey, Timing, Transform } from "../../types";
import { DEFAULT_TIMING, DEFAULT_TRANSFORM } from "../../types";
import type { OverlayEntry, OverlayInstance, ResolvedOverlayInstance } from "./types";

const DOMAIN = "overlay";

export type OverlayStore<TContent = unknown> = Record<ElementId, OverlayEntry<TContent>>;

function resolveOne<TContent>(
  base: OverlayInstance<TContent>,
  entry: OverlayEntry<TContent>,
  layout: LayoutKey,
): ResolvedOverlayInstance<TContent> {
  const layoutOverride = entry.layouts?.[layout] ?? {};
  return {
    ...base,
    enabled: entry.enabled ?? base.enabled,
    content: { ...base.content, ...(entry.content ?? {}) },
    timing: { ...DEFAULT_TIMING, ...base.timing, ...(entry.timing ?? {}) },
    transform: { ...DEFAULT_TRANSFORM, ...base.base, ...layoutOverride },
  };
}

/**
 * Generalizza useOverlayModules.ts di MappaViva: CRUD di istanze (transform
 * per layout, content e timing comuni, duplicazione/rimozione), ma senza
 * alcun kind hardcoded — il catalogo e i renderer arrivano dall'adapter.
 */
export function useOverlayInstances<TContent>(catalog: OverlayInstance<TContent>[]) {
  const { adapter, layout, editingEnabled } = useEditorContext();
  const backend = adapter.persistence.backend;
  const [store, setStore] = useState<OverlayStore<TContent>>({});

  useEffect(() => {
    if (!editingEnabled) return;
    setStore(backend.read(DOMAIN) as OverlayStore<TContent>);
    return backend.subscribe(() => setStore(backend.read(DOMAIN) as OverlayStore<TContent>));
  }, [backend, editingEnabled]);

  const write = useCallback(
    (next: OverlayStore<TContent>) => backend.write(DOMAIN, next as Record<string, unknown>),
    [backend],
  );

  const activeStore = editingEnabled ? store : ({} as OverlayStore<TContent>);

  const instances = useMemo(() => {
    const out = catalog.map((base) => resolveOne(base, activeStore[base.id] ?? {}, layout));
    for (const [id, entry] of Object.entries(activeStore)) {
      if (!entry.cloneOf || catalog.some((c) => c.id === id)) continue;
      const src = catalog.find((c) => c.id === entry.cloneOf);
      if (!src) continue;
      out.push(resolveOne({ ...src, id, cloneOf: entry.cloneOf }, entry, layout));
    }
    return out;
  }, [activeStore, catalog, layout]);

  const patchTransform = useCallback(
    (id: ElementId, patch: Partial<Transform>) => {
      if (!editingEnabled) return;
      setStore((prev) => {
        const entry = prev[id] ?? {};
        const layouts = { ...(entry.layouts ?? {}) };
        layouts[layout] = { ...(layouts[layout] ?? {}), ...patch };
        const next = { ...prev, [id]: { ...entry, layouts } };
        write(next);
        return next;
      });
    },
    [editingEnabled, layout, write],
  );

  const patchContent = useCallback(
    (id: ElementId, patch: Partial<TContent>) => {
      if (!editingEnabled) return;
      setStore((prev) => {
        const entry = prev[id] ?? {};
        const next = { ...prev, [id]: { ...entry, content: { ...(entry.content ?? {}), ...patch } } };
        write(next);
        return next;
      });
    },
    [editingEnabled, write],
  );

  const patchTiming = useCallback(
    (id: ElementId, patch: Partial<Timing>) => {
      if (!editingEnabled) return;
      setStore((prev) => {
        const entry = prev[id] ?? {};
        const next = { ...prev, [id]: { ...entry, timing: { ...(entry.timing ?? {}), ...patch } } };
        write(next);
        return next;
      });
    },
    [editingEnabled, write],
  );

  const setEnabled = useCallback(
    (id: ElementId, enabled: boolean) => {
      if (!editingEnabled) return;
      setStore((prev) => {
        const next = { ...prev, [id]: { ...(prev[id] ?? {}), enabled } };
        write(next);
        return next;
      });
    },
    [editingEnabled, write],
  );

  const duplicate = useCallback(
    (id: ElementId): ElementId | null => {
      if (!editingEnabled) return null;
      const src = instances.find((m) => m.id === id);
      if (!src) return null;
      const originId = src.cloneOf ?? src.id;
      const newId = `${originId}-copy-${Date.now().toString(36)}`;
      setStore((prev) => {
        const entry = prev[id] ?? {};
        const next: OverlayStore<TContent> = {
          ...prev,
          [newId]: {
            ...entry,
            cloneOf: originId,
            layouts: JSON.parse(JSON.stringify(entry.layouts ?? {})),
          },
        };
        write(next);
        return next;
      });
      return newId;
    },
    [editingEnabled, instances, write],
  );

  const removeClone = useCallback(
    (id: ElementId) => {
      if (!editingEnabled) return;
      setStore((prev) => {
        if (!prev[id]?.cloneOf) return prev;
        const next = { ...prev };
        delete next[id];
        write(next);
        return next;
      });
    },
    [editingEnabled, write],
  );

  const resetLayout = useCallback(
    (id?: ElementId) => {
      if (!editingEnabled) return;
      setStore((prev) => {
        const next: OverlayStore<TContent> = {};
        for (const [k, entry] of Object.entries(prev)) {
          if (id && k !== id) {
            next[k] = entry;
            continue;
          }
          const layouts = { ...(entry.layouts ?? {}) };
          delete layouts[layout];
          next[k] = { ...entry, layouts };
        }
        write(next);
        return next;
      });
    },
    [editingEnabled, layout, write],
  );

  return { instances, patchTransform, patchContent, patchTiming, setEnabled, duplicate, removeClone, resetLayout };
}
