import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { ConfigurationError } from "../errors/BenchmarkError.ts";
import { loadModule } from "../utils/loadModule.ts";

const CONFIG_FILES = [
  "bench.config.ts",
  "bench.config.js",
  "bench.config.mjs",
  "bench.config.cjs",
  "bench.config.json",
];

export async function loadUserConfig(): Promise<Record<string, unknown>> {
  const cwd = process.cwd();

  for (const file of CONFIG_FILES) {
    const abs = resolve(cwd, file);
    if (existsSync(abs)) {
      try {
        const mod = await loadModule(abs);

        // soporta default export o named export
        if (mod && typeof mod === "object" && "default" in mod) {
          return (mod as Record<string, unknown>).default as Record<string, unknown>;
        }
        return mod as Record<string, unknown>;
      } catch (err) {
        throw new ConfigurationError(
          err instanceof Error ? err.message : "Failed to load configuration file",
        );
      }
    }
  }

  return {}; // no config found
}
