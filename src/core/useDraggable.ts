import { useCallback, useRef, type PointerEvent } from "react";

type DragState = { x: number; y: number; baseDx: number; baseDy: number } | null;

/**
 * Unico primitivo di drag del pacchetto. Sostituisce le tre implementazioni
 * duplicate esistenti in MappaViva (label, illustrazioni, moduli overlay):
 * ognuna aveva la propria copia degli stessi pointer handler.
 */
export function useDraggable(options: {
  enabled: boolean;
  getBase: () => { dx: number; dy: number };
  onChange: (next: { dx: number; dy: number }) => void;
  /** conversione px schermo → unità del sistema di coordinate host (default 1:1) */
  pxToUnit?: () => number;
}) {
  const { enabled, getBase, onChange, pxToUnit } = options;
  const dragRef = useRef<DragState>(null);

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      if (!enabled) return;
      e.preventDefault();
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      const base = getBase();
      dragRef.current = { x: e.clientX, y: e.clientY, baseDx: base.dx, baseDy: base.dy };
    },
    [enabled, getBase],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const k = pxToUnit ? pxToUnit() : 1;
      onChange({ dx: drag.baseDx + (e.clientX - drag.x) * k, dy: drag.baseDy + (e.clientY - drag.y) * k });
    },
    [onChange, pxToUnit],
  );

  const onPointerUp = useCallback((e: PointerEvent) => {
    if (dragRef.current) (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    dragRef.current = null;
  }, []);

  const onPointerCancel = useCallback(() => {
    dragRef.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
