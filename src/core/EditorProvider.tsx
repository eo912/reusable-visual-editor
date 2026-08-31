import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { EditorAdapter, LayoutKey } from "../types";

export type EditorContextValue<TAdapter extends EditorAdapter = EditorAdapter> = {
  adapter: TAdapter;
  /** flag esplicito passato dal progetto host: il Core non legge mai import.meta.env.* */
  editingEnabled: boolean;
  editing: boolean;
  setEditing: (value: boolean) => void;
  layout: LayoutKey;
  setLayout: (value: LayoutKey) => void;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider<TAdapter extends EditorAdapter>({
  adapter,
  editingEnabled,
  defaultLayout,
  children,
}: {
  adapter: TAdapter;
  editingEnabled: boolean;
  defaultLayout: LayoutKey;
  children: ReactNode;
}) {
  const [editing, setEditingState] = useState(false);
  const [layout, setLayout] = useState<LayoutKey>(defaultLayout);

  // defaultLayout e' anche un valore live (es. il progetto host lo ricalcola
  // al resize della finestra): se cambia dopo il primo render, risincronizza
  // lo stato interno, altrimenti chi persiste dati per-layout (vedi
  // useOverlayInstances) continuerebbe a scrivere sotto il breakpoint ormai
  // superato.
  useEffect(() => {
    setLayout(defaultLayout);
  }, [defaultLayout]);

  const setEditing = (value: boolean) => {
    if (!editingEnabled) return;
    setEditingState(value);
  };

  const value = useMemo<EditorContextValue>(
    () => ({ adapter, editingEnabled, editing, setEditing, layout, setLayout }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [adapter, editingEnabled, editing, layout],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditorContext<TAdapter extends EditorAdapter = EditorAdapter>() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditorContext must be used within an EditorProvider");
  return ctx as EditorContextValue<TAdapter>;
}
