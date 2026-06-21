// src/lib/ai/services/service-context.ts
export interface ServiceContext {
  userId: string;
  reqId?: string;
  signal?: AbortSignal;
}
