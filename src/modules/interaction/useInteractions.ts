import { useCallback } from "react";
import type { Action, InteractionRule, Trigger } from "./types";

export type ActionHandlers = Partial<Record<Action["type"], (action: Action) => void>>;

/**
 * STUB MINIMO: nessun codice esistente (MappaViva non ha interazioni runtime
 * dichiarative oggi). Risolve trigger→azioni verso handler forniti
 * dall'adapter; l'adapter implementa il significato di ogni action.type.
 */
export function useInteractions(rules: InteractionRule[], handlers: ActionHandlers) {
  const dispatch = useCallback(
    (trigger: Trigger) => {
      for (const rule of rules) {
        if (rule.trigger !== trigger) continue;
        handlers[rule.action.type]?.(rule.action);
      }
    },
    [handlers, rules],
  );
  return { dispatch };
}
