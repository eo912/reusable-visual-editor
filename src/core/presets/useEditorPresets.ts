import { useCallback } from "react";
import type { PresetRegistry } from "./registry";

export type Preset = {
  kind: "reusable-editor-preset";
  version: 1;
  domains: Record<string, Record<string, unknown>>;
};

export function exportPreset(registry: PresetRegistry): string {
  const out: Preset = { kind: "reusable-editor-preset", version: 1, domains: {} };
  for (const domain of registry.list()) out.domains[domain.key] = domain.read();
  return JSON.stringify(out);
}

export type ApplyResult = { ok: true; domains: string[] } | { ok: false; error: string };

/** applica SOLO i domini presenti nel JSON e registrati in questa sessione */
export function applyPreset(registry: PresetRegistry, raw: string): ApplyResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: "JSON non valido" };
  }
  if (!parsed || typeof parsed !== "object") return { ok: false, error: "JSON non valido" };
  const preset = parsed as Partial<Preset>;
  if (preset.kind !== "reusable-editor-preset" || preset.version !== 1 || !preset.domains) {
    return { ok: false, error: "Preset non riconosciuto" };
  }
  const applied: string[] = [];
  for (const domain of registry.list()) {
    const value = preset.domains[domain.key];
    if (value && typeof value === "object") {
      domain.write(value);
      applied.push(domain.key);
    }
  }
  if (applied.length === 0) return { ok: false, error: "Nessun dominio corrispondente nel preset" };
  return { ok: true, domains: applied };
}

export function useEditorPresets(registry: PresetRegistry) {
  const exportJSON = useCallback(() => exportPreset(registry), [registry]);
  const importJSON = useCallback((raw: string) => applyPreset(registry, raw), [registry]);
  return { exportJSON, importJSON };
}
