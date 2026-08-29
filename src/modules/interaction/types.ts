export type Trigger = "click" | "tap" | "hover";

/**
 * Azioni dichiarative, mai JavaScript custom scritto nel singolo progetto
 * (regola esplicita della spec). "emit-event" è la valvola di sfogo per
 * comportamenti realmente specifici del progetto, ma resta un evento con
 * nome+payload, non codice arbitrario.
 */
export type Action =
  | { type: "show"; targetId: string }
  | { type: "hide"; targetId: string }
  | { type: "toggle"; targetId: string }
  | { type: "open-overlay"; targetId: string }
  | { type: "go-to-scene"; sceneId: string }
  | { type: "open-url"; url: string }
  | { type: "play-media"; mediaId: string }
  | { type: "pause-media"; mediaId: string }
  | { type: "emit-event"; eventName: string; payload?: unknown };

export type InteractionRule = { trigger: Trigger; action: Action };
