import { builtinModules } from "module";
import { readFileSync } from "node:fs";
import { resolve, extname } from "node:path";

import { buildSync, type BuildResult } from "esbuild";

import {
  ModuleLoadError,
  TranspilationError,
  UnsupportedFileError,
} from "../errors/BenchmarkError.ts";
/**
 * Imports an ESM module from a JS string using a data URL.
 */
async function importFromString(jsCode: string): Promise<unknown> {
  const base64 = Buffer.from(jsCode).toString("base64");
  const url = `data:text/javascript;base64,${base64}`;

  try {
    const mod = (await import(url)) as unknown;
    return mod;
  } catch (err) {
    throw new ModuleLoadError(
      "[data URL]",
      err instanceof Error ? err.message : "Failed to import transpiled code",
    );
  }
}

/**
 * Extracts JS code from an esbuild result safely.
 */
function getJsFromBuild(result: BuildResult): string {
  if (!result.outputFiles || result.outputFiles.length === 0) {
    throw new ModuleLoadError("[transpilation]", "No output generated during transpilation");
  }

  const file = result.outputFiles[0];

  if (!file || typeof file.text !== "string") {
    throw new ModuleLoadError("[transpilation]", "Invalid transpilation output structure");
  }

  return file.text;
}

/**
 * Transpiles unknown file (TS, CJS, etc.) to ESM using esbuild.
 */
function transpileToEsm(absPath: string): Promise<unknown> {
  let result: BuildResult;
  try {
    result = buildSync({
      entryPoints: [absPath],
      bundle: true,
      format: "esm",
      platform: "node",
      target: "node20",
      sourcemap: "inline",
      write: false,
      external: [...builtinModules, "esbuild"],
    });
  } catch (err) {
    throw new TranspilationError(absPath, err instanceof Error ? err : new Error(String(err)));
  }

  const jsCode = getJsFromBuild(result);
  return importFromString(jsCode);
}

/**
 * Handler function type.
 */
type Handler = (absPath: string) => Promise<unknown>;

/**
 * Handlers by file extension.
 */
const handlers: Record<string, Handler> = {
  ".js": async absPath => {
    // console.log(`[handler .js] Importando directamente: file://${absPath}`);
    return import(`file://${absPath}`) as Promise<unknown>;
  },

  ".mjs": async absPath => {
    // console.log(`[handler .mjs] Importando directamente: file://${absPath}`);
    return import(`file://${absPath}`) as Promise<unknown>;
  },

  ".cjs": async absPath => {
    // console.log(`[handler .cjs] Transpilando CJS → ESM: ${absPath}`);
    return transpileToEsm(absPath);
  },

  ".ts": async absPath => {
    // console.log(`[handler .ts] Transpilando TS → ESM: ${absPath}`);
    return transpileToEsm(absPath);
  },

  ".mts": async absPath => {
    // console.log(`[handler .mts] Transpilando MTS → ESM: ${absPath}`);
    return transpileToEsm(absPath);
  },

  ".cts": async absPath => {
    // console.log(`[handler .cts] Transpilando CTS → ESM: ${absPath}`);
    return transpileToEsm(absPath);
  },

  ".json": async absPath => {
    try {
      const raw = readFileSync(absPath, "utf8");
      const jsCode = `export default ${raw}`;
      return importFromString(jsCode);
    } catch (err) {
      throw new ModuleLoadError(
        absPath,
        err instanceof Error ? err.message : "Failed to read JSON file",
      );
    }
  },
};

/**
 * Universal loader.
 * - Detects extension
 * - Selects handler
 * - Executes handler
 */
export async function loadModule(filePath: string): Promise<unknown> {
  const absPath = resolve(filePath);
  const ext = extname(absPath);

  const handler = handlers[ext];

  if (!handler) {
    throw new UnsupportedFileError(absPath);
  }

  return handler(absPath);
}
