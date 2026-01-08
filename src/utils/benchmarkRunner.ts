import { InvalidFunctionError } from "../errors/BenchmarkError.ts";
import type { BenchmarkOptions, RunResult } from "../types.ts";

import { calculateStatistics } from "./statisticsCalculator.ts";

/**
 * Runs a benchmark function multiple times and measures times and resources.
 */
export async function runBenchmark(
  fn: (...args: unknown[]) => unknown,
  options: BenchmarkOptions = {},
): Promise<RunResult> {
  if (typeof fn !== "function") {
    throw new InvalidFunctionError("provided function");
  }
  const { params = {}, iterations = Infinity, timeLimit = Infinity, priorityCpu = false } = options;

  const times = [];
  const cpuTimes = [];
  let count = 0;

  let totalCpuTime = 0;
  let peakMem = 0;
  let elapsedTime = 0;

  let initialCpu, iterStart, iterEnd, cpuDelta;
  while (true) {
    if (priorityCpu) {
      iterStart = performance.now();
      initialCpu = process.cpuUsage();
      await fn(params);
      cpuDelta = process.cpuUsage(initialCpu);
      iterEnd = performance.now();
    } else {
      initialCpu = process.cpuUsage();
      iterStart = performance.now();
      await fn(params);
      iterEnd = performance.now();
      cpuDelta = process.cpuUsage(initialCpu);
    }

    const currentMem = process.memoryUsage().rss;

    const cpuCycle = (cpuDelta.user + cpuDelta.system) / 1000;
    peakMem = Math.max(peakMem, currentMem);
    totalCpuTime += cpuCycle; // ms
    elapsedTime += iterEnd - iterStart;

    count++;
    times.push(iterEnd - iterStart);
    cpuTimes.push(cpuCycle);

    if (elapsedTime >= timeLimit || count >= iterations) {
      return {
        times: priorityCpu ? cpuTimes : times,
        cpuTimes,
        count,
        elapsedTime,
        resources: {
          cpuTime: totalCpuTime,
          peakMem,
        },
        statistics: calculateStatistics(times),
      };
    }
  }
}
