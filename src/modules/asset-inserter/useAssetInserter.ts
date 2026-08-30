import { useCallback, useEffect, useState } from "react";
import type { AssetRef, AssetSource, ElementId } from "../../types";
import type { AssetGalleryState, InsertionTemplate, OverlayInsertionApi } from "./types";

/**
 * Compone useOverlayInstances (duplicate + patchContent) con gli assetSources
 * dell'adapter: espone solo "quali asset scegliere" e "inserisci questo asset
 * nella scena". Chi costruisce la UI non ha bisogno di sapere che sotto c'e'
 * un clone di un'istanza modello — vede solo una lista di asset e una funzione
 * insert(). Nessuna modifica al Core: entrambe le API composte sono gia' pubbliche.
 */
export function useAssetInserter<TContent = unknown>(
  overlay: OverlayInsertionApi<TContent>,
  templates: InsertionTemplate<TContent>[],
  assetSources: Record<string, AssetSource>,
) {
  const [galleries, setGalleries] = useState<Record<ElementId, AssetGalleryState>>({});

  const templateKey = templates.map((t) => `${t.templateId}:${t.assetSourceKey}`).join("|");

  useEffect(() => {
    let cancelled = false;

    for (const template of templates) {
      const source = assetSources[template.assetSourceKey];
      if (!source) continue;

      setGalleries((prev) => ({
        ...prev,
        [template.templateId]: { assets: prev[template.templateId]?.assets ?? [], loading: true },
      }));

      Promise.resolve(source.list()).then((assets) => {
        if (cancelled) return;
        setGalleries((prev) => ({ ...prev, [template.templateId]: { assets, loading: false } }));
      });
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateKey]);

  const galleryFor = useCallback(
    (templateId: ElementId): AssetGalleryState => galleries[templateId] ?? { assets: [], loading: false },
    [galleries],
  );

  const insert = useCallback(
    (template: InsertionTemplate<TContent>, asset: AssetRef): ElementId | null => {
      const id = overlay.duplicate(template.templateId);
      if (!id) return null;
      overlay.patchContent(id, template.toContent(asset));
      return id;
    },
    [overlay],
  );

  return { galleryFor, insert };
}
