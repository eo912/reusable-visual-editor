export type LayoutKey = string;

export const DEFAULT_LAYOUT_KEYS = ["mobile", "tablet", "desktop"] as const;
export type DefaultLayoutKey = (typeof DEFAULT_LAYOUT_KEYS)[number];

/** Helper opzionale: un progetto può usarlo o definire la propria mappatura larghezza→layout. */
export function layoutKeyFor(
  width: number,
  breakpoints: { mobile: number; tablet: number } = { mobile: 640, tablet: 1024 },
): DefaultLayoutKey {
  if (width < breakpoints.mobile) return "mobile";
  if (width < breakpoints.tablet) return "tablet";
  return "desktop";
}
