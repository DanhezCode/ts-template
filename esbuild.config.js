import { build } from "esbuild";

const commonOptions = {
  bundle: true,
  sourcemap: true,
  platform: "node",
  target: "node20",
  entryPoints: ["src/index.ts"],
  external: ["typescript"], // since it's peer dep
};

// await build({
//   ...commonOptions,
//   format: "cjs",
//   outdir: "dist/cjs",
//   outExtension: { ".js": ".cjs" },
// });

// await build({
//   ...commonOptions,
//   format: "esm",
//   outdir: "dist/esm",
//   outExtension: { ".js": ".mjs" },
// });

// Build bin as ESM
await build({
  ...commonOptions,
  format: "esm",
  outdir: "dist/bin",
  outExtension: { ".js": ".js" },
  banner: { js: "#!/usr/bin/env node" },
});
