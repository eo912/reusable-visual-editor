import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "types/index": "src/types/index.ts",
    "core/index": "src/core/index.ts",
    "modules/background/index": "src/modules/background/index.ts",
    "modules/text/index": "src/modules/text/index.ts",
    "modules/overlay/index": "src/modules/overlay/index.ts",
    "modules/timing/index": "src/modules/timing/index.ts",
    "modules/camera/index": "src/modules/camera/index.ts",
    "modules/interaction/index": "src/modules/interaction/index.ts",
    "modules/asset-inserter/index": "src/modules/asset-inserter/index.ts",
    "adapters/index": "src/adapters/index.ts",
  },
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
});
