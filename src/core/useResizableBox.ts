import { useCallback, useRef, type PointerEvent } from "react";

/**
 * Gemella di useResizable, per larghezza e altezza indipendenti invece di un
 * fattore di scala uniforme. Ogni elemento e' ancorato al proprio centro
 * (stesso translate(-50%,-50%) di drag/scale/rotate): la larghezza/altezza
 * desiderata e' quindi il doppio della distanza centro<->puntatore sull'asse
 * interessato, cosi' il bordo trascinato resta sempre sotto il cursore anche
 * se il centro non si sposta mai. A differenza dello scale (fattore
 * relativo) qui il valore e' assoluto e la maniglia parte gia' posizionata
 * sul bordo vero: non serve riportare avanti una base, niente salto.
 *
 * axis="x" -> solo larghezza (maniglie sui bordi est/ovest)
 * axis="y" -> solo altezza (maniglie sui bordi nord/sud)
 * axis="both" -> entrambe insieme (maniglie sugli angoli)
 */
export function useResizableBox(options: {
  enabled: boolean;
  axis: "x" | "y" | "both";
  getCenter: () => { x: number; y: number };
  onChange: (next: Partial<{ w: number; h: number }>) => void;
  min?: number;
  max?: number;
}) {
  const { enabled, axis, getCenter, onChange, min = 24, max = 2000 } = options;
  const draggingRef = useRef(false);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (!enabled) return;
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      draggingRef.current = true;
    },
    [enabled],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const center = getCenter();
      const next: Partial<{ w: number; h: number }> = {};
      if (axis === "x" || axis === "both") {
        next.w = Math.min(max, Math.max(min, Math.abs(e.clientX - center.x) * 2));
      }
      if (axis === "y" || axis === "both") {
        next.h = Math.min(max, Math.max(min, Math.abs(e.clientY - center.y) * 2));
      }
      onChange(next);
    },
    [axis, getCenter, max, min, onChange],
  );

  const onPointerUp = useCallback((e: PointerEvent) => {
    if (draggingRef.current) (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    draggingRef.current = false;
  }, []);

  const onPointerCancel = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
