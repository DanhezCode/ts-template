import configManager from "../config/configManager.ts";
import { formatErrorMessage } from "../errors/BenchmarkError.ts";

import { DefaultComparatorAdapter } from "./metrics/defaultComparator.ts";
import { DefaultLoggerAdapter } from "./metrics/defaultLogger.ts";

/**
 * Adapter manager for metrics handling.
 */
class AdapterManager {
  adapters: Record<string, unknown> = {};

  constructor() {
    this.adapters = {
      logger: new DefaultLoggerAdapter(),
      comparator: new DefaultComparatorAdapter(),
    };
    this.loadCustomAdapters();
  }

  /**
   * Loads custom adapters from config.
   */
  loadCustomAdapters() {
    try {
      const customAdapters = configManager.resolve("adapters", {}, {}) as Record<string, unknown>;
      for (const [key, AdapterClass] of Object.entries(customAdapters)) {
        if (AdapterClass && typeof AdapterClass === "function") {
          try {
            this.adapters[key] = new (AdapterClass as new () => unknown)();
          } catch (error) {
            console.warn(`⚠️ Failed to initialize adapter "${key}": ${formatErrorMessage(error)}`);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Error loading custom adapters: ${formatErrorMessage(error)}`);
    }
  }

  /**
   * Gets an adapter instance.
   * @param {string} name - Adapter name
   * @returns {object} Adapter instance
   */
  get(name: string): unknown {
    return this.adapters[name] || null;
  }

  /**
   * Registers a custom adapter.
   * @param {string} name - Adapter name
   * @param {function} AdapterClass - Adapter class
   */
  register(name: string, AdapterClass: new () => unknown) {
    this.adapters[name] = new AdapterClass();
  }
}

export default new AdapterManager();
