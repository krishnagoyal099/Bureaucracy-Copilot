// src/lib/utils/env.ts
// Client-safe environment variables (no secrets here)
export const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_ASIONE_ENABLED: process.env.NEXT_PUBLIC_ASIONE_ENABLED === "true",
};
