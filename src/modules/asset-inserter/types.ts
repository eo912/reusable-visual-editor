import type { AssetRef, ElementId } from "../../types";

/**
 * Un "punto di inserimento" per una famiglia di asset (icone, POI, immagini...).
 * templateId punta a un'istanza gia' dichiarata nel catalog overlay dell'adapter:
 * inserire un asset significa clonare quell'istanza e sostituirne il content.
 */
export type InsertionTemplate<TContent = unknown> = {
  templateId: ElementId;
  /** chiave dentro adapter.assetSources da cui elencare gli asset per questo template */
  assetSourceKey: string;
  /** converte l'asset scelto nel content della nuova istanza */
  toContent: (asset: AssetRef) => Partial<TContent>;
};

/** Le due sole operazioni di useOverlayInstances che servono qui: nessun import diretto del modulo overlay. */
export type OverlayInsertionApi<TContent = unknown> = {
  duplicate: (id: ElementId) => ElementId | null;
  patchContent: (id: ElementId, patch: Partial<TContent>) => void;
};

export type AssetGalleryState = {
  assets: AssetRef[];
  loading: boolean;
};
