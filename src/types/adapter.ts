import type { EditableElementDef } from "./element";
import type { LayoutKey } from "./layout";
import type { AssetSource, PersistenceConfig } from "./persistence";

/**
 * Contratto che ogni progetto host implementa. Vive solo come tipo/factory in
 * questo pacchetto: le istanze concrete restano nei repository dei progetti.
 */
export type EditorAdapter<
  TSceneId extends string = string,
  TLayoutKey extends LayoutKey = LayoutKey,
> = {
  scenes: readonly TSceneId[];
  layouts: readonly TLayoutKey[];
  elements: Record<string, EditableElementDef>;
  assetSources?: Record<string, AssetSource>;
  persistence: PersistenceConfig;
  /** azioni custom del progetto, invocabili dal modulo interaction */
  actions?: Record<string, (...args: unknown[]) => void>;
};
