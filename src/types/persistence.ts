export type AssetRef = { id: string; url: string; label?: string };

/** L'editor non contiene una libreria fissa di asset: ogni progetto fornisce la propria sorgente. */
export type AssetSource = { list(): Promise<AssetRef[]> | AssetRef[] };

export type PersistenceBackend = {
  read(key: string): Record<string, unknown>;
  write(key: string, value: Record<string, unknown>): void;
  subscribe(cb: () => void): () => void;
};

export type PersistenceConfig = { namespace: string; backend: PersistenceBackend };
