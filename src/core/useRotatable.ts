import { useCallback, useRef, type PointerEvent } from "react";

type RotateState = { startAngle: number; baseRot: number } | null;

function angleDeg(cx: number, cy: number, x: number, y: number): number {
  return (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
}

/**
 * Maniglia di rotazione via gesto, gemella di useDraggable: l'angolo tra il
 * centro dell'elemento e il puntatore, relativo all'angolo iniziale, diventa
 * la rotazione. Nessun grado da digitare: solo trascinare la maniglia lungo
 * un arco. getCenter e' fornito dal chiamante (in pixel schermo) perche' il
 * Core non conosce mai il DOM del progetto host.
 */
export function useRotatable(options: {
  enabled: boolean;
  getCenter: () => { x: number; y: number };
  getBase: () => { rot: number };
  onChange: (next: { rot: number }) => void;
}) {
  const { enabled, getCenter, getBase, onChange } = options;
  const stateRef = useRef<RotateState>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (!enabled) return;
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      const center = getCenter();
      stateRef.current = {
        startAngle: angleDeg(center.x, center.y, e.clientX, e.clientY),
        baseRot: getBase().rot,
      };
    },
    [enabled, getBase, getCenter],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const state = stateRef.current;
      if (!state) return;
      const center = getCenter();
      const current = angleDeg(center.x, center.y, e.clientX, e.clientY);
      onChange({ rot: state.baseRot + (current - state.startAngle) });
    },
    [getCenter, onChange],
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
