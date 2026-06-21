// src/lib/utils/action.ts
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string; details?: unknown };

export const createSuccessResult = <T>(data: T): ActionResult<T> => ({ ok: true, data });
export const createErrorResult = <T = never>(
  code: string, message: string, details?: unknown
): ActionResult<T> => ({ ok: false, code, message, details });
