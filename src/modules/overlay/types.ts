import type { ReactNode } from "react";
import type { Capabilities, ElementId, Timing, Transform } from "../../types";

export type OverlayInstance<TContent = unknown> = {
  id: ElementId;
  /** dominio libero: l'adapter registra un renderer per ogni kind usato */
  kind: string;
  enabled: boolean;
  capabilities: Capabilities;
  timing: Timing;
  content: TContent;
  base: Transform;
  /** presente solo per le istanze duplicate nell'editor */
  cloneOf?: ElementId;
};

export type OverlayEntry<TContent = unknown> = {
  enabled?: boolean;
  cloneOf?: ElementId;
  content?: Partial<TContent>;
  timing?: Partial<Timing>;
  layouts?: Record<string, Partial<Transform>>;
};

export type ResolvedOverlayInstance<TContent = unknown> = OverlayInstance<TContent> & { transform: Transform };

/** l'adapter fornisce il renderer per ogni kind: il Core non conosce alcun contenuto visivo */
export type OverlayRendererMap<TContent = unknown> = Record<
  string,
  (props: { instance: ResolvedOverlayInstance<TContent> }) => ReactNode
>;
