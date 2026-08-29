import type { CSSProperties, ReactNode } from "react";
import type { Transform } from "../../types";
import type { OverlayRendererMap, ResolvedOverlayInstance } from "./types";

export function overlayStyle(transform: Transform, anchor: { x: number; y: number }): CSSProperties {
  return {
    position: "absolute",
    left: anchor.x,
    top: anchor.y,
    opacity: transform.opacity ?? 1,
    transform: `translate(-50%, -50%) translate(${transform.dx}px, ${transform.dy}px) rotate(${transform.rot ?? 0}deg) scale(${transform.scale ?? 1})`,
    display: transform.hidden ? "none" : undefined,
  };
}

/**
 * Layer runtime minimo: posiziona ogni istanza e delega il corpo visivo al
 * renderer registrato dall'adapter per il suo `kind`. Nessun contenuto
 * grafico vive in questo pacchetto.
 */
export function OverlayLayer<TContent>({
  instances,
  anchorFor,
  renderers,
}: {
  instances: ResolvedOverlayInstance<TContent>[];
  anchorFor: (instance: ResolvedOverlayInstance<TContent>) => { x: number; y: number };
  renderers: OverlayRendererMap<TContent>;
}): ReactNode {
  return instances.map((instance) => {
    const Renderer = renderers[instance.kind];
    if (!Renderer) return null;
    return (
      <div key={instance.id} style={overlayStyle(instance.transform, anchorFor(instance))}>
        {Renderer({ instance })}
      </div>
    );
  });
}
