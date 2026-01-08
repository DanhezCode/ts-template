import fs from "fs";
import path from "path";

import configManager from "../config/configManager.ts";
import { DiscoveryError, InvalidManifestError } from "../errors/BenchmarkError.ts";
import type { Benchmark, DiscoveredBenchmark } from "../types";
import { loadModule } from "../utils/loadModule.ts";

/**
 * Benchmark discovery manager.
 */
class DiscoveryManager {
  /**
   * Discovers benchmark manifests in the specified directory.
   */
  async discoverBenchmarks(): Promise<DiscoveredBenchmark[]> {
    const benchmarkDir = configManager.resolve("discovery.benchmarkDir") as string;
    const maxDepth = configManager.resolve("discovery.maxDepth") as number;

    const manifests: DiscoveredBenchmark[] = [];
    await this.scanDirectory(benchmarkDir, manifests, 0, maxDepth);
    return manifests;
  }

  /**
   * Finds a benchmark by name.
   */
  async findBenchmarkByName(name: string): Promise<DiscoveredBenchmark | null> {
    const benchmarkDir = configManager.resolve("discovery.benchmarkDir") as string;
    const maxDepth = configManager.resolve("discovery.maxDepth") as number;

    return await this.scanDirectoryForName(benchmarkDir, name, 0, maxDepth);
  }

  /**
   * Recursively scans a directory for manifest files.
   * @param {string} dir - Directory to scan
   * @param {Array} manifests - Array to store found manifests
   * @param {number} currentDepth - Current depth
   * @param {number} maxDepth - Maximum depth
   */
  async scanDirectory(
    dir: string,
    manifests: DiscoveredBenchmark[],
    currentDepth: number,
    maxDepth: number,
  ) {
    if (currentDepth > maxDepth) return;

    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          await this.scanDirectory(fullPath, manifests, currentDepth + 1, maxDepth);
        } else if (item.startsWith("manifest.") && !item.endsWith(".map")) {
          const manifestPath = path.resolve(fullPath);
          const manifest = await this.loadManifest(manifestPath);
          if (manifest) {
            manifests.push({
              path: path.dirname(manifestPath),
              type: "functions",
              manifest,
            });
          }
        }
      }
    } catch (error) {
      throw new DiscoveryError(dir, error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Recursively scans a directory for a manifest by name.
   * @param {string} dir - Directory to scan
   * @param {string} targetName - Name of the benchmark to find
   * @param {number} currentDepth - Current depth
   * @param {number} maxDepth - Maximum depth
   * @returns {Promise<object|null>} The benchmark object or null
   */
  async scanDirectoryForName(
    dir: string,
    targetName: string,
    currentDepth: number,
    maxDepth: number,
  ): Promise<DiscoveredBenchmark | null> {
    if (currentDepth > maxDepth) return null;

    try {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          const found = await this.scanDirectoryForName(
            fullPath,
            targetName,
            currentDepth + 1,
            maxDepth,
          );
          if (found) return found;
        } else if (item.startsWith("manifest.") && !item.endsWith(".map")) {
          const manifestPath = path.resolve(fullPath);
          const manifest = await this.loadManifest(manifestPath);
          if (manifest && manifest.name === targetName) {
            return {
              path: path.dirname(manifestPath),
              type: "functions",
              manifest,
            };
          }
        }
      }
    } catch (error) {
      throw new DiscoveryError(dir, error instanceof Error ? error.message : "Unknown error");
    }
    return null;
  }

  /**
   * Loads a manifest from file.
   * Uses loadModule for AOT bundling support (TS, CJS, JSON, etc.)
   * @param {string} manifestPath - Path to manifest.js/ts/cjs/json
   * @returns {Promise<object|null>} Promise resolving to loaded manifest or null
   */
  async loadManifest(manifestPath: string): Promise<Benchmark | null> {
    try {
      const module = (await loadModule(manifestPath)) as { default?: Benchmark };
      const manifest = module.default || (module as Benchmark);

      // Validate manifest structure
      if (!manifest || typeof manifest !== "object") {
        throw new InvalidManifestError("Configuration is not a valid object");
      }
      if (!manifest.name || !Array.isArray(manifest.cases) || !Array.isArray(manifest.scenarios)) {
        throw new InvalidManifestError(
          "Missing required properties: 'name', 'cases', or 'scenarios'. All three are required in the manifest.",
        );
      }
      return manifest;
    } catch (error) {
      if (error instanceof InvalidManifestError) {
        throw error;
      }
      throw new InvalidManifestError(
        error instanceof Error ? error.message : "Failed to load manifest file",
      );
    }
  }
}

export default new DiscoveryManager();
