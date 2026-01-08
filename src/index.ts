import discoveryManager from "./discovery/discoveryManager.ts";
import {
  BenchmarkError,
  BenchmarkNotFoundError,
  MissingArgumentError,
  formatErrorMessage,
} from "./errors/BenchmarkError.ts";
import { runFunctionsBenchmark } from "./utils/runFunctions.ts";

/**
 * Main entry point for running benchmarks.
 */
async function main() {
  const testName = process.argv[2];

  if (!testName) {
    throw new MissingArgumentError("benchmark-name");
  }

  console.log(`Searching for benchmark: ${testName}`);

  const result = await discoveryManager.findBenchmarkByName(testName);

  if (!result) {
    throw new BenchmarkNotFoundError(testName);
  }

  console.log(`Found at: ${result.path}`);

  if (result.type === "functions") {
    await runFunctionsBenchmark(result);
  } else {
    throw new BenchmarkError(
      "HTTP benchmarks are not yet implemented. Only function benchmarks are supported.",
      "NOT_IMPLEMENTED",
    );
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    const message = formatErrorMessage(err);
    console.error(`\n❌ ${message}\n`);
    process.exit(1);
  });
}
