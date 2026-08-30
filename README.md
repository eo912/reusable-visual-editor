# reusable-visual-editor

Editor DEV riutilizzabile e agganciabile a più progetti (MappaViva, Safe Drive Lab, ...) senza ricostruirlo ogni volta.

## Principi

- **Core headless**: solo hook, tipi, stato e persistenza. Nessuna UI/JSX generica obbligatoria.
- **Moduli opzionali**: `background`, `text`, `overlay`, `timing`, `camera`, `interaction`, `asset-inserter` — ognuno importabile via subpath, tree-shakeable.
- **Nessuna libreria fissa di asset**: colori, font, icone e immagini arrivano sempre dal progetto host (`assetSources` nell'adapter).
- **Adapter = contratto, non implementazione**: questo pacchetto espone solo `EditorAdapter`/`defineAdapter`. Gli adapter concreti vivono nei repository dei singoli progetti.
- **Overlay via registry `kind → renderer`**: il pacchetto gestisce transform/timing/persistenza delle istanze; il contenuto visivo di ogni `kind` lo fornisce l'adapter.

## UI: usabile da chi non programma

Vale per ogni interfaccia costruita sopra gli hook di questo pacchetto — i pannelli di MappaViva, Asset Inserter, qualunque attrezzo futuro, per qualunque progetto host:

- **Niente coordinate numeriche esposte**: niente X/Y, gradi di rotazione, percentuali di scala mostrati o digitabili dall'utente.
- **Niente gergo del pacchetto in UI**: parole come `transform`, `hook`, `adapter`, `template`, `clone` restano nel codice, mai in un'etichetta, un tooltip o un messaggio visibile.
- **Interazioni dirette, mai un campo numerico**: trascinare per spostare, maniglie visive o pizzico per ridimensionare, un controllo circolare/visivo per ruotare. Mai un `input type="number"`, e mai uno slider il cui unico riscontro sia un valore grezzo (`12.3%`, `45°`).

Il pacchetto resta headless e non impone alcuna UI: rispettare questo principio è responsabilità di chi costruisce l'interfaccia sopra gli hook, in ogni progetto host.

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
    asset-inserter/ inserimento asset in scena via clone di template + assetSources (v1: no upload)
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
