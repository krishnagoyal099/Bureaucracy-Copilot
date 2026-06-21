// src/lib/ai/retry.ts
import { logger } from "@/lib/logger";

interface RetryOptions {
  retries: number;
  baseMs: number;
  maxMs: number;
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  opts: RetryOptions
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= opts.retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      if (attempt === opts.retries) break;
      const jitter = Math.random() * 200;
      const delay = Math.min(opts.maxMs, opts.baseMs * 2 ** attempt) + jitter;
      logger.warn({ attempt, delayMs: delay, err: (err as Error).message }, "Retrying after error");
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}