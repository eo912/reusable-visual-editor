import type { Rect } from "../../types";
import { DEFAULT_CAMERA_TRIM_LIMITS, NO_TRIM, type CameraTrim, type CameraTrimLimits } from "./types";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(v) ? v : 0));
}

export function clampTrim(
  t: Partial<CameraTrim> | undefined,
  limits: CameraTrimLimits = DEFAULT_CAMERA_TRIM_LIMITS,
): CameraTrim {
  if (!t) return NO_TRIM;
  return {
    dx: clamp(t.dx ?? 0, -limits.maxXY, limits.maxXY),
    dy: clamp(t.dy ?? 0, -limits.maxXY, limits.maxXY),
    zoom: clamp(t.zoom ?? 1, limits.minZoom, limits.maxZoom),
  };
}

export function isNeutralTrim(t: CameraTrim) {
  return t.dx === 0 && t.dy === 0 && t.zoom === 1;
}

/**
 * Applica un correttivo leggero sopra un rect "base" (la regia del progetto),
 * mantenendone il centro come riferimento. Il Core non sa mai come il rect
 * base viene calcolato: lo riceve già pronto dall'adapter.
 */
export function applyCameraTrim(base: Rect, trim: CameraTrim | undefined, limits?: CameraTrimLimits): Rect {
  const t = clampTrim(trim, limits);
  if (isNeutralTrim(t)) return base;
  const w = base.w * t.zoom;
  const h = base.h * t.zoom;
  const cx = base.x + base.w / 2 + t.dx * base.w;
  const cy = base.y + base.h / 2 + t.dy * base.h;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}
