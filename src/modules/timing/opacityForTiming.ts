import type { Timing } from "../../types";

function smooth(k: number) {
  const x = Math.min(1, Math.max(0, k));
  return x * x * (3 - 2 * x);
}

/**
 * Dissolvenza in/out generica. `progress` è SEMPRE un 0→1 opaco: il Core non
 * conosce la sorgente del clock (audio, timer, scroll...), quella resta nel
 * progetto host.
 */
export function opacityForTiming(timing: Timing, progress: number, duration: number): number {
  const sec = progress * duration;
  const { fromSec, toSec, fadeInSec, fadeOutSec } = timing;
  const inK = smooth((sec - fromSec) / Math.max(0.001, fadeInSec));
  const outK =
    toSec === null || toSec === undefined ? 1 : 1 - smooth((sec - toSec) / Math.max(0.001, fadeOutSec));
  return Math.max(0, inK * outK);
}
