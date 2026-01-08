/**
 * Custom error classes for declarative error handling in benchmark suite.
 * All error messages are written for end-users, not developers.
 */

export class BenchmarkError extends Error {
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "BenchmarkError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a required argument or input is missing
 */
export class MissingArgumentError extends BenchmarkError {
  constructor(argumentName: string) {
    super(`Please provide a benchmark name. Example: bench ${argumentName}`, "MISSING_ARGUMENT");
  }
}

/**
 * Thrown when a benchmark with the specified name cannot be found
 */
export class BenchmarkNotFoundError extends BenchmarkError {
  constructor(benchmarkName: string) {
    super(
      `The benchmark "${benchmarkName}" could not be found in your project. Check the spelling or run 'bench --list' to see available benchmarks.`,
      "BENCHMARK_NOT_FOUND",
    );
  }
}

/**
 * Thrown when a benchmark configuration file is invalid or missing
 */
export class ConfigurationError extends BenchmarkError {
  constructor(details: string) {
    super(
      `Configuration problem: ${details}. Make sure your bench.config.* file is valid.`,
      "CONFIGURATION_ERROR",
    );
  }
}

/**
 * Thrown when a module cannot be loaded or transpiled
 */
export class ModuleLoadError extends BenchmarkError {
  constructor(filePath: string, details: string) {
    super(
      `Could not load "${filePath}": ${details}. Check that the file exists and is valid JavaScript/TypeScript.`,
      "MODULE_LOAD_ERROR",
    );
  }
}

/**
 * Thrown when esbuild transpilation fails
 */
export class TranspilationError extends BenchmarkError {
  constructor(filePath: string, originalError: Error) {
    const errorDetail = originalError.message || "Unknown error";
    super(
      `Could not transpile "${filePath}": ${errorDetail}. Check the file syntax and ensure all imports are available.`,
      "TRANSPILATION_ERROR",
    );
  }
}

/**
 * Thrown when an unsupported file extension is encountered
 */
export class UnsupportedFileError extends BenchmarkError {
  constructor(filePath: string) {
    const ext = filePath.split(".").pop();
    super(
      `File format ".${ext}" is not supported. Supported formats: .js, .mjs, .cjs, .ts, .mts, .cts, .json`,
      "UNSUPPORTED_FILE_ERROR",
    );
  }
}

/**
 * Thrown when benchmark discovery fails
 */
export class DiscoveryError extends BenchmarkError {
  constructor(directory: string, details: string) {
    super(
      `Unable to search for benchmarks in "${directory}": ${details}. Check that the directory exists and is accessible.`,
      "DISCOVERY_ERROR",
    );
  }
}

/**
 * Thrown when a benchmark manifest is invalid
 */
export class InvalidManifestError extends BenchmarkError {
  constructor(details: string) {
    super(
      `Benchmark manifest is invalid: ${details}. Review your manifest.js file to ensure it has the required fields.`,
      "INVALID_MANIFEST_ERROR",
    );
  }
}

/**
 * Thrown when benchmark execution fails
 */
export class BenchmarkExecutionError extends BenchmarkError {
  constructor(benchmarkName: string, details: string) {
    super(
      `Error running benchmark "${benchmarkName}": ${details}. Check that all test functions are valid and dependencies are available.`,
      "BENCHMARK_EXECUTION_ERROR",
    );
  }
}

/**
 * Thrown when a function provided to the benchmark is invalid
 */
export class InvalidFunctionError extends BenchmarkError {
  constructor(functionName: string) {
    super(
      `Invalid function "${functionName}": Benchmark functions must be valid JavaScript functions. Check your test case definitions.`,
      "INVALID_FUNCTION_ERROR",
    );
  }
}

/**
 * Create a user-friendly error message with context
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof BenchmarkError) {
    return error.message;
  }

  if (error instanceof Error) {
    return `An unexpected error occurred: ${error.message}`;
  }

  return "An unexpected error occurred";
}
