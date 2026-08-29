export type CameraTrim = { dx: number; dy: number; zoom: number };

export type CameraTrimLimits = { maxXY: number; minZoom: number; maxZoom: number };

export const DEFAULT_CAMERA_TRIM_LIMITS: CameraTrimLimits = { maxXY: 0.08, minZoom: 0.85, maxZoom: 1.15 };

export const NO_TRIM: CameraTrim = { dx: 0, dy: 0, zoom: 1 };
