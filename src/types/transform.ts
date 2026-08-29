export type Rect = { x: number; y: number; w: number; h: number };

export type Transform = {
  dx: number;
  dy: number;
  scale?: number;
  rot?: number;
  opacity?: number;
  w?: number;
  h?: number;
  hidden?: boolean;
};

export const DEFAULT_TRANSFORM: Transform = {
  dx: 0,
  dy: 0,
  scale: 1,
  rot: 0,
  opacity: 1,
  hidden: false,
};

export type TransformLimits = Partial<Record<keyof Omit<Transform, "hidden">, [number, number]>>;

/** Vincola un patch di transform entro i limiti opzionali per singolo campo. */
export function clampTransform(
  patch: Partial<Transform>,
  base: Transform,
  limits: TransformLimits = {},
): Transform {
  const merged: Transform = { ...base, ...patch };
  const c = (key: keyof TransformLimits, value: number | undefined, fallback: number) => {
    const v = value !== undefined && Number.isFinite(value) ? value : fallback;
    const range = limits[key];
    if (!range) return v;
    const [min, max] = range;
    return Math.min(max, Math.max(min, v));
  };
  return {
    dx: c("dx", merged.dx, 0),
    dy: c("dy", merged.dy, 0),
    scale: c("scale", merged.scale, 1),
    rot: c("rot", merged.rot, 0),
    opacity: Math.min(1, Math.max(0, merged.opacity ?? 1)),
    w: merged.w !== undefined ? c("w", merged.w, merged.w) : undefined,
    h: merged.h !== undefined ? c("h", merged.h, merged.h) : undefined,
    hidden: !!merged.hidden,
  };
}
