import type { Transform } from "../../types";

export type BackgroundTransform = Pick<Transform, "dx" | "dy" | "scale" | "opacity">;

export type BackgroundConfig = {
  assetId?: string;
  color?: string;
};

export const DEFAULT_BACKGROUND_TRANSFORM: BackgroundTransform = { dx: 0, dy: 0, scale: 1, opacity: 1 };
