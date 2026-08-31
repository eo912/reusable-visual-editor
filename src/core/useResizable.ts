import { useCallback, useRef, type PointerEvent } from "react";

type ResizeState = { startDistance: number; baseScale: number } | null;

function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

/**
 * Maniglia di ridimensionamento via gesto, gemella di useDraggable: la
 * distanza puntatore↔centro dell'elemento, relativa alla distanza iniziale,
 * diventa il fattore di scala. Nessun numero da digitare: solo trascinare
 * la maniglia. getCenter e' fornito dal chiamante (in pixel schermo) perche'
 * il Core non conosce mai il DOM del progetto host.
 */
export function useResizable(options: {
  enabled: boolean;
  getCenter: () => { x: number; y: number };
  getBase: () => { scale: number };
  onChange: (next: { scale: number }) => void;
  min?: number;
  max?: number;
}) {
  const { enabled, getCenter, getBase, onChange, min = 0.4, max = 3 } = options;
  const stateRef = useRef<ResizeState>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (!enabled) return;
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      const center = getCenter();
      const startDistance = distance(e.clientX, e.clientY, center.x, center.y) || 1;
      stateRef.current = { startDistance, baseScale: getBase().scale };
    },
    [enabled, getBase, getCenter],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const state = stateRef.current;
      if (!state) return;
      const center = getCenter();
      const current = distance(e.clientX, e.clientY, center.x, center.y);
      const ratio = current / state.startDistance;
      onChange({ scale: Math.min(max, Math.max(min, state.baseScale * ratio)) });
    },
    [getCenter, max, min, onChange],
  );

  const onPointerUp = useCallback((e: PointerEvent) => {
    if (stateRef.current) (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    stateRef.current = null;
  }, []);

  const onPointerCancel = useCallback(() => {
    stateRef.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
