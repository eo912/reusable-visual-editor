import { useEditableTransform } from "../../core/useEditableTransform";
import type { ElementId } from "../../types";
import { DEFAULT_BACKGROUND_TRANSFORM } from "./types";

/**
 * STUB MINIMO: nessun codice esistente da estrarre (in MappaViva lo sfondo
 * mappa è SVG hardcoded, non un elemento editabile). Riusa useEditableTransform
 * di core/ per asset+colore+position/scale/opacity, coerente col resto.
 */
export function useBackground(elementId: ElementId) {
  return useEditableTransform("background", elementId, DEFAULT_BACKGROUND_TRANSFORM);
}
