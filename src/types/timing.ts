export type Timing = {
  fromSec: number;
  toSec: number | null;
  fadeInSec: number;
  fadeOutSec: number;
  /** riferimento opaco a un cue del progetto host (risolto solo dall'adapter) */
  cueIdIn?: string;
  cueIdOut?: string;
};

export const DEFAULT_TIMING: Timing = {
  fromSec: 0,
  toSec: null,
  fadeInSec: 1,
  fadeOutSec: 1,
};
