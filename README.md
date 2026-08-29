# reusable-visual-editor

Editor DEV riutilizzabile e agganciabile a più progetti (MappaViva, Safe Drive Lab, ...) senza ricostruirlo ogni volta.

## Principi

- **Core headless**: solo hook, tipi, stato e persistenza. Nessuna UI/JSX generica obbligatoria.
- **Moduli opzionali**: `background`, `text`, `overlay`, `timing`, `camera`, `interaction` — ognuno importabile via subpath, tree-shakeable.
- **Nessuna libreria fissa di asset**: colori, font, icone e immagini arrivano sempre dal progetto host (`assetSources` nell'adapter).
- **Adapter = contratto, non implementazione**: questo pacchetto espone solo `EditorAdapter`/`defineAdapter`. Gli adapter concreti vivono nei repository dei singoli progetti.
- **Overlay via registry `kind → renderer`**: il pacchetto gestisce transform/timing/persistenza delle istanze; il contenuto visivo di ogni `kind` lo fornisce l'adapter.

## Struttura

```
src/
  types/        tipi condivisi (Transform, LayoutKey, Timing, EditorAdapter, ...)
  core/         EditorProvider, useEditableTransform, useDraggable, presets, persistence
  modules/
    background/ stub minimo
    text/       stub minimo
    overlay/    istanze + registry renderer
    timing/     easing dissolvenza in/out
    camera/     correttivo camera per scena/layout
    interaction/ stub minimo: trigger → azioni dichiarative
  adapters/     defineAdapter (solo contratto)
```

## Uso indicativo

```ts
import { EditorProvider, definePersistence } from "reusable-visual-editor/core";
import { defineAdapter } from "reusable-visual-editor/adapters";

const adapter = defineAdapter({
  scenes: ["intro", "journey"],
  layouts: ["mobile", "tablet", "desktop"],
  elements: { /* ... */ },
  persistence: definePersistence({ namespace: "mappaviva" }),
});
```

## Build

```bash
npm install
npm run build      # tsup → dist/ (ESM + .d.ts, entry multipli per subpath export)
npm run typecheck
```

`react`/`react-dom` sono `peerDependencies`: mai bundlati, il progetto host li fornisce.
