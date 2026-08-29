import { useEditableTransform } from "../../core/useEditableTransform";
import type { ElementId } from "../../types";
import { DEFAULT_TEXT_TRANSFORM } from "./types";

/**
 * STUB MINIMO: oggi il testo vive solo dentro il content della Callout in
 * modules/overlay. Questo hook lo isola come primitiva a sé, stesso pattern
 * di background/camera (posizione/scala/opacità via useEditableTransform).
 */
export function useText(elementId: ElementId) {
  return useEditableTransform("text", elementId, DEFAULT_TEXT_TRANSFORM);
}
