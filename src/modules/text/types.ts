import type { Transform } from "../../types";

export type TextAlignment = "left" | "center" | "right";

export type TextTransform = Pick<Transform, "dx" | "dy" | "scale" | "opacity">;

export type TextConfig = {
  content: string;
  alignment: TextAlignment;
  /** riferimento opaco a un token di stile del progetto host (font, size, colore) */
  styleRef?: string;
};

export const DEFAULT_TEXT_TRANSFORM: TextTransform = { dx: 0, dy: 0, scale: 1, opacity: 1 };
