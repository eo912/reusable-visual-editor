export type PresetDomain = {
  key: string;
  read(): Record<string, unknown>;
  write(value: Record<string, unknown>): void;
};

/**
 * Registro estensibile di "domini" esportabili/importabili come preset JSON.
 * Sostituisce lo schema fisso a 4 domini (labels/illustrations/camera/modules)
 * di MappaViva: qui ogni modulo/adapter registra la propria slice.
 */
export function createPresetRegistry() {
  const domains = new Map<string, PresetDomain>();
  return {
    register(domain: PresetDomain) {
      domains.set(domain.key, domain);
      return () => domains.delete(domain.key);
    },
    list() {
      return Array.from(domains.values());
    },
  };
}

export type PresetRegistry = ReturnType<typeof createPresetRegistry>;
