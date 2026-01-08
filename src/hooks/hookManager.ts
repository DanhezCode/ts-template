import configManager from "../config/configManager.ts";
import { formatErrorMessage } from "../errors/BenchmarkError.ts";

/**
 * Hook manager for executing custom code at specific points in the benchmark lifecycle.
 */
class HookManager {
  /**
   * Executes hooks for a specific event.
   * @param {string} hookName - Name of the hook (e.g., 'preBenchmark')
   * @param {object} context - Context object passed to hooks
   */
  async execute(hookName: string, context: unknown = {}) {
    const hooks = configManager.resolve(`hooks.${hookName}`, {}, {}) as ((
      ...args: unknown[]
    ) => unknown)[];
    if (!Array.isArray(hooks)) return;

    for (const hook of hooks) {
      if (typeof hook === "function") {
        try {
          await hook(context);
        } catch (error) {
          const message = formatErrorMessage(error);
          console.warn(`⚠️ Hook "${hookName}" encountered an issue: ${message}`);
          // Continue execution despite hook errors
        }
      }
    }
  }

  /**
   * Registers a hook.
   * @param {string} hookName - Name of the hook
   * @param {function} hookFn - Hook function
   */
  register(hookName: string, hookFn: (...args: unknown[]) => unknown) {
    const hooks = configManager.resolve(`hooks.${hookName}`, {}, {}) as ((
      ...args: unknown[]
    ) => unknown)[];
    hooks.push(hookFn);
    // Note: In a real implementation, you might need to update the config
    // For simplicity, assuming hooks are set in config file
  }
}

export default new HookManager();
