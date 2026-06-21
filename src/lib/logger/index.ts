// src/lib/logger/index.ts
// NOTE: pino-pretty uses thread-stream workers which are incompatible with
// Next.js Turbopack. We use plain pino here — logs go to stdout as JSON.
// To pretty-print in dev, pipe output through `| pino-pretty` in your terminal.
import pino from "pino";
import { env } from "@/config/env";

const REDACT_PATHS = [
  "email", "phone", "password", "passwordHash", "token", "accessToken",
  "refreshToken", "address", "income", "*.email", "*.phone", "*.password",
  "*.address", "*.income", "req.headers.authorization", "req.headers.cookie",
];

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  redact: { paths: REDACT_PATHS, censor: "[REDACTED]" },
  // No transport — avoids thread-stream worker incompatibility with Turbopack
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    err: pino.stdSerializers.err,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function withRequestContext(reqId: string) {
  return logger.child({ reqId });
}